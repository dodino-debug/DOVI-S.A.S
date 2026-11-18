-- DOVI S.A.S. | Esquema de la base de datos
-- Sigue el diccionario de datos y el diagrama entidad-relación del documento del proyecto.
-- Se ejecuta en el editor SQL de Neon. Se puede ejecutar varias veces sin error.
--
-- Columnas y tablas que NO están en el diccionario (adiciones mínimas, marcadas con [+]):
--   usuarios.es_supervisor, usuarios.debe_cambiar_clave, solicitudes.nota_admin,
--   tabla supervisor_empleado, tabla session.

-- ===== Usuarios =====
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario          SERIAL PRIMARY KEY,
  nombre_completo     VARCHAR(150) NOT NULL CHECK (BTRIM(nombre_completo) <> ''),
  correo              VARCHAR(100) NOT NULL UNIQUE,
  contrasena          VARCHAR(255) NOT NULL,
  rol                 VARCHAR(20)  NOT NULL
                      CHECK (rol IN ('ADMINISTRADOR', 'EMPLEADO', 'CLIENTE')),
  telefono            VARCHAR(20)  NOT NULL CHECK (telefono ~ '^\+?[0-9]{7,19}$'),
  estado              VARCHAR(15)  NOT NULL DEFAULT 'ACTIVO'
                      CHECK (estado IN ('ACTIVO', 'INACTIVO')),
  fecha_creacion      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  es_supervisor       BOOLEAN      NOT NULL DEFAULT FALSE,   -- [+] el supervisor es un empleado
  debe_cambiar_clave  BOOLEAN      NOT NULL DEFAULT FALSE,   -- [+] clave temporal
  CONSTRAINT correo_en_minusculas CHECK (correo = LOWER(correo)),
  CONSTRAINT supervisor_solo_empleado CHECK (NOT es_supervisor OR rol = 'EMPLEADO')
);

-- [+] Equipo de cada supervisor (un empleado tiene como máximo un supervisor)
CREATE TABLE IF NOT EXISTS supervisor_empleado (
  id_empleado   INTEGER PRIMARY KEY REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  id_supervisor INTEGER NOT NULL REFERENCES usuarios(id_usuario),
  CHECK (id_empleado <> id_supervisor)
);
CREATE INDEX IF NOT EXISTS idx_supervisor_empleado_sup ON supervisor_empleado (id_supervisor);

-- ===== Fincas =====
CREATE TABLE IF NOT EXISTS fincas (
  id_finca       SERIAL PRIMARY KEY,
  id_cliente     INTEGER NOT NULL REFERENCES usuarios(id_usuario),
  nombre_predio  VARCHAR(100) NOT NULL CHECK (BTRIM(nombre_predio) <> ''),
  ubicacion      VARCHAR(255) NOT NULL CHECK (BTRIM(ubicacion) <> ''),
  hectareas      DECIMAL(10,2) NOT NULL CHECK (hectareas > 0),
  estado         VARCHAR(15) NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO')),
  CONSTRAINT fincas_finca_cliente UNIQUE (id_finca, id_cliente)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_fincas_cliente_nombre ON fincas (id_cliente, LOWER(nombre_predio));

-- ===== Servicios =====
CREATE TABLE IF NOT EXISTS servicios (
  id_servicio     SERIAL PRIMARY KEY,
  nombre_servicio VARCHAR(100) NOT NULL CHECK (BTRIM(nombre_servicio) <> ''),
  descripcion     VARCHAR(255),
  estado          VARCHAR(15) NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_servicios_nombre_unico ON servicios (LOWER(nombre_servicio));

-- Servicios iniciales del documento; solo se insertan si la tabla está vacía.
INSERT INTO servicios (nombre_servicio, descripcion)
SELECT * FROM (VALUES
  ('Cosecha de palma de aceite', 'Cosecha de palma de aceite'),
  ('Siembra', 'Siembra de cultivos'),
  ('Mantenimiento de cultivos', 'Mantenimiento de cultivos'),
  ('Asistencia de cultivos', 'Asistencia técnica y de cultivos')
) AS v(nombre_servicio, descripcion)
WHERE NOT EXISTS (SELECT 1 FROM servicios);

-- ===== Solicitudes =====
-- La fecha_esperada debe ser mayor o igual a la fecha actual: se valida al crear la solicitud.
CREATE TABLE IF NOT EXISTS solicitudes (
  id_solicitud          SERIAL PRIMARY KEY,
  id_cliente            INTEGER NOT NULL REFERENCES usuarios(id_usuario),
  id_finca              INTEGER NOT NULL,
  id_servicio           INTEGER NOT NULL REFERENCES servicios(id_servicio),
  fecha_esperada        DATE NOT NULL,
  estado_solicitud      VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE'
                        CHECK (estado_solicitud IN ('PENDIENTE', 'APROBADA', 'RECHAZADA', 'REAGENDADA')),
  detalles_adicionales  VARCHAR(255),
  fecha_creacion        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  nota_admin            VARCHAR(255),                        -- [+] motivo del rechazo o nota al cliente
  -- La finca de la solicitud debe pertenecer al mismo cliente:
  FOREIGN KEY (id_finca, id_cliente) REFERENCES fincas (id_finca, id_cliente)
);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes (estado_solicitud, fecha_creacion DESC);

-- ===== Labores =====
CREATE TABLE IF NOT EXISTS labores (
  id_labor          SERIAL PRIMARY KEY,
  id_solicitud      INTEGER NOT NULL REFERENCES solicitudes(id_solicitud),
  fecha_programada  DATE NOT NULL,
  hora_programada   TIME NOT NULL,
  estado_labor      VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE'
                    CHECK (estado_labor IN ('PENDIENTE', 'EN PROCESO', 'COMPLETADA', 'CANCELADA')),
  observaciones     VARCHAR(255)
);
CREATE INDEX IF NOT EXISTS idx_labores_fecha_estado ON labores (fecha_programada, estado_labor);
CREATE INDEX IF NOT EXISTS idx_labores_estado ON labores (estado_labor);

CREATE TABLE IF NOT EXISTS labor_empleado (
  id_labor    INTEGER NOT NULL REFERENCES labores(id_labor) ON DELETE CASCADE,
  id_empleado INTEGER NOT NULL REFERENCES usuarios(id_usuario),
  PRIMARY KEY (id_labor, id_empleado)
);

-- ===== Sesiones (técnica, para connect-pg-simple) =====
CREATE TABLE IF NOT EXISTS session (
  sid    VARCHAR NOT NULL PRIMARY KEY,
  sess   JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_session_expire ON session (expire);
