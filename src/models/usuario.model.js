const pool = require('../config/db');

async function buscarPorCorreo(correo) {
  const { rows } = await pool.query(
    'SELECT id, nombre, correo, password_hash, rol, activo FROM usuarios WHERE correo = $1',
    [correo]
  );
  return rows[0] || null;
}

module.exports = { buscarPorCorreo };