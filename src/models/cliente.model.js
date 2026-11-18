// Un cliente es un usuario con rol CLIENTE (así lo define el diagrama entidad-relación).
const pool = require('../config/db');

const escaparLike = (texto) => texto.replace(/[\\%_]/g, '\\$&');

async function listar({ q }) {
  const patron = q ? `%${escaparLike(q)}%` : null;
  const { rows } = await pool.query(
    `SELECT u.id_usuario AS id, u.nombre_completo AS nombre, u.correo, u.telefono,
            (u.estado = 'ACTIVO') AS activo, u.debe_cambiar_clave,
            (SELECT COUNT(*) FROM fincas f
              WHERE f.id_cliente = u.id_usuario AND f.estado = 'ACTIVO')::int AS predios,
            (SELECT COUNT(*) FROM solicitudes s WHERE s.id_cliente = u.id_usuario)::int AS solicitudes
       FROM usuarios u
      WHERE u.rol = 'CLIENTE'
        AND ($1::text IS NULL
             OR u.nombre_completo ILIKE $1::text
             OR u.correo ILIKE $1::text
             OR u.telefono ILIKE $1::text)
      ORDER BY u.nombre_completo`,
    [patron]
  );
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(
    `SELECT id_usuario AS id, nombre_completo AS nombre, correo, telefono,
            (estado = 'ACTIVO') AS activo, debe_cambiar_clave,
            TO_CHAR(fecha_creacion AT TIME ZONE 'America/Bogota', 'YYYY-MM-DD') AS creado
       FROM usuarios
      WHERE id_usuario = $1 AND rol = 'CLIENTE'`,
    [id]
  );
  return rows[0] || null;
}

async function crear({ nombre, correo, telefono, hash }) {
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre_completo, correo, contrasena, rol, telefono, debe_cambiar_clave)
     VALUES ($1, $2, $3, 'CLIENTE', $4, TRUE) RETURNING id_usuario`,
    [nombre, correo, hash, telefono]
  );
  return rows[0].id_usuario;
}

async function actualizar(id, { nombre, correo, telefono }) {
  const resultado = await pool.query(
    `UPDATE usuarios SET nombre_completo = $2, correo = $3, telefono = $4
      WHERE id_usuario = $1 AND rol = 'CLIENTE'`,
    [id, nombre, correo, telefono]
  );
  return resultado.rowCount > 0;
}

module.exports = { listar, buscarPorId, crear, actualizar };
