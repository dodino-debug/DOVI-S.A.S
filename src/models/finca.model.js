const pool = require('../config/db');

async function listarPorCliente(clienteId) {
  const { rows } = await pool.query(
    `SELECT f.id_finca AS id, f.nombre_predio AS nombre, f.ubicacion,
            f.hectareas AS area_hectareas, (f.estado = 'ACTIVO') AS activo,
            (SELECT COUNT(*) FROM solicitudes s WHERE s.id_finca = f.id_finca)::int AS solicitudes
       FROM fincas f
      WHERE f.id_cliente = $1
      ORDER BY (f.estado = 'ACTIVO') DESC, f.nombre_predio`,
    [clienteId]
  );
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(
    `SELECT f.id_finca AS id, f.nombre_predio AS nombre, f.ubicacion,
            f.hectareas AS area_hectareas, f.id_cliente AS cliente_id,
            c.nombre_completo AS cliente_nombre
       FROM fincas f
       JOIN usuarios c ON c.id_usuario = f.id_cliente
      WHERE f.id_finca = $1`,
    [id]
  );
  return rows[0] || null;
}

async function crear(clienteId, { nombre, ubicacion, area }) {
  await pool.query(
    'INSERT INTO fincas (id_cliente, nombre_predio, ubicacion, hectareas) VALUES ($1, $2, $3, $4)',
    [clienteId, nombre, ubicacion, area]
  );
}

async function actualizar(id, { nombre, ubicacion, area }) {
  const resultado = await pool.query(
    'UPDATE fincas SET nombre_predio = $2, ubicacion = $3, hectareas = $4 WHERE id_finca = $1',
    [id, nombre, ubicacion, area]
  );
  return resultado.rowCount > 0;
}

async function cambiarEstado(id, activo) {
  const { rows } = await pool.query(
    `UPDATE fincas
        SET estado = CASE WHEN $2::boolean THEN 'ACTIVO' ELSE 'INACTIVO' END
      WHERE id_finca = $1
      RETURNING nombre_predio AS nombre, id_cliente AS cliente_id`,
    [id, activo]
  );
  return rows[0] || null;
}

module.exports = { listarPorCliente, buscarPorId, crear, actualizar, cambiarEstado };
