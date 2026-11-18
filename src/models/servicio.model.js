const pool = require('../config/db');

async function listar() {
  const { rows } = await pool.query(
    `SELECT s.id_servicio AS id, s.nombre_servicio AS nombre, s.descripcion,
            (s.estado = 'ACTIVO') AS activo,
            (SELECT COUNT(*) FROM solicitudes x WHERE x.id_servicio = s.id_servicio)::int AS solicitudes
       FROM servicios s
      ORDER BY (s.estado = 'ACTIVO') DESC, s.nombre_servicio`
  );
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(
    `SELECT id_servicio AS id, nombre_servicio AS nombre,
            COALESCE(descripcion, '') AS descripcion, (estado = 'ACTIVO') AS activo
       FROM servicios WHERE id_servicio = $1`,
    [id]
  );
  return rows[0] || null;
}

async function crear({ nombre, descripcion }) {
  await pool.query('INSERT INTO servicios (nombre_servicio, descripcion) VALUES ($1, $2)', [
    nombre,
    descripcion || null
  ]);
}

async function actualizar(id, { nombre, descripcion }) {
  const resultado = await pool.query(
    'UPDATE servicios SET nombre_servicio = $2, descripcion = $3 WHERE id_servicio = $1',
    [id, nombre, descripcion || null]
  );
  return resultado.rowCount > 0;
}

async function cambiarEstado(id, activo) {
  const { rows } = await pool.query(
    `UPDATE servicios
        SET estado = CASE WHEN $2::boolean THEN 'ACTIVO' ELSE 'INACTIVO' END
      WHERE id_servicio = $1
      RETURNING nombre_servicio AS nombre`,
    [id, activo]
  );
  return rows[0] || null;
}

module.exports = { listar, buscarPorId, crear, actualizar, cambiarEstado };
