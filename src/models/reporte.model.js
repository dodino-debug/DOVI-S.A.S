const pool = require('../config/db');

const LIMITE = 5000;

// Labores realizadas (COMPLETADA) en un rango de fechas. También sirve para el historial de un cliente.
async function laboresRealizadas({ desde, hasta, servicioId, clienteId }) {
  const { rows } = await pool.query(
    `SELECT l.id_labor AS id,
            TO_CHAR(l.fecha_programada, 'YYYY-MM-DD') AS fecha,
            TO_CHAR(l.hora_programada, 'HH24:MI') AS hora,
            c.nombre_completo AS cliente, f.nombre_predio AS predio, f.hectareas,
            sv.nombre_servicio AS servicio,
            COALESCE((SELECT STRING_AGG(e.nombre_completo, ', ' ORDER BY e.nombre_completo)
                        FROM labor_empleado le
                        JOIN usuarios e ON e.id_usuario = le.id_empleado
                       WHERE le.id_labor = l.id_labor), 'Sin asignar') AS cuadrilla,
            COALESCE(l.observaciones, '') AS observaciones
       FROM labores l
       JOIN solicitudes s ON s.id_solicitud = l.id_solicitud
       JOIN usuarios  c   ON c.id_usuario   = s.id_cliente
       JOIN fincas    f   ON f.id_finca     = s.id_finca
       JOIN servicios sv  ON sv.id_servicio = s.id_servicio
      WHERE l.estado_labor = 'COMPLETADA'
        AND ($1::date IS NULL OR l.fecha_programada >= $1::date)
        AND ($2::date IS NULL OR l.fecha_programada <= $2::date)
        AND ($3::int IS NULL OR s.id_servicio = $3::int)
        AND ($4::int IS NULL OR s.id_cliente = $4::int)
      ORDER BY l.fecha_programada DESC, l.hora_programada DESC, l.id_labor DESC
      LIMIT ${LIMITE + 1}`,
    [desde || null, hasta || null, servicioId || null, clienteId || null]
  );

  const truncado = rows.length > LIMITE;
  return { filas: truncado ? rows.slice(0, LIMITE) : rows, truncado };
}

function resumir(filas) {
  const porServicio = new Map();
  filas.forEach((f) => porServicio.set(f.servicio, (porServicio.get(f.servicio) || 0) + 1));
  return {
    total: filas.length,
    porServicio: [...porServicio.entries()]
      .map(([servicio, cantidad]) => ({ servicio, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad || a.servicio.localeCompare(b.servicio))
  };
}

module.exports = { laboresRealizadas, resumir, LIMITE };
