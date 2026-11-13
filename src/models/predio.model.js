const pool = require('../config/db');

async function listarPorCliente(clienteId) {
  const { rows } = await pool.query(
    `SELECT p.id, p.nombre, p.ubicacion, p.area_hectareas, p.activo,
            (SELECT COUNT(*) FROM solicitudes s WHERE s.predio_id = p.id)::int AS solicitudes
       FROM predios p
      WHERE p.cliente_id = $1
      ORDER BY p.activo DESC, p.nombre`,
    [clienteId]
  );
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(
    `SELECT p.id, p.nombre, p.ubicacion, p.area_hectareas, p.cliente_id, c.nombre AS cliente_nombre
       FROM predios p
       JOIN clientes c ON c.id = p.cliente_id
      WHERE p.id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function crear(clienteId, { nombre, ubicacion, area }) {
  await pool.query(
    'INSERT INTO predios (cliente_id, nombre, ubicacion, area_hectareas) VALUES ($1, $2, $3, $4)',
    [clienteId, nombre, ubicacion, area || null]
  );
}

async function actualizar(id, { nombre, ubicacion, area }) {
  const resultado = await pool.query(
    'UPDATE predios SET nombre = $2, ubicacion = $3, area_hectareas = $4 WHERE id = $1',
    [id, nombre, ubicacion, area || null]
  );
  return resultado.rowCount > 0;
}

async function cambiarEstado(id, activo) {
  const { rows } = await pool.query(
    'UPDATE predios SET activo = $2 WHERE id = $1 RETURNING nombre, cliente_id',
    [id, activo]
  );
  return rows[0] || null;
}

module.exports = { listarPorCliente, buscarPorId, crear, actualizar, cambiarEstado };