require('dotenv').config();
const pool = require('../config/db');

const HOY = "(NOW() AT TIME ZONE 'America/Bogota')::date";

async function borrar(db, clienteId) {
  await db.query(
    'DELETE FROM labores WHERE solicitud_id IN (SELECT id FROM solicitudes WHERE cliente_id = $1)',
    [clienteId]
  );
  await db.query('DELETE FROM solicitudes WHERE cliente_id = $1', [clienteId]);
  await db.query('DELETE FROM predios WHERE cliente_id = $1', [clienteId]);
  await db.query('DELETE FROM clientes WHERE id = $1', [clienteId]);
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

    const previo = await unico("SELECT id FROM clientes WHERE documento = 'PRUEBA'");

    if (modoLimpiar) {
      if (previo) {
        await borrar(db, previo.id);
        console.log('Datos de demostración eliminados.');
      } else {
        console.log('No había datos de demostración.');
      }
      await db.query('COMMIT');
      return;
    }

    if (previo) {
      throw new Error('Ya existen datos de demostración. Para rehacerlos: npm run seed:demo -- --limpiar');
    }

    const usuarioCliente = await unico("SELECT id FROM usuarios WHERE correo = 'cliente@dovi.test'");
    const usuarioEmpleado = await unico("SELECT id FROM usuarios WHERE correo = 'empleado@dovi.test'");
    const admin = await unico("SELECT id FROM usuarios WHERE rol = 'admin' ORDER BY id LIMIT 1");
    if (!usuarioCliente || !usuarioEmpleado || !admin) {
      throw new Error('Faltan usuarios. Ejecuta antes: npm run seed:admin y npm run seed:pruebas');
    }

    const servicios = (await db.query('SELECT id FROM servicios WHERE activo ORDER BY id LIMIT 3')).rows;
    if (servicios.length === 0) throw new Error('No hay servicios. Ejecuta primero el bloque nuevo de schema.sql en Neon.');
    const servicio = (i) => servicios[i % servicios.length].id;

    const cliente = await unico(
      "INSERT INTO clientes (usuario_id, nombre, documento) VALUES ($1, 'Cliente de Prueba', 'PRUEBA') RETURNING id",
      [usuarioCliente.id]
    );
    const norte = await unico(
      "INSERT INTO predios (cliente_id, nombre, ubicacion) VALUES ($1, 'Predio de Prueba Norte', 'Ubicación de prueba') RETURNING id",
      [cliente.id]
    );
    const sur = await unico(
      "INSERT INTO predios (cliente_id, nombre, ubicacion) VALUES ($1, 'Predio de Prueba Sur', 'Ubicación de prueba') RETURNING id",
      [cliente.id]
    );

    const crearSolicitud = (predioId, servicioId, dias, estado) =>
      unico(
        `INSERT INTO solicitudes (cliente_id, predio_id, servicio_id, fecha_deseada, detalles, estado)
         VALUES ($1, $2, $3, ${HOY} + $4::int, 'Solicitud de prueba', $5) RETURNING id`,
        [cliente.id, predioId, servicioId, dias, estado]
      );

    await crearSolicitud(norte.id, servicio(0), 1, 'pendiente_revision');
    await crearSolicitud(sur.id, servicio(1), 2, 'pendiente_revision');
    await crearSolicitud(norte.id, servicio(2), 3, 'pendiente_revision');
    const aprobada = await crearSolicitud(norte.id, servicio(1), 0, 'aprobada');
    const enProceso = await crearSolicitud(sur.id, servicio(2), 0, 'en_proceso');

    const crearLabor = (solicitudId, hora, estado) =>
      unico(
        `INSERT INTO labores (solicitud_id, fecha, hora, ubicacion, estado, creado_por)
         VALUES ($1, ${HOY}, $2, 'Ubicación de prueba', $3, $4) RETURNING id`,
        [solicitudId, hora, estado, admin.id]
      );

    const laborPendiente = await crearLabor(aprobada.id, '06:00', 'pendiente');
    const laborEnProceso = await crearLabor(enProceso.id, '07:00', 'en_proceso');

    await db.query(
      'INSERT INTO labor_empleados (labor_id, empleado_id) VALUES ($1, $3), ($2, $3)',
      [laborPendiente.id, laborEnProceso.id, usuarioEmpleado.id]
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