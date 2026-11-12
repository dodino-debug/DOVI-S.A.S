const router = require('express').Router();
const admin = require('../controllers/admin.controller');
const servicios = require('../controllers/servicios.controller');
const usuarios = require('../controllers/usuarios.controller');
const { validarServicio } = require('../validators/servicio.validator');
const { validarUsuarioNuevo, validarUsuarioEdicion } = require('../validators/usuario.validator');
const { requerirRol, requerirRolApi } = require('../middlewares/auth');

const soloAdmin = requerirRol('admin');

// Middleware para inyectar los enlaces del menú y la pestaña activa en todas las vistas de admin
router.use((req, res, next) => {
  res.locals.enlaces = [
    ['dashboard', '/admin', 'Tablero'],
    ['servicios', '/admin/servicios', 'Servicios'],
    ['usuarios', '/admin/usuarios', 'Usuarios'],
    ['reportes', '/admin/reportes', 'Reportes']
  ];

  // Detecta automáticamente qué enlace debe marcarse como activo según la URL
  const path = req.path;
  if (path === '/admin' || path === '/admin/') {
    res.locals.activo = 'dashboard';
  } else if (path.startsWith('/admin/servicios')) {
    res.locals.activo = 'servicios';
  } else if (path.startsWith('/admin/usuarios')) {
    res.locals.activo = 'usuarios';
  } else if (path.startsWith('/admin/reportes')) {
    res.locals.activo = 'reportes';
  } else {
    res.locals.activo = '';
  }

  next();
});

// --- Tus rutas existentes ---

router.get('/admin', soloAdmin, admin.mostrarDashboard);
router.get('/admin/solicitudes/:id', soloAdmin, admin.verSolicitud);
router.get('/admin/reportes', soloAdmin, admin.reportes);

router.get('/admin/servicios', soloAdmin, servicios.lista);
router.get('/admin/servicios/nuevo', soloAdmin, servicios.formularioNuevo);
router.post('/admin/servicios', soloAdmin, validarServicio, servicios.crear);
router.get('/admin/servicios/:id/editar', soloAdmin, servicios.formularioEditar);
router.post('/admin/servicios/:id', soloAdmin, validarServicio, servicios.actualizar);
router.post('/admin/servicios/:id/estado', soloAdmin, servicios.cambiarEstado);

router.get('/admin/usuarios', soloAdmin, usuarios.lista);
router.get('/admin/usuarios/nuevo', soloAdmin, usuarios.formularioNuevo);
router.post('/admin/usuarios', soloAdmin, validarUsuarioNuevo, usuarios.crear);
router.get('/admin/usuarios/:id/editar', soloAdmin, usuarios.formularioEditar);
router.post('/admin/usuarios/:id', soloAdmin, validarUsuarioEdicion, usuarios.actualizar);
router.post('/admin/usuarios/:id/estado', soloAdmin, usuarios.cambiarEstado);
router.post('/admin/usuarios/:id/restablecer-clave', soloAdmin, usuarios.restablecerClave);

router.get('/api/admin/dashboard', requerirRolApi('admin'), admin.datosDashboard);

module.exports = router;