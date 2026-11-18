require('dotenv').config();
const pool = require('../config/db');

const HOY = "(NOW() AT TIME ZONE 'America/Bogota')::date";
const CLIENTE_PRUEBA = "(SELECT id_usuario FROM usuarios WHERE correo = 'cliente@dovi.test')";
const MARCA = 'Predio de Prueba%';

async function borrar(db) {
  const filtroFinca = `id_cliente = ${CLIENTE_PRUEBA} AND nombre_predio LIKE $1`;
  await db.query(
    `DELETE FROM labores
      WHERE id_solicitud IN (SELECT id_solicitud FROM solicitudes
                              WHERE id_finca IN (SELECT id_finca FROM fincas WHERE ${filtroFinca}))`,
    [MARCA]
  );
  await db.query(
    `DELETE FROM solicitudes WHERE id_finca IN (SELECT id_finca FROM fincas WHERE ${filtroFinca})`,
    [MARCA]
  );
  const resultado = await db.query(`DELETE FROM fincas WHERE ${filtroFinca}`, [MARCA]);
  return resultado.rowCount;
}

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Este script no se ejecuta en producción.');
  }

  const modoLimpiar = process.argv.includes('--limpiar');
  const db = await pool.connect();
  const unico = async (sql, params) => (await db.query(sql, params)).rows[0];

  try {
    await db.query('BEGIN');

    if (modoLimpiar) {
      const borradas = await borrar(db);
      await db.query('COMMIT');
      console.log(borradas ? 'Datos de demostración eliminados.' : 'No había datos de demostración.');
      return;
    }

    const previo = await unico(
      `SELECT 1 AS existe FROM fincas WHERE id_cliente = ${CLIENTE_PRUEBA} AND nombre_predio LIKE $1`,
      [MARCA]
    );
    if (previo) {
      throw new Error('Ya existen datos de demostración. Para rehacerlos: npm run seed:demo -- --limpiar');
    }

    const cliente = await unico("SELECT id_usuario AS id FROM usuarios WHERE correo = 'cliente@dovi.test'");
    const empleado = await unico("SELECT id_usuario AS id FROM usuarios WHERE correo = 'empleado@dovi.test'");
    if (!cliente || !empleado) {
      throw new Error('Faltan usuarios. Ejecuta antes: npm run seed:admin y npm run seed:pruebas');
    }

    const servicios = (
      await db.query("SELECT id_servicio AS id FROM servicios WHERE estado = 'ACTIVO' ORDER BY id_servicio LIMIT 3")
    ).rows;
    if (servicios.length === 0) throw new Error('No hay servicios. Ejecuta primero db/schema.sql en Neon.');
    const servicio = (i) => servicios[i % servicios.length].id;

    const crearFinca = (nombre, hectareas) =>
      unico(
        `INSERT INTO fincas (id_cliente, nombre_predio, ubicacion, hectareas)
         VALUES ($1, $2, 'Ubicación de prueba', $3) RETURNING id_finca AS id`,
        [cliente.id, nombre, hectareas]
      );
    const norte = await crearFinca('Predio de Prueba Norte', 12.5);
    const sur = await crearFinca('Predio de Prueba Sur', 30);

    const crearSolicitud = (fincaId, servicioId, dias, estado) =>
      unico(
        `INSERT INTO solicitudes (id_cliente, id_finca, id_servicio, fecha_esperada,
                                  detalles_adicionales, estado_solicitud)
         VALUES ($1, $2, $3, ${HOY} + $4::int, 'Solicitud de prueba', $5)
         RETURNING id_solicitud AS id`,
        [cliente.id, fincaId, servicioId, dias, estado]
      );

    await crearSolicitud(norte.id, servicio(0), 1, 'PENDIENTE');
    await crearSolicitud(sur.id, servicio(1), 2, 'PENDIENTE');
    await crearSolicitud(norte.id, servicio(2), 3, 'PENDIENTE');
    const aprobadaA = await crearSolicitud(norte.id, servicio(1), 0, 'APROBADA');
    const aprobadaB = await crearSolicitud(sur.id, servicio(2), 0, 'APROBADA');

    const crearLabor = (solicitudId, hora, estado) =>
      unico(
        `INSERT INTO labores (id_solicitud, fecha_programada, hora_programada, estado_labor)
         VALUES ($1, ${HOY}, $2, $3) RETURNING id_labor AS id`,
        [solicitudId, hora, estado]
      );

    const laborPendiente = await crearLabor(aprobadaA.id, '06:00', 'PENDIENTE');
    const laborEnProceso = await crearLabor(aprobadaB.id, '07:00', 'EN PROCESO');

    await db.query(
      'INSERT INTO labor_empleado (id_labor, id_empleado) VALUES ($1, $3), ($2, $3)',
      [laborPendiente.id, laborEnProceso.id, empleado.id]
    );

    await db.query('COMMIT');
    console.log('Datos de demostración creados.');
    console.log('El tablero debe mostrar: Solicitudes Pendientes 3, Labores Para Hoy 2, Empleados en Campo 1.');
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  } finally {
    db.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
