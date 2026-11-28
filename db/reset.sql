-- DOVI S.A.S. | REINICIO DE LA BASE DE DATOS (SOLO DESARROLLO)
-- Borra TODAS las tablas y TODOS los datos. No ejecutar cuando existan datos reales.
-- Después de ejecutarlo, ejecuta db/schema.sql y vuelve a crear el administrador.

DROP TABLE IF EXISTS
  observaciones_empleado,
  notificaciones,
  password_reset_tokens,
  supervisor_empleado,
  empleados_supervisor,
  labor_empleado,
  labores,
  solicitud_historial,
  solicitudes,
  fincas,
  predios,
  servicios,
  clientes,
  usuarios,
  session,
  migraciones
CASCADE;
