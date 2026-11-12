const pool = require('../config/db');

async function listar() {
  const { rows } = await pool.query(
    `SELECT s.id, s.nombre, s.descripcion, s.activo,
            (SELECT COUNT(*) FROM solicitudes x WHERE x.servicio_id = s.id)::int AS solicitudes
       FROM servicios s
      ORDER BY s.activo DESC, s.nombre`
  );
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(
    `SELECT id, nombre, COALESCE(descripcion, '') AS descripcion, activo
       FROM servicios WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function crear({ nombre, descripcion }) {
  await pool.query('INSERT INTO servicios (nombre, descripcion) VALUES ($1, $2)', [
    nombre,
    descripcion || null
  ]);
}

async function actualizar(id, { nombre, descripcion }) {
  const resultado = await pool.query(
    'UPDATE servicios SET nombre = $2, descripcion = $3 WHERE id = $1',
    [id, nombre, descripcion || null]
  );
  return resultado.rowCount > 0;
}

async function cambiarEstado(id, activo) {
  const { rows } = await pool.query(
    'UPDATE servicios SET activo = $2 WHERE id = $1 RETURNING nombre',
    [id, activo]
  );
  return rows[0] || null;
}

module.exports = { listar, buscarPorId, crear, actualizar, cambiarEstado };