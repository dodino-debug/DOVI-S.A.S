const pool = require('../config/db');

const SQL_RESUMEN = `
  SELECT
    (SELECT COUNT(*) FROM solicitudes WHERE estado_solicitud = 'PENDIENTE')::int AS pendientes,
    (SELECT COUNT(*) FROM labores
       WHERE fecha_programada = (NOW() AT TIME ZONE 'America/Bogota')::date
         AND estado_labor IN ('PENDIENTE', 'EN PROCESO'))::int AS labores_hoy,
    (SELECT COUNT(DISTINCT le.id_empleado)
       FROM labor_empleado le
       JOIN labores l ON l.id_labor = le.id_labor
      WHERE l.estado_labor = 'EN PROCESO')::int AS empleados_en_campo
`;

const SQL_SOLICITUDES = `
  SELECT s.id_solicitud AS id,
         c.nombre_completo AS cliente,
         f.nombre_predio   AS predio,
         sv.nombre_servicio AS labor,
         TO_CHAR(s.fecha_esperada, 'YYYY-MM-DD') AS fecha_deseada
    FROM solicitudes s
    JOIN usuarios  c  ON c.id_usuario  = s.id_cliente
    JOIN fincas    f  ON f.id_finca    = s.id_finca
    JOIN servicios sv ON sv.id_servicio = s.id_servicio
   WHERE s.estado_solicitud = 'PENDIENTE'
   ORDER BY s.fecha_creacion DESC, s.id_solicitud DESC
   LIMIT 10
`;

async function obtenerDashboard() {
  const [resumen, solicitudes] = await Promise.all([
    pool.query(SQL_RESUMEN),
    pool.query(SQL_SOLICITUDES)
  ]);
  const r = resumen.rows[0];

  return {
    pendientes: r.pendientes,
    laboresHoy: r.labores_hoy,
    empleadosEnCampo: r.empleados_en_campo,
    solicitudes: solicitudes.rows.map((s) => ({
      id: s.id,
      cliente: s.cliente,
      predio: s.predio,
      labor: s.labor,
      fechaDeseada: s.fecha_deseada
    }))
  };
}

module.exports = { obtenerDashboard };
