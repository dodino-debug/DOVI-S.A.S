const pool = require('../config/db');
const { notificar, notificarCuadrilla } = require('../services/notificaciones');
const { esTransicionValida } = require('../services/estados-labor');
const { ESTADO_LABOR } = require('../config/estados');

function errorValidacion(mensaje) {
  const error = new Error(mensaje);
  error.validacion = true;
  return error;
}

const CUADRILLA = `
  COALESCE((SELECT STRING_AGG(e.nombre_completo, ', ' ORDER BY e.nombre_completo)
              FROM labor_empleado le
              JOIN usuarios e ON e.id_usuario = le.id_empleado
             WHERE le.id_labor = l.id_labor), 'Sin asignar')`;

const DESDE = `
  FROM labores l
  JOIN solicitudes s ON s.id_solicitud = l.id_solicitud
  JOIN usuarios  c   ON c.id_usuario   = s.id_cliente
  JOIN fincas    f   ON f.id_finca     = s.id_finca
  JOIN servicios sv  ON sv.id_servicio = s.id_servicio`;

async function listar({ estado, desde, hasta }) {
  const { rows } = await pool.query(
    `SELECT l.id_labor AS id, l.id_solicitud AS solicitud_id,
            TO_CHAR(l.fecha_programada, 'YYYY-MM-DD') AS fecha,
            TO_CHAR(l.hora_programada, 'HH24:MI') AS hora,
            l.estado_labor AS estado, c.nombre_completo AS cliente,
            f.nombre_predio AS predio, sv.nombre_servicio AS servicio,
            ${CUADRILLA} AS cuadrilla
       ${DESDE}
      WHERE ($1::text IS NULL OR l.estado_labor = $1::text)
        AND ($2::date IS NULL OR l.fecha_programada >= $2::date)
        AND ($3::date IS NULL OR l.fecha_programada <= $3::date)
      ORDER BY l.fecha_programada DESC, l.hora_programada DESC, l.id_labor DESC
      LIMIT 200`,
    [estado, desde || null, hasta || null]
  );
  return rows;
}

async function listarPorSolicitud(solicitudId) {
  const { rows } = await pool.query(
    `SELECT l.id_labor AS id, TO_CHAR(l.fecha_programada, 'YYYY-MM-DD') AS fecha,
            TO_CHAR(l.hora_programada, 'HH24:MI') AS hora, l.estado_labor AS estado,
            ${CUADRILLA} AS cuadrilla
       ${DESDE}
      WHERE l.id_solicitud = $1
      ORDER BY l.fecha_programada DESC, l.id_labor DESC`,
    [solicitudId]
  );
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(
    `SELECT l.id_labor AS id, l.id_solicitud AS solicitud_id,
            TO_CHAR(l.fecha_programada, 'YYYY-MM-DD') AS fecha,
            TO_CHAR(l.hora_programada, 'HH24:MI') AS hora,
            l.estado_labor AS estado, COALESCE(l.observaciones, '') AS observaciones,
            c.id_usuario AS cliente_id, c.nombre_completo AS cliente,
            f.nombre_predio AS predio, f.ubicacion, sv.nombre_servicio AS servicio
       ${DESDE}
      WHERE l.id_labor = $1`,
    [id]
  );
  if (!rows[0]) return null;

  const cuadrilla = await pool.query(
    `SELECT u.id_usuario AS id, u.nombre_completo AS nombre, u.es_supervisor,
            (u.estado = 'ACTIVO') AS activo
       FROM labor_empleado le
       JOIN usuarios u ON u.id_usuario = le.id_empleado
      WHERE le.id_labor = $1
      ORDER BY u.nombre_completo`,
    [id]
  );
  return { ...rows[0], cuadrilla: cuadrilla.rows };
}

// Empleados activos (los supervisores también son empleados), más los ya asignados aunque estén inactivos.
async function empleadosDisponibles(incluirIds = []) {
  const { rows } = await pool.query(
    `SELECT id_usuario AS id, nombre_completo AS nombre, es_supervisor,
            (estado = 'ACTIVO') AS activo
       FROM usuarios
      WHERE rol = 'EMPLEADO' AND (estado = 'ACTIVO' OR id_usuario = ANY($1::int[]))
      ORDER BY nombre_completo`,
    [incluirIds]
  );
  return rows;
}

