const pool = require('../config/db');

async function listar(idUsuario, limite = 15) {
  const [items, total] = await Promise.all([
    pool.query(
      `SELECT id_notificacion AS id, mensaje, enlace, leido,
              TO_CHAR(fecha_creacion AT TIME ZONE 'America/Bogota', 'YYYY-MM-DD HH24:MI') AS fecha
         FROM notificaciones
        WHERE id_usuario = $1
        ORDER BY fecha_creacion DESC, id_notificacion DESC
        LIMIT $2`,
      [idUsuario, limite]
    ),
    pool.query(
      'SELECT COUNT(*)::int AS n FROM notificaciones WHERE id_usuario = $1 AND NOT leido',
      [idUsuario]
    )
  ]);
  return { noLeidas: total.rows[0].n, items: items.rows };
}

async function marcarLeida(idUsuario, id) {
  await pool.query(
    'UPDATE notificaciones SET leido = TRUE WHERE id_notificacion = $1 AND id_usuario = $2',
    [id, idUsuario]
  );
}

async function marcarTodas(idUsuario) {
  await pool.query('UPDATE notificaciones SET leido = TRUE WHERE id_usuario = $1 AND NOT leido', [
    idUsuario
  ]);
}

module.exports = { listar, marcarLeida, marcarTodas };
