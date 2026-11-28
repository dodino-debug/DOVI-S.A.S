const pool = require('../config/db');
const { notificar } = require('../services/notificaciones');
const { ESTADO_SOLICITUD } = require('../config/estados');

function errorValidacion(mensaje) {
  const error = new Error(mensaje);
  error.validacion = true;
  return error;
}

const DESDE = `
  FROM solicitudes s
  JOIN usuarios  c  ON c.id_usuario   = s.id_cliente
  JOIN fincas    f  ON f.id_finca     = s.id_finca
  JOIN servicios sv ON sv.id_servicio = s.id_servicio`;

const SIN_LABOR_ACTIVA = `NOT EXISTS (SELECT 1 FROM labores l
                                       WHERE l.id_solicitud = s.id_solicitud
                                         AND l.estado_labor <> 'CANCELADA')`;

async function listar({ estado }) {
  const { rows } = await pool.query(
    `SELECT s.id_solicitud AS id, c.nombre_completo AS cliente, f.nombre_predio AS predio,
            sv.nombre_servicio AS servicio,
            TO_CHAR(s.fecha_esperada, 'YYYY-MM-DD') AS fecha_deseada,
            s.estado_solicitud AS estado,
            (s.estado_solicitud IN ('APROBADA', 'REAGENDADA') AND ${SIN_LABOR_ACTIVA}) AS por_programar
       ${DESDE}
      WHERE ($1::text IS NULL OR s.estado_solicitud = $1::text)
      ORDER BY CASE s.estado_solicitud WHEN 'PENDIENTE' THEN 0 WHEN 'REAGENDADA' THEN 1
                                       WHEN 'APROBADA' THEN 2 ELSE 3 END,
               s.fecha_creacion DESC, s.id_solicitud DESC
      LIMIT 200`,
    [estado]
  );
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(
    `SELECT s.id_solicitud AS id, s.estado_solicitud AS estado,
            s.detalles_adicionales AS detalles, s.nota_admin,
            TO_CHAR(s.fecha_esperada, 'YYYY-MM-DD') AS fecha_deseada,
            TO_CHAR(s.fecha_creacion AT TIME ZONE 'America/Bogota', 'YYYY-MM-DD HH24:MI') AS creada,
            c.id_usuario AS cliente_id, c.nombre_completo AS cliente, c.telefono,
            f.nombre_predio AS predio, f.ubicacion, f.hectareas,
            sv.nombre_servicio AS servicio,
            ${SIN_LABOR_ACTIVA} AS sin_labor_activa
       ${DESDE}
      WHERE s.id_solicitud = $1`,
    [id]
  );
  return rows[0] || null;
}

async function pendientesDeProgramar() {
  const { rows } = await pool.query(
    `SELECT s.id_solicitud AS id, c.nombre_completo AS cliente, f.nombre_predio AS predio,
            f.ubicacion, sv.nombre_servicio AS servicio,
            TO_CHAR(s.fecha_esperada, 'YYYY-MM-DD') AS fecha_deseada
       ${DESDE}
      WHERE s.estado_solicitud IN ('APROBADA', 'REAGENDADA') AND ${SIN_LABOR_ACTIVA}
      ORDER BY s.fecha_esperada, s.id_solicitud`
  );
  return rows;
}

const NUEVO_ESTADO = { aprobar: 'APROBADA', rechazar: 'RECHAZADA', reagendar: 'REAGENDADA' };

function mensajeCliente(accion, id, servicio, fecha, nota) {
  const base = {
    aprobar: `Tu solicitud #${id} (${servicio}) fue aprobada.`,
    rechazar: `Tu solicitud #${id} (${servicio}) fue rechazada.`,
    reagendar: `Tu solicitud #${id} (${servicio}) fue reagendada para el ${fecha}.`
  }[accion];
  return nota ? `${base} ${nota}` : base;
}

