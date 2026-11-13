const pool = require('../config/db');

function errorValidacion(mensaje) {
  const error = new Error(mensaje);
  error.validacion = true;
  return error;
}

const escaparLike = (texto) => texto.replace(/[\\%_]/g, '\\$&');

async function listar({ q }) {
  const patron = q ? `%${escaparLike(q)}%` : null;
  const { rows } = await pool.query(
    `SELECT c.id, c.nombre, c.documento, c.telefono, u.correo,
            (u.id IS NOT NULL) AS tiene_acceso,
            COALESCE(u.activo, FALSE) AS acceso_activo,
            (SELECT COUNT(*) FROM predios p WHERE p.cliente_id = c.id AND p.activo)::int AS predios,
            (SELECT COUNT(*) FROM solicitudes s WHERE s.cliente_id = c.id)::int AS solicitudes
       FROM clientes c
       LEFT JOIN usuarios u ON u.id = c.usuario_id
      WHERE $1::text IS NULL
         OR c.nombre ILIKE $1::text
         OR c.documento ILIKE $1::text
         OR u.correo ILIKE $1::text
      ORDER BY c.nombre`,
    [patron]
  );
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(
    `SELECT c.id, c.usuario_id, c.nombre,
            COALESCE(c.documento, '') AS documento,
            COALESCE(c.telefono, '') AS telefono,
            COALESCE(c.direccion_contacto, '') AS direccion_contacto,
            COALESCE(u.correo, '') AS correo,
            (u.id IS NOT NULL) AS tiene_acceso,
            COALESCE(u.activo, FALSE) AS acceso_activo,
            TO_CHAR(c.creado_en AT TIME ZONE 'America/Bogota', 'YYYY-MM-DD') AS creado
       FROM clientes c
       LEFT JOIN usuarios u ON u.id = c.usuario_id
      WHERE c.id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function crearUsuario(db, { nombre, correo, telefono, hash }) {
  const { rows } = await db.query(
    `INSERT INTO usuarios (nombre, correo, password_hash, rol, telefono, debe_cambiar_clave)
     VALUES ($1, $2, $3, 'cliente', $4, TRUE) RETURNING id`,
    [nombre, correo, hash, telefono || null]
  );
  return rows[0].id;
}

// Devuelve el id del cliente nuevo. Si trae correo y hash, crea también su acceso.
async function crear(datos) {
  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    const usuarioId = datos.correo && datos.hash ? await crearUsuario(db, datos) : null;
    const { rows } = await db.query(
      `INSERT INTO clientes (usuario_id, nombre, documento, telefono, direccion_contacto)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [
        usuarioId,
        datos.nombre,
        datos.documento || null,
        datos.telefono || null,
        datos.direccion || null
      ]
    );
    await db.query('COMMIT');
    return rows[0].id;
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  } finally {
    db.release();
  }
}

// Devuelve null si el cliente no existe, o { accesoCreado }.
async function actualizar(id, datos) {
  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    const { rows } = await db.query('SELECT usuario_id FROM clientes WHERE id = $1 FOR UPDATE', [id]);
    if (!rows[0]) {
      await db.query('ROLLBACK');
      return null;
    }

    let usuarioId = rows[0].usuario_id;
    let accesoCreado = false;

    if (usuarioId) {
      if (!datos.correo) {
        throw errorValidacion('El correo es obligatorio porque este cliente tiene acceso a la plataforma.');
      }
      await db.query(
        'UPDATE usuarios SET nombre = $2, correo = $3, telefono = $4 WHERE id = $1',
        [usuarioId, datos.nombre, datos.correo, datos.telefono || null]
      );
    } else if (datos.correo && datos.hash) {
      usuarioId = await crearUsuario(db, datos);
      accesoCreado = true;
    }

    await db.query(
      `UPDATE clientes
          SET usuario_id = $2, nombre = $3, documento = $4, telefono = $5, direccion_contacto = $6
        WHERE id = $1`,
      [
        id,
        usuarioId,
        datos.nombre,
        datos.documento || null,
        datos.telefono || null,
        datos.direccion || null
      ]
    );

    await db.query('COMMIT');
    return { accesoCreado };
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  } finally {
    db.release();
  }
}

module.exports = { listar, buscarPorId, crear, actualizar };    