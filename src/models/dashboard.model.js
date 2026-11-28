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
    JOIN usuarios  c  ON c.id_usuario   = s.id_cliente
    JOIN fincas    f  ON f.id_finca     = s.id_finca
    JOIN servicios sv ON sv.id_servicio = s.id_servicio
   WHERE s.estado_solicitud = 'PENDIENTE'
   ORDER BY s.fecha_creacion DESC, s.id_solicitud DESC
   LIMIT 10
`;

// RF14 "servicios activos": las labores que están en proceso en este momento.
const SQL_ACTIVOS = `
  SELECT l.id_labor AS id,
         c.nombre_completo AS cliente,
         f.nombre_predio   AS predio,
         sv.nombre_servicio AS labor,
         TO_CHAR(l.hora_programada, 'HH24:MI') AS hora,
         COALESCE((SELECT STRING_AGG(e.nombre_completo, ', ' ORDER BY e.nombre_completo)
                     FROM labor_empleado le
                     JOIN usuarios e ON e.id_usuario = le.id_empleado
                    WHERE le.id_labor = l.id_labor), 'Sin asignar') AS cuadrilla
    FROM labores l
    JOIN solicitudes s  ON s.id_solicitud = l.id_solicitud
    JOIN usuarios    c  ON c.id_usuario   = s.id_cliente
    JOIN fincas      f  ON f.id_finca     = s.id_finca
    JOIN servicios   sv ON sv.id_servicio = s.id_servicio
   WHERE l.estado_labor = 'EN PROCESO'
   ORDER BY l.fecha_programada, l.hora_programada, l.id_labor
   LIMIT 10
`;

async function obtenerDashboard() {
  const [resumen, solicitudes, activos] = await Promise.all([
    pool.query(SQL_RESUMEN),
    pool.query(SQL_SOLICITUDES),
    pool.query(SQL_ACTIVOS)
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
    })),
    serviciosActivos: activos.rows
  };
}

module.exports = { obtenerDashboard };
