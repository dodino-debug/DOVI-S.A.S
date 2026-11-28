const pool = require('../config/db');
const { ROL_DB, ROL_APP } = require('../config/roles');

function errorValidacion(mensaje) {
  const error = new Error(mensaje);
  error.validacion = true;
  return error;
}

// Traduce el rol de la base de datos al código de la aplicación.
// rol_visible distingue al supervisor (empleado con es_supervisor) solo para mostrarlo.
function mapear(fila) {
  if (!fila) return null;
  const rol = ROL_APP[fila.rol];
  return {
    ...fila,
    rol,
    rol_visible: rol === 'empleado' && fila.es_supervisor ? 'supervisor' : rol
  };
}

/* ---------- Autenticación ---------- */

async function buscarPorCorreo(correo) {
  const { rows } = await pool.query(
    `SELECT id_usuario AS id, nombre_completo AS nombre, correo, contrasena AS password_hash,
            rol, (estado = 'ACTIVO') AS activo, debe_cambiar_clave, es_supervisor
       FROM usuarios WHERE correo = $1`,
    [correo]
  );
  return mapear(rows[0]);
}

async function buscarPorId(id) {
  const { rows } = await pool.query(
    `SELECT id_usuario AS id, contrasena AS password_hash, (estado = 'ACTIVO') AS activo
       FROM usuarios WHERE id_usuario = $1`,
    [id]
  );
  return rows[0] || null;
}

async function actualizarClave(id, hash) {
  await pool.query(
    'UPDATE usuarios SET contrasena = $1, debe_cambiar_clave = FALSE WHERE id_usuario = $2',
    [hash, id]
  );
}

async function estadoSesion(id) {
  const { rows } = await pool.query(
    `SELECT nombre_completo AS nombre, rol, (estado = 'ACTIVO') AS activo,
            debe_cambiar_clave, es_supervisor
       FROM usuarios WHERE id_usuario = $1`,
    [id]
  );
  return mapear(rows[0]);
}

async function cerrarSesiones(id, exceptoSid = null) {
  if (exceptoSid) {
    await pool.query(
      `DELETE FROM session WHERE sess->'usuario'->>'id' = $1::text AND sid <> $2`,
      [id, exceptoSid]
    );
    return;
  }
  await pool.query(`DELETE FROM session WHERE sess->'usuario'->>'id' = $1::text`, [id]);
}

/* ---------- Gestión de usuarios ---------- */

// filtro.rol: admin | empleado (sin supervisores) | supervisor | cliente | null
async function listar({ rol, activo }) {
  const rolDb = rol === 'supervisor' ? ROL_DB.empleado : ROL_DB[rol] || null;
  const supervisor = rol === 'supervisor' ? true : rol === 'empleado' ? false : null;

  const { rows } = await pool.query(
    `SELECT u.id_usuario AS id, u.nombre_completo AS nombre, u.correo, u.rol, u.telefono,
            u.es_supervisor, (u.estado = 'ACTIVO') AS activo, u.debe_cambiar_clave,
            sup.nombre_completo AS supervisor,
            (SELECT COUNT(*) FROM supervisor_empleado x WHERE x.id_supervisor = u.id_usuario)::int AS equipo
       FROM usuarios u
       LEFT JOIN supervisor_empleado se ON se.id_empleado = u.id_usuario
       LEFT JOIN usuarios sup ON sup.id_usuario = se.id_supervisor
      WHERE ($1::text IS NULL OR u.rol = $1::text)
        AND ($2::boolean IS NULL OR (u.estado = 'ACTIVO') = $2::boolean)
        AND ($3::boolean IS NULL OR u.es_supervisor = $3::boolean)
      ORDER BY (u.estado = 'ACTIVO') DESC,
               CASE WHEN u.rol = 'ADMINISTRADOR' THEN 1
                    WHEN u.es_supervisor THEN 2
                    WHEN u.rol = 'EMPLEADO' THEN 3
                    ELSE 4 END,
               u.nombre_completo`,
    [rolDb, activo, supervisor]
  );
  return rows.map(mapear);
}

async function buscarDetalle(id) {
  const { rows } = await pool.query(
    `SELECT u.id_usuario AS id, u.nombre_completo AS nombre, u.correo, u.rol, u.telefono,
            (u.estado = 'ACTIVO') AS activo, u.es_supervisor, se.id_supervisor AS supervisor_id
       FROM usuarios u
       LEFT JOIN supervisor_empleado se ON se.id_empleado = u.id_usuario
      WHERE u.id_usuario = $1`,
    [id]
  );
  return mapear(rows[0]);
}

// Supervisores activos, más el actual del empleado aunque esté inactivo.
async function listarSupervisores(incluirId) {
  const { rows } = await pool.query(
    `SELECT id_usuario AS id, nombre_completo AS nombre, (estado = 'ACTIVO') AS activo
       FROM usuarios
      WHERE es_supervisor AND (estado = 'ACTIVO' OR id_usuario = $1::int)
      ORDER BY nombre_completo`,
    [incluirId]
  );
  return rows;
}

async function asignarSupervisor(db, empleadoId, supervisorId) {
  const valido = await db.query(
    `SELECT 1 FROM usuarios s
      WHERE s.id_usuario = $1 AND s.es_supervisor AND s.id_usuario <> $2
        AND (s.estado = 'ACTIVO'
             OR EXISTS (SELECT 1 FROM supervisor_empleado se
                         WHERE se.id_empleado = $2 AND se.id_supervisor = $1))`,
    [supervisorId, empleadoId]
  );
  if (valido.rowCount === 0) {
    throw errorValidacion('El supervisor elegido no existe, no es supervisor o está inactivo.');
  }

  await db.query(
    `INSERT INTO supervisor_empleado (id_empleado, id_supervisor) VALUES ($1, $2)
     ON CONFLICT (id_empleado) DO UPDATE SET id_supervisor = EXCLUDED.id_supervisor`,
    [empleadoId, supervisorId]
  );
}

// rol: admin | empleado. El supervisor se crea como empleado con esSupervisor = true.
async function crear({ nombre, correo, telefono, rol, esSupervisor, hash, supervisorId }) {
  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    const esEmpleado = rol === 'empleado';
    const { rows } = await db.query(
      `INSERT INTO usuarios (nombre_completo, correo, contrasena, rol, telefono, es_supervisor, debe_cambiar_clave)
       VALUES ($1, $2, $3, $4, $5, $6, TRUE) RETURNING id_usuario`,
      [nombre, correo, hash, ROL_DB[rol], telefono, esEmpleado && esSupervisor]
    );
    if (esEmpleado && !esSupervisor && supervisorId) {
      await asignarSupervisor(db, rows[0].id_usuario, supervisorId);
    }
    await db.query('COMMIT');
    return rows[0].id_usuario;
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  } finally {
    db.release();
  }
}

async function actualizar(id, { nombre, correo, telefono, esSupervisor, supervisorId }) {
  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    const actual = await db.query(
      'SELECT rol, es_supervisor FROM usuarios WHERE id_usuario = $1 FOR UPDATE',
      [id]
    );
    if (!actual.rows[0]) {
      await db.query('ROLLBACK');
      return false;
    }

    const esEmpleado = actual.rows[0].rol === ROL_DB.empleado;
    const seraSupervisor = esEmpleado && esSupervisor;

    if (esEmpleado && actual.rows[0].es_supervisor && !seraSupervisor) {
      const equipo = await db.query(
        'SELECT COUNT(*)::int AS n FROM supervisor_empleado WHERE id_supervisor = $1',
        [id]
      );
      if (equipo.rows[0].n > 0) {
        throw errorValidacion(
          'Este supervisor tiene empleados a cargo. Reasígnalos antes de quitarle el rol de supervisor.'
        );
      }
    }

    await db.query(
      `UPDATE usuarios
          SET nombre_completo = $2, correo = $3, telefono = $4, es_supervisor = $5
        WHERE id_usuario = $1`,
      [id, nombre, correo, telefono, seraSupervisor]
    );

    if (esEmpleado) {
      if (seraSupervisor || !supervisorId) {
        await db.query('DELETE FROM supervisor_empleado WHERE id_empleado = $1', [id]);
      } else {
        await asignarSupervisor(db, id, supervisorId);
      }
    }

    await db.query('COMMIT');
    return true;
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  } finally {
    db.release();
  }
}

// Devuelve null si no existe o si es el único administrador activo.
async function cambiarEstado(id, activo) {
  const { rows } = await pool.query(
    `UPDATE usuarios
        SET estado = CASE WHEN $2::boolean THEN 'ACTIVO' ELSE 'INACTIVO' END
      WHERE id_usuario = $1
        AND ($2::boolean
             OR rol <> 'ADMINISTRADOR'
             OR EXISTS (SELECT 1 FROM usuarios o
                         WHERE o.rol = 'ADMINISTRADOR' AND o.estado = 'ACTIVO' AND o.id_usuario <> $1))
      RETURNING nombre_completo AS nombre`,
    [id, activo]
  );
  return rows[0] || null;
}

async function restablecerClave(id, hash) {
  const { rows } = await pool.query(
    `UPDATE usuarios SET contrasena = $2, debe_cambiar_clave = TRUE
      WHERE id_usuario = $1
      RETURNING nombre_completo AS nombre, correo, rol, es_supervisor`,
    [id, hash]
  );
  if (!rows[0]) return null;
  await cerrarSesiones(id);
  return mapear(rows[0]);
}

module.exports = {
  buscarPorCorreo,
  buscarPorId,
  actualizarClave,
  estadoSesion,
  cerrarSesiones,
  listar,
  buscarDetalle,
  listarSupervisores,
  crear,
  actualizar,
  cambiarEstado,
  restablecerClave
};
