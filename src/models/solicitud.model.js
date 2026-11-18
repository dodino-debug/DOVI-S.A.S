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

module.exports = { buscarPorId };
