const pool = require('../config/db');

function errorValidacion(mensaje) {
  const error = new Error(mensaje);
  error.validacion = true;
  return error;
}

/* ---------- Autenticación ---------- */

async function buscarPorCorreo(correo) {
  const { rows } = await pool.query(
    `SELECT id, nombre, correo, password_hash, rol, activo, debe_cambiar_clave
       FROM usuarios WHERE correo = $1`,
    [correo]
  );
  return rows[0] || null;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(
    'SELECT id, password_hash, activo FROM usuarios WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function actualizarClave(id, hash) {
  await pool.query(
    'UPDATE usuarios SET password_hash = $1, debe_cambiar_clave = FALSE WHERE id = $2',
    [hash, id]
  );
}

async function estadoSesion(id) {
  const { rows } = await pool.query(
    'SELECT nombre, rol, activo, debe_cambiar_clave FROM usuarios WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function cerrarSesiones(id) {
  await pool.query(`DELETE FROM session WHERE sess->'usuario'->>'id' = $1::text`, [id]);
}

/* ---------- Gestión de usuarios ---------- */

async function listar({ rol, activo }) {
  const { rows } = await pool.query(
    `SELECT u.id, u.nombre, u.correo, u.rol, u.telefono, u.activo, u.debe_cambiar_clave,
            sup.nombre AS supervisor,
            (SELECT COUNT(*) FROM empleados_supervisor x WHERE x.supervisor_id = u.id)::int AS equipo
       FROM usuarios u
       LEFT JOIN empleados_supervisor es ON es.empleado_id = u.id
       LEFT JOIN usuarios sup ON sup.id = es.supervisor_id
      WHERE ($1::text IS NULL OR u.rol = $1::text)
        AND ($2::boolean IS NULL OR u.activo = $2::boolean)
      ORDER BY u.activo DESC,
               CASE u.rol WHEN 'admin' THEN 1 WHEN 'supervisor' THEN 2 WHEN 'empleado' THEN 3 ELSE 4 END,
               u.nombre`,
    [rol, activo]
  );
  return rows;
}

async function buscarDetalle(id) {
  const { rows } = await pool.query(
    `SELECT u.id, u.nombre, u.correo, u.rol, COALESCE(u.telefono, '') AS telefono,
            u.activo, es.supervisor_id
       FROM usuarios u
       LEFT JOIN empleados_supervisor es ON es.empleado_id = u.id
      WHERE u.id = $1`,
    [id]
  );
  return rows[0] || null;
}

// Supervisores activos, más el actual del empleado aunque esté inactivo.
async function listarSupervisores(incluirId) {
  const { rows } = await pool.query(
    `SELECT id, nombre, activo FROM usuarios
      WHERE rol = 'supervisor' AND (activo OR id = $1::int)
      ORDER BY nombre`,
    [incluirId]
  );
  return rows;
}

async function asignarSupervisor(db, empleadoId, supervisorId) {
  const valido = await db.query(
    `SELECT 1 FROM usuarios u
      WHERE u.id = $1 AND u.rol = 'supervisor'
        AND (u.activo OR EXISTS (
              SELECT 1 FROM empleados_supervisor es
               WHERE es.empleado_id = $2 AND es.supervisor_id = $1))`,
    [supervisorId, empleadoId]
  );
  if (valido.rowCount === 0) {
    throw errorValidacion('El supervisor elegido no existe o está inactivo.');
  }

  await db.query(
    `INSERT INTO empleados_supervisor (empleado_id, supervisor_id) VALUES ($1, $2)
     ON CONFLICT (empleado_id) DO UPDATE SET supervisor_id = EXCLUDED.supervisor_id`,
    [empleadoId, supervisorId]
  );
}

async function crear({ nombre, correo, telefono, rol, hash, supervisorId }) {
  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    const { rows } = await db.query(
      `INSERT INTO usuarios (nombre, correo, password_hash, rol, telefono, debe_cambiar_clave)
       VALUES ($1, $2, $3, $4, $5, TRUE) RETURNING id`,
      [nombre, correo, hash, rol, telefono || null]
    );
    if (rol === 'empleado' && supervisorId) {
      await asignarSupervisor(db, rows[0].id, supervisorId);
    }
    await db.query('COMMIT');
    return rows[0].id;
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  } finally {
    db.release();
  }
}

async function actualizar(id, { nombre, correo, telefono, supervisorId }) {
  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    const { rows } = await db.query(
      'UPDATE usuarios SET nombre = $2, correo = $3, telefono = $4 WHERE id = $1 RETURNING rol',
      [id, nombre, correo, telefono || null]
    );
    if (!rows[0]) {
      await db.query('ROLLBACK');
      return false;
    }

    if (rows[0].rol === 'empleado') {
      if (supervisorId) {
        await asignarSupervisor(db, id, supervisorId);
      } else {
        await db.query('DELETE FROM empleados_supervisor WHERE empleado_id = $1', [id]);
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
    `UPDATE usuarios SET activo = $2::boolean
      WHERE id = $1
        AND ($2::boolean
             OR rol <> 'admin'
             OR EXISTS (SELECT 1 FROM usuarios o
                         WHERE o.rol = 'admin' AND o.activo AND o.id <> $1))
      RETURNING nombre`,
    [id, activo]
  );
  return rows[0] || null;
}

async function restablecerClave(id, hash) {
  const { rows } = await pool.query(
    `UPDATE usuarios SET password_hash = $2, debe_cambiar_clave = TRUE
      WHERE id = $1 RETURNING nombre, correo, rol`,
    [id, hash]
  );
  if (!rows[0]) return null;
  await cerrarSesiones(id);
  return rows[0];
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