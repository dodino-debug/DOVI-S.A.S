const router = require('express').Router();
const admin = require('../controllers/admin.controller');
const solicitudes = require('../controllers/solicitudes.controller');
const labores = require('../controllers/labores.controller');
const reportes = require('../controllers/reportes.controller');
const servicios = require('../controllers/servicios.controller');
const usuarios = require('../controllers/usuarios.controller');
const clientes = require('../controllers/clientes.controller');
const predios = require('../controllers/predios.controller');
const { validarServicio } = require('../validators/servicio.validator');
const { validarUsuarioNuevo, validarUsuarioEdicion } = require('../validators/usuario.validator');
const { validarCliente } = require('../validators/cliente.validator');
const { validarPredio } = require('../validators/predio.validator');
const { validarAprobar, validarRechazar, validarReagendar } = require('../validators/solicitud.validator');
const { validarLabor, validarLaborEdicion, validarEstadoLabor } = require('../validators/labor.validator');
const { requerirRol, requerirRolApi } = require('../middlewares/auth');
const estados = require('../config/estados');

const soloAdmin = requerirRol('admin');

// Textos y estilos de estados disponibles en todas las vistas del administrador.
router.use(['/admin', '/api/admin'], (req, res, next) => {
  res.locals.ui = estados;
  next();
});

/* Tablero */
router.get('/admin', (req, res) => res.redirect('/admin/dashboard'));
router.get('/admin/dashboard', soloAdmin, admin.mostrarDashboard);
router.get('/api/admin/dashboard', requerirRolApi('admin'), admin.datosDashboard);

/* Solicitudes (RF6) */
router.get('/admin/solicitudes', soloAdmin, solicitudes.lista);
router.get('/admin/solicitudes/:id', soloAdmin, solicitudes.ver);
router.post('/admin/solicitudes/:id/aprobar', soloAdmin, validarAprobar, solicitudes.aprobar);
router.post('/admin/solicitudes/:id/rechazar', soloAdmin, validarRechazar, solicitudes.rechazar);
router.post('/admin/solicitudes/:id/reagendar', soloAdmin, validarReagendar, solicitudes.reagendar);

/* Labores (RF7, RF8 y RF10) */
router.get('/admin/labores', soloAdmin, labores.lista);
router.get('/admin/labores/nueva', soloAdmin, labores.formularioNuevo);
router.post('/admin/labores', soloAdmin, validarLabor, labores.crear);
router.post('/admin/labores/asignar', soloAdmin, labores.asignar);
router.get('/admin/labores/:id', soloAdmin, labores.ver);
router.get('/admin/labores/:id/editar', soloAdmin, labores.formularioEditar);
router.post('/admin/labores/:id', soloAdmin, validarLaborEdicion, labores.actualizar);
router.post('/admin/labores/:id/estado', soloAdmin, validarEstadoLabor, labores.cambiarEstado);

/* Reportes (RF15) */
router.get('/admin/reportes', soloAdmin, reportes.ver);
router.get('/admin/reportes/exportar', soloAdmin, reportes.exportar);

/* Clientes y predios (RF3 y RF12) */
router.get('/admin/clientes', soloAdmin, clientes.lista);
router.get('/admin/clientes/nuevo', soloAdmin, clientes.formularioNuevo);
router.post('/admin/clientes', soloAdmin, validarCliente, clientes.crear);
router.get('/admin/clientes/:id', soloAdmin, clientes.detalle);
router.get('/admin/clientes/:id/historial', soloAdmin, clientes.historial);
router.get('/admin/clientes/:id/editar', soloAdmin, clientes.formularioEditar);
router.post('/admin/clientes/:id', soloAdmin, validarCliente, clientes.actualizar);

router.get('/admin/clientes/:id/predios/nuevo', soloAdmin, predios.formularioNuevo);
router.post('/admin/clientes/:id/predios', soloAdmin, validarPredio, predios.crear);
router.get('/admin/predios/:id/editar', soloAdmin, predios.formularioEditar);
router.post('/admin/predios/:id', soloAdmin, validarPredio, predios.actualizar);
router.post('/admin/predios/:id/estado', soloAdmin, predios.cambiarEstado);

/* Servicios (RF4) */
router.get('/admin/servicios', soloAdmin, servicios.lista);
router.get('/admin/servicios/nuevo', soloAdmin, servicios.formularioNuevo);
router.post('/admin/servicios', soloAdmin, validarServicio, servicios.crear);
router.get('/admin/servicios/:id/editar', soloAdmin, servicios.formularioEditar);
router.post('/admin/servicios/:id', soloAdmin, validarServicio, servicios.actualizar);
router.post('/admin/servicios/:id/estado', soloAdmin, servicios.cambiarEstado);

/* Usuarios (RF1) */
router.get('/admin/usuarios', soloAdmin, usuarios.lista);
router.get('/admin/usuarios/nuevo', soloAdmin, usuarios.formularioNuevo);
router.post('/admin/usuarios', soloAdmin, validarUsuarioNuevo, usuarios.crear);
router.get('/admin/usuarios/:id/editar', soloAdmin, usuarios.formularioEditar);
router.post('/admin/usuarios/:id', soloAdmin, validarUsuarioEdicion, usuarios.actualizar);
router.post('/admin/usuarios/:id/estado', soloAdmin, usuarios.cambiarEstado);
router.post('/admin/usuarios/:id/restablecer-clave', soloAdmin, usuarios.restablecerClave);

module.exports = router;
