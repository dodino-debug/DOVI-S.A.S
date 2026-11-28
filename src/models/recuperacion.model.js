const pool = require('../config/db');

async function crearToken(usuarioId, tokenHash, minutosExpiracion = 30) {
  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    await db.query(
      'UPDATE password_reset_tokens SET usado = TRUE WHERE id_usuario = $1 AND usado = FALSE',
      [usuarioId]
    );
    await db.query(
      `INSERT INTO password_reset_tokens (id_usuario, token_hash, expira_en)
       VALUES ($1, $2, NOW() + make_interval(mins => $3))`,
      [usuarioId, tokenHash, minutosExpiracion]
    );
    await db.query(
      "DELETE FROM password_reset_tokens WHERE expira_en < NOW() - INTERVAL '1 day'"
    );
    await db.query('COMMIT');
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  } finally {
    db.release();
  }
}

async function buscarTokenValido(tokenHash) {
  const { rows } = await pool.query(
    `SELECT t.id_token AS id, t.id_usuario AS usuario_id, u.correo
       FROM password_reset_tokens t
       JOIN usuarios u ON u.id_usuario = t.id_usuario
      WHERE t.token_hash = $1
        AND t.usado = FALSE
        AND t.expira_en > NOW()
        AND u.estado = 'ACTIVO'`,
    [tokenHash]
  );
  return rows[0] || null;
}

async function consumirTokenYActualizarClave(tokenHash, passwordHash) {
  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    const { rows } = await db.query(
      `SELECT t.id_token, t.id_usuario
         FROM password_reset_tokens t
         JOIN usuarios u ON u.id_usuario = t.id_usuario
        WHERE t.token_hash = $1
          AND t.usado = FALSE
          AND t.expira_en > NOW()
          AND u.estado = 'ACTIVO'
          FOR UPDATE OF t`,
      [tokenHash]
    );

    if (!rows[0]) {
      await db.query('ROLLBACK');
      return null;
    }

    const { id_usuario: usuarioId } = rows[0];

    await db.query(
      'UPDATE password_reset_tokens SET usado = TRUE WHERE id_usuario = $1 AND usado = FALSE',
      [usuarioId]
    );
    await db.query(
      'UPDATE usuarios SET contrasena = $2, debe_cambiar_clave = FALSE WHERE id_usuario = $1',
      [usuarioId, passwordHash]
    );
    await db.query(
      `DELETE FROM session WHERE sess->'usuario'->>'id' = $1::text`,
      [usuarioId]
    );

    await db.query('COMMIT');
    return { usuarioId };
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  } finally {
    db.release();
  }
}

module.exports = {
  crearToken,
  buscarTokenValido,
  consumirTokenYActualizarClave
};
