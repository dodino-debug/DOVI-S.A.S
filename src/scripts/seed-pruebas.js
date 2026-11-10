require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Este script no se ejecuta en producción.');
  }

  const clave = process.env.PRUEBAS_PASSWORD || '';
  if (clave.length < 10) {
    throw new Error('Define PRUEBAS_PASSWORD (mínimo 10 caracteres) en tu .env');
  }

  const hash = await bcrypt.hash(clave, 12);
  const usuarios = [
    ['Supervisor de Prueba', 'supervisor@dovi.test', 'supervisor', false],
    ['Empleado de Prueba', 'empleado@dovi.test', 'empleado', true],
    ['Cliente de Prueba', 'cliente@dovi.test', 'cliente', false]
  ];

  for (const [nombre, correo, rol, debeCambiar] of usuarios) {
    const r = await pool.query(
      `INSERT INTO usuarios (nombre, correo, password_hash, rol, debe_cambiar_clave)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (correo) DO NOTHING`,
      [nombre, correo, hash, rol, debeCambiar]
    );
    console.log(`${correo}: ${r.rowCount ? 'creado' : 'ya existía, sin cambios'}`);
  }

  await pool.end();
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});