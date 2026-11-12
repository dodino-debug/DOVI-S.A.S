const pool = require('../config/db');

async function buscarPorId(id) {
  const { rows } = await pool.query(
    `SELECT s.id, s.estado, s.detalles, s.nota_admin,
            TO_CHAR(s.fecha_deseada, 'YYYY-MM-DD') AS fecha_deseada,
            TO_CHAR(s.creado_en AT TIME ZONE 'America/Bogota', 'YYYY-MM-DD HH24:MI') AS creada,
            c.nombre AS cliente, p.nombre AS predio, p.ubicacion, sv.nombre AS servicio
       FROM solicitudes s
       JOIN clientes  c  ON c.id  = s.cliente_id
       JOIN predios   p  ON p.id  = s.predio_id
       JOIN servicios sv ON sv.id = s.servicio_id
      WHERE s.id = $1`,
    [id]
  );
  return rows[0] || null;
}

module.exports = { buscarPorId };