const pool = require('../config/db');

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

module.exports = { buscarPorCorreo, buscarPorId, actualizarClave };