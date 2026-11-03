require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function main() {
  const correo = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const clave = process.env.ADMIN_PASSWORD || '';

  if (!correo || clave.length < 10) {
    throw new Error('Define ADMIN_EMAIL y ADMIN_PASSWORD (mínimo 10 caracteres) en tu .env');
  }

  const hash = await bcrypt.hash(clave, 12);
  const resultado = await pool.query(
    `INSERT INTO usuarios (nombre, correo, password_hash, rol)
     VALUES ($1, $2, $3, 'admin')
     ON CONFLICT (correo) DO NOTHING`,
    ['Administrador', correo, hash]
  );

  console.log(resultado.rowCount ? 'Administrador creado.' : 'Ese correo ya existe, no se modificó.');
  await pool.end();
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});