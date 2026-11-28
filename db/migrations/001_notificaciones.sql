-- ===== Notificaciones (RF13) =====
-- [+] El documento las usa en los diagramas de secuencia pero no las incluye en el ER.
CREATE TABLE IF NOT EXISTS notificaciones (
  id_notificacion SERIAL PRIMARY KEY,
  id_usuario      INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  mensaje         VARCHAR(255) NOT NULL,
  enlace          VARCHAR(200),
  leido           BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_creacion  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario
  ON notificaciones (id_usuario, leido, fecha_creacion DESC);