// RF6: aprobar, rechazar o reagendar. Notifica al cliente (RF13) en la misma transacción.
// Devuelve null si la solicitud no existe.
async function decidir(id, { accion, nota, fecha, adminId }) {
  const nuevo = NUEVO_ESTADO[accion];
  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    const actual = await db.query(
      `SELECT s.estado_solicitud AS estado, s.id_cliente, sv.nombre_servicio AS servicio,
              TO_CHAR(s.fecha_esperada, 'YYYY-MM-DD') AS fecha_anterior,
              TO_CHAR((CLOCK_TIMESTAMP() AT TIME ZONE 'America/Bogota')::date, 'YYYY-MM-DD') AS hoy
         FROM solicitudes s
         JOIN servicios sv ON sv.id_servicio = s.id_servicio
        WHERE s.id_solicitud = $1
          FOR UPDATE OF s`,
      [id]
    );
    if (!actual.rows[0]) {
      await db.query('ROLLBACK');
      return null;
    }

    const { estado, id_cliente: clienteId, servicio, fecha_anterior: fechaAnterior, hoy } = actual.rows[0];
    if (estado !== 'PENDIENTE' && estado !== 'REAGENDADA') {
      throw errorValidacion(
        `La solicitud ya está en estado "${ESTADO_SOLICITUD[estado]}" y no se puede cambiar.`
      );
    }

    const activa = await db.query(
      "SELECT 1 FROM labores WHERE id_solicitud = $1 AND estado_labor <> 'CANCELADA' LIMIT 1",
      [id]
    );
    if (activa.rowCount) throw errorValidacion('La solicitud ya tiene una labor programada.');
    if (accion === 'reagendar' && (!fecha || fecha < hoy || fecha === fechaAnterior)) {
      throw errorValidacion('Selecciona una fecha válida distinta de la fecha actual de la solicitud.');
    }

    await db.query(
      `UPDATE solicitudes
          SET estado_solicitud = $2,
              nota_admin = $3::text,
              fecha_esperada = COALESCE($4::date, fecha_esperada)
        WHERE id_solicitud = $1`,
      [id, nuevo, nota || null, fecha || null]
    );

    await db.query(
      `INSERT INTO solicitud_historial (id_solicitud, id_admin, accion, fecha_anterior, fecha_nueva)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, adminId, nuevo, fechaAnterior, fecha || fechaAnterior]
    );
    await notificar(db, [clienteId], mensajeCliente(accion, id, servicio, fecha, nota), '/cliente/solicitudes');

    await db.query('COMMIT');
    return { estado: nuevo };
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  } finally {
    db.release();
  }
}

async function listarPorCliente(clienteId) {
  const { rows } = await pool.query(
    `SELECT s.id_solicitud AS id, s.estado_solicitud AS estado, s.nota_admin,
            TO_CHAR(s.fecha_esperada, 'YYYY-MM-DD') AS fecha_deseada,
            f.nombre_predio AS predio, sv.nombre_servicio AS servicio
       FROM solicitudes s
       JOIN fincas f ON f.id_finca = s.id_finca
       JOIN servicios sv ON sv.id_servicio = s.id_servicio
      WHERE s.id_cliente = $1
      ORDER BY s.fecha_creacion DESC, s.id_solicitud DESC`,
    [clienteId]
  );
  return rows;
}

async function crearPendiente(clienteId, { predio, servicio, fecha, detalles }) {
  const { rowCount } = await pool.query(
    `WITH nueva AS (
     INSERT INTO solicitudes (id_cliente, id_finca, id_servicio, fecha_esperada, detalles_adicionales)
     SELECT u.id_usuario, f.id_finca, sv.id_servicio, $4::date, $5
       FROM fincas f
       JOIN usuarios u ON u.id_usuario = f.id_cliente
       JOIN servicios sv ON sv.id_servicio = $3
      WHERE u.id_usuario = $1 AND u.rol = 'CLIENTE' AND u.estado = 'ACTIVO'
        AND f.id_finca = $2 AND f.estado = 'ACTIVO' AND sv.estado = 'ACTIVO'
        AND $4::date >= (NOW() AT TIME ZONE 'America/Bogota')::date
      FOR SHARE OF u, f, sv
      RETURNING id_solicitud
     ), avisos AS (
       INSERT INTO notificaciones (id_usuario, mensaje, enlace)
       SELECT u.id_usuario, 'Nueva solicitud #' || nueva.id_solicitud,
              '/admin/solicitudes/' || nueva.id_solicitud
         FROM nueva CROSS JOIN usuarios u
        WHERE u.rol = 'ADMINISTRADOR' AND u.estado = 'ACTIVO'
     )
     SELECT id_solicitud FROM nueva`,
    [clienteId, predio, servicio, fecha, detalles || null]
  );
  return rowCount > 0;
}

async function listarHistorial(id) {
  const { rows } = await pool.query(
    `SELECT accion,
            TO_CHAR(fecha_anterior, 'YYYY-MM-DD') AS fecha_anterior,
            TO_CHAR(fecha_nueva, 'YYYY-MM-DD') AS fecha_nueva,
            TO_CHAR(fecha_registro AT TIME ZONE 'America/Bogota', 'YYYY-MM-DD HH24:MI') AS registrada
       FROM solicitud_historial
      WHERE id_solicitud = $1
      ORDER BY id_historial DESC`,
    [id]
  );
  return rows;
}


module.exports = { listarPorCliente, crearPendiente, listarHistorial, listar, buscarPorId, pendientesDeProgramar, decidir };
