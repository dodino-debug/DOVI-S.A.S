const pool = require('../config/db');

const SQL_RESUMEN = `
  SELECT
    (SELECT COUNT(*) FROM solicitudes WHERE estado = 'pendiente_revision')::int AS pendientes,
    (SELECT COUNT(*) FROM labores
       WHERE fecha = (NOW() AT TIME ZONE 'America/Bogota')::date
         AND estado IN ('pendiente', 'en_proceso'))::int AS labores_hoy,
    (SELECT COUNT(DISTINCT le.empleado_id)
       FROM labor_empleados le
       JOIN labores l ON l.id = le.labor_id
      WHERE l.estado = 'en_proceso')::int AS empleados_en_campo
`;

const SQL_SOLICITUDES = `
  SELECT s.id,
         c.nombre  AS cliente,
         p.nombre  AS predio,
         sv.nombre AS labor,
         TO_CHAR(s.fecha_deseada, 'YYYY-MM-DD') AS fecha_deseada
    FROM solicitudes s
    JOIN clientes  c  ON c.id  = s.cliente_id
    JOIN predios   p  ON p.id  = s.predio_id
    JOIN servicios sv ON sv.id = s.servicio_id
   WHERE s.estado = 'pendiente_revision'
   ORDER BY s.creado_en DESC, s.id DESC
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