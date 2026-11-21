const pool = require('../config/db');

async function buscarPorId(id) {
  const { rows } = await pool.query(
    `SELECT s.id_solicitud AS id, s.estado_solicitud AS estado,
            s.detalles_adicionales AS detalles, s.nota_admin,
            TO_CHAR(s.fecha_esperada, 'YYYY-MM-DD') AS fecha_deseada,
            TO_CHAR(s.fecha_creacion AT TIME ZONE 'America/Bogota', 'YYYY-MM-DD HH24:MI') AS creada,
            c.nombre_completo AS cliente, f.nombre_predio AS predio, f.ubicacion,
            sv.nombre_servicio AS servicio
       FROM solicitudes s
       JOIN usuarios  c  ON c.id_usuario   = s.id_cliente
       JOIN fincas    f  ON f.id_finca     = s.id_finca
       JOIN servicios sv ON sv.id_servicio = s.id_servicio
      WHERE s.id_solicitud = $1`,
    [id]
  );
  return rows[0] || null;
}

async function listarPorCliente(clienteId) {
  const { rows } = await pool.query(
    `SELECT s.id_solicitud AS id, s.estado_solicitud AS estado, s.nota_admin,
            TO_CHAR(s.fecha_esperada, 'YYYY-MM-DD') AS fecha_deseada,
            f.nombre_predio AS predio, sv.nombre_servicio AS servicio
       FROM solicitudes s
       JOIN fincas f ON f.id_finca = s.id_finca
       JOIN servicios sv ON sv.id_servicio = s.id_servicio
      WHERE s.id_cliente = $1
      ORDER BY s.fecha_creacion DESC, s.id_solicitud DESC`,
    [clienteId]
  );
  return rows;
}

async function crearPendiente(clienteId, { predio, servicio, fecha, detalles }) {
  const { rowCount } = await pool.query(
    `INSERT INTO solicitudes (id_cliente, id_finca, id_servicio, fecha_esperada, detalles_adicionales)
     SELECT u.id_usuario, f.id_finca, sv.id_servicio, $4::date, $5
       FROM fincas f
       JOIN usuarios u ON u.id_usuario = f.id_cliente
       JOIN servicios sv ON sv.id_servicio = $3
      WHERE u.id_usuario = $1 AND u.rol = 'CLIENTE' AND u.estado = 'ACTIVO'
        AND f.id_finca = $2 AND f.estado = 'ACTIVO' AND sv.estado = 'ACTIVO'
        AND $4::date >= (NOW() AT TIME ZONE 'America/Bogota')::date
      FOR SHARE OF u, f, sv`,
    [clienteId, predio, servicio, fecha, detalles || null]
  );
  return rowCount > 0;
}

module.exports = { buscarPorId, listarPorCliente, crearPendiente };
