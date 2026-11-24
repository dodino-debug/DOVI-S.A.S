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

async function listarHistorial(id) {
  const { rows } = await pool.query(
    `SELECT accion,
            TO_CHAR(fecha_anterior, 'YYYY-MM-DD') AS fecha_anterior,
            TO_CHAR(fecha_nueva, 'YYYY-MM-DD') AS fecha_nueva,
            TO_CHAR(fecha_registro AT TIME ZONE 'America/Bogota', 'YYYY-MM-DD HH24:MI') AS registrada
       FROM solicitud_historial
      WHERE id_solicitud = $1
      ORDER BY id_historial DESC`,
    [id]
  );
  return rows;
}

async function resolver(id, adminId, accion, { fecha, motivo }) {
  const { rowCount } = await pool.query(
    `WITH pendiente AS (
       SELECT id_solicitud, fecha_esperada
         FROM solicitudes
        WHERE id_solicitud = $1 AND estado_solicitud = 'PENDIENTE'
          AND ($3 <> 'REAGENDADA' OR (
            $4::date <> fecha_esperada
            AND $4::date >= (NOW() AT TIME ZONE 'America/Bogota')::date
          ))
        FOR UPDATE
     ), resuelta AS (
       UPDATE solicitudes s
          SET estado_solicitud = CASE WHEN $3 = 'RECHAZADA' THEN 'RECHAZADA' ELSE 'APROBADA' END,
              fecha_esperada = COALESCE($4::date, p.fecha_esperada),
              nota_admin = $5
         FROM pendiente p
        WHERE s.id_solicitud = p.id_solicitud
       RETURNING s.id_solicitud, p.fecha_esperada AS fecha_anterior, s.fecha_esperada AS fecha_nueva
     )
     INSERT INTO solicitud_historial (id_solicitud, id_admin, accion, fecha_anterior, fecha_nueva)
     SELECT id_solicitud, $2, $3, fecha_anterior, fecha_nueva FROM resuelta`,
    [id, adminId, accion, fecha, motivo]
  );
  return rowCount > 0;
}

module.exports = { buscarPorId, listarPorCliente, crearPendiente, listarHistorial, resolver };
