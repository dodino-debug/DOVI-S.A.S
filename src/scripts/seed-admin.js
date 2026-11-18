require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function main() {
  const correo = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const clave = process.env.ADMIN_PASSWORD || '';
  const telefono = (process.env.ADMIN_TELEFONO || '').trim();

  if (!correo || clave.length < 10) {
    throw new Error('Define ADMIN_EMAIL y ADMIN_PASSWORD (mínimo 10 caracteres) en tu .env');
  }
  if (!/^\+?[0-9]{7,19}$/.test(telefono)) {
    throw new Error('Define ADMIN_TELEFONO en tu .env (solo números, con + opcional, de 7 a 20 caracteres)');
  }

  const hash = await bcrypt.hash(clave, 12);
  const resultado = await pool.query(
    `INSERT INTO usuarios (nombre_completo, correo, contrasena, rol, telefono)
     VALUES ($1, $2, $3, 'ADMINISTRADOR', $4)
     ON CONFLICT (correo) DO NOTHING`,
    ['Administrador', correo, hash, telefono]
  );

  console.log(resultado.rowCount ? 'Administrador creado.' : 'Ese correo ya existe, no se modificó.');
  await pool.end();
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
