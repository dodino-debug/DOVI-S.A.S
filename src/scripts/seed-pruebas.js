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
  // [nombre, correo, rol, es_supervisor, debe_cambiar_clave, telefono]
  const usuarios = [
    ['Supervisor de Prueba', 'supervisor@dovi.test', 'EMPLEADO', true, false, '3000000001'],
    ['Empleado de Prueba', 'empleado@dovi.test', 'EMPLEADO', false, true, '3000000002'],
    ['Cliente de Prueba', 'cliente@dovi.test', 'CLIENTE', false, false, '3000000003']
  ];

  for (const [nombre, correo, rol, esSupervisor, debeCambiar, telefono] of usuarios) {
    const r = await pool.query(
      `INSERT INTO usuarios (nombre_completo, correo, contrasena, rol, telefono, es_supervisor, debe_cambiar_clave)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (correo) DO NOTHING`,
      [nombre, correo, hash, rol, telefono, esSupervisor, debeCambiar]
    );
    console.log(`${correo}: ${r.rowCount ? 'creado' : 'ya existía, sin cambios'}`);
  }

  await pool.query(
    `INSERT INTO supervisor_empleado (id_empleado, id_supervisor)
     SELECT e.id_usuario, s.id_usuario
       FROM usuarios e, usuarios s
      WHERE e.correo = 'empleado@dovi.test' AND s.correo = 'supervisor@dovi.test'
     ON CONFLICT (id_empleado) DO NOTHING`
  );
  console.log('El empleado de prueba quedó en el equipo del supervisor de prueba.');

  await pool.end();
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