async function contextoLabor(db, idLabor) {
  const { rows } = await db.query(
    `SELECT sv.nombre_servicio AS servicio, f.nombre_predio AS predio,
            TO_CHAR(l.fecha_programada, 'YYYY-MM-DD') AS fecha,
            TO_CHAR(l.hora_programada, 'HH24:MI') AS hora
       ${DESDE}
      WHERE l.id_labor = $1`,
    [idLabor]
  );
  return rows[0];
}

// Reemplaza la cuadrilla y avisa solo a los empleados que se agregan (RF8 y RF13).
async function asignarEmpleados(db, idLabor, empleados) {
  const ids = [...new Set(empleados)];

  const validos = await db.query(
    `SELECT id_usuario FROM usuarios
      WHERE id_usuario = ANY($1::int[]) AND rol = 'EMPLEADO' AND estado = 'ACTIVO'
      ORDER BY id_usuario FOR SHARE`,
    [ids]
  );
  if (validos.rowCount !== ids.length) {
    throw errorValidacion('Alguno de los empleados elegidos no existe o está inactivo.');
  }

  const previos = await db.query('SELECT id_empleado FROM labor_empleado WHERE id_labor = $1', [idLabor]);
  const antes = new Set(previos.rows.map((r) => r.id_empleado));

  await db.query('DELETE FROM labor_empleado WHERE id_labor = $1 AND id_empleado <> ALL($2::int[])', [
    idLabor,
    ids
  ]);
  await db.query(
    `INSERT INTO labor_empleado (id_labor, id_empleado)
     SELECT $1::int, UNNEST($2::int[])
     ON CONFLICT DO NOTHING`,
    [idLabor, ids]
  );

  const nuevos = ids.filter((id) => !antes.has(id));
  if (nuevos.length > 0) {
    const c = await contextoLabor(db, idLabor);
    await notificar(
      db,
      nuevos,
      `Se te asignó la labor #${idLabor}: ${c.servicio} en ${c.predio}, el ${c.fecha} a las ${c.hora}.`,
      '/empleado/labores'
    );
  }
}

// RF7: la labor nace PENDIENTE y solo puede salir de una solicitud aprobada sin labor activa.
async function crear({ solicitudId, fecha, hora, empleados }) {
  if (!empleados.length) throw errorValidacion('Selecciona al menos un empleado.');
  const db = await pool.connect();
  try {
    await db.query('BEGIN');

    const solicitud = await db.query(
      `SELECT estado_solicitud AS estado FROM solicitudes WHERE id_solicitud = $1 FOR UPDATE`,
      [solicitudId]
    );
    if (!solicitud.rows[0]) throw errorValidacion('La solicitud elegida no existe.');
    if (!['APROBADA', 'REAGENDADA'].includes(solicitud.rows[0].estado)) {
      throw errorValidacion('Solo se pueden programar solicitudes aprobadas o reagendadas.');
    }

    const activa = await db.query(
      `SELECT 1 FROM labores WHERE id_solicitud = $1 AND estado_labor <> 'CANCELADA' LIMIT 1`,
      [solicitudId]
    );
    if (activa.rowCount > 0) throw errorValidacion('Esta solicitud ya tiene una labor programada.');

    const { rows } = await db.query(
      `INSERT INTO labores (id_solicitud, fecha_programada, hora_programada)
       SELECT $1, $2::date, $3::time
        WHERE $2::date + $3::time >= DATE_TRUNC('minute', CLOCK_TIMESTAMP() AT TIME ZONE 'America/Bogota')
       RETURNING id_labor`,
      [solicitudId, fecha, hora]
    );
    if (!rows[0]) throw errorValidacion('Selecciona una fecha y hora que no hayan pasado.');
    const idLabor = rows[0].id_labor;

    await asignarEmpleados(db, idLabor, empleados);

    await db.query('COMMIT');
    return idLabor;
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  } finally {
    db.release();
  }
}

// Devuelve false si la labor no existe. Solo se puede reprogramar una labor pendiente.
async function actualizar(id, { fecha, hora }) {
  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    const actual = await db.query(
      'SELECT estado_labor AS estado FROM labores WHERE id_labor = $1 FOR UPDATE',
      [id]
    );
    if (!actual.rows[0]) {
      await db.query('ROLLBACK');
      return false;
    }
    if (actual.rows[0].estado !== 'PENDIENTE') {
      throw errorValidacion('Solo se puede editar una labor que esté pendiente.');
    }

    const cambio = await db.query(
      `UPDATE labores SET fecha_programada = $2::date, hora_programada = $3::time
        WHERE id_labor = $1
          AND $2::date + $3::time >= DATE_TRUNC('minute', CLOCK_TIMESTAMP() AT TIME ZONE 'America/Bogota')`,
      [id, fecha, hora]
    );
    if (!cambio.rowCount) throw errorValidacion('Selecciona una fecha y hora que no hayan pasado.');
    await notificarCuadrilla(
      db,
      id,
      `La labor #${id} fue reprogramada para el ${fecha} a las ${hora}.`,
      '/empleado/labores'
    );

    await db.query('COMMIT');
    return true;
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  } finally {
    db.release();
  }
}

// RF8: asignar o reasignar la cuadrilla. Exige al menos un empleado.
async function asignar(id, empleados) {
  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    const actual = await db.query(
      'SELECT estado_labor AS estado FROM labores WHERE id_labor = $1 FOR UPDATE',
      [id]
    );
    if (!actual.rows[0]) {
      await db.query('ROLLBACK');
      return false;
    }
    if (!['PENDIENTE', 'EN PROCESO'].includes(actual.rows[0].estado)) {
      throw errorValidacion('No se puede cambiar la cuadrilla de una labor completada o cancelada.');
    }
    if (empleados.length === 0) throw errorValidacion('Selecciona al menos un empleado.');

    await asignarEmpleados(db, id, empleados);
    await db.query('COMMIT');
    return true;
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  } finally {
    db.release();
  }
}

// RF10: cambia el estado si la transición está permitida. La observación reemplaza a la anterior.
async function cambiarEstado(id, nuevo, observacion) {
  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    const actual = await db.query(
      'SELECT estado_labor AS estado FROM labores WHERE id_labor = $1 FOR UPDATE',
      [id]
    );
    if (!actual.rows[0]) {
      await db.query('ROLLBACK');
      return false;
    }

    const estado = actual.rows[0].estado;
    if (!esTransicionValida(estado, nuevo)) {
      throw errorValidacion(
        `No se puede pasar una labor de "${ESTADO_LABOR[estado]}" a "${ESTADO_LABOR[nuevo]}".`
      );
    }

    await db.query(
      `UPDATE labores
          SET estado_labor = $2,
              observaciones = CASE WHEN $3::text = '' THEN observaciones ELSE $3::text END
        WHERE id_labor = $1`,
      [id, nuevo, observacion || '']
    );

    await db.query('COMMIT');
    return true;
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  } finally {
    db.release();
  }
}

async function listarPorEmpleado(id) {
  const { rows } = await pool.query(
    `SELECT l.id_labor AS id, l.estado_labor AS estado, l.observaciones,
            TO_CHAR(l.fecha_programada, 'YYYY-MM-DD') AS fecha,
            TO_CHAR(l.hora_programada, 'HH24:MI') AS hora,
            sv.nombre_servicio AS servicio, f.nombre_predio AS predio, f.ubicacion
       FROM labor_empleado le
       JOIN labores l ON l.id_labor = le.id_labor
       JOIN solicitudes s ON s.id_solicitud = l.id_solicitud
       JOIN servicios sv ON sv.id_servicio = s.id_servicio
       JOIN fincas f ON f.id_finca = s.id_finca
      WHERE le.id_empleado = $1
      ORDER BY l.fecha_programada, l.hora_programada, l.id_labor`,
    [id]
  );
  return rows;
}

async function actualizarAvance(id, empleadoId, estadoActual, estadoNuevo, observaciones = null) {
  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    // Comparte el orden de bloqueo de la reasignación administrativa.
    await db.query('SELECT 1 FROM labores WHERE id_labor = $1 FOR UPDATE', [id]);
    const { rowCount } = await db.query(
    `UPDATE labores l
        SET estado_labor = $4, observaciones = COALESCE($5, l.observaciones)
      WHERE l.id_labor = $1 AND l.estado_labor = $3
        AND EXISTS (
          SELECT 1 FROM labor_empleado le
          JOIN usuarios u ON u.id_usuario = le.id_empleado
           WHERE le.id_labor = l.id_labor AND le.id_empleado = $2
             AND u.rol = 'EMPLEADO' AND u.estado = 'ACTIVO'
        )`,
    [id, empleadoId, estadoActual, estadoNuevo, observaciones]
    );
    await db.query('COMMIT');
    return rowCount > 0;
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  } finally {
    db.release();
  }
}


module.exports = { listarPorEmpleado, actualizarAvance, 
  listar,
  listarPorSolicitud,
  buscarPorId,
  empleadosDisponibles,
  crear,
  actualizar,
  asignar,
  cambiarEstado
};
