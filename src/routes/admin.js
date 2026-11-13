const router = require('express').Router();
const admin = require('../controllers/admin.controller');
const servicios = require('../controllers/servicios.controller');
const usuarios = require('../controllers/usuarios.controller');
const clientes = require('../controllers/clientes.controller');
const predios = require('../controllers/predios.controller');
const { validarServicio } = require('../validators/servicio.validator');
const { validarUsuarioNuevo, validarUsuarioEdicion } = require('../validators/usuario.validator');
const { validarCliente } = require('../validators/cliente.validator');
const { validarPredio } = require('../validators/predio.validator');
const { requerirRol, requerirRolApi } = require('../middlewares/auth');

const soloAdmin = requerirRol('admin');

router.get('/admin', soloAdmin, admin.mostrarDashboard);
router.get('/admin/solicitudes/:id', soloAdmin, admin.verSolicitud);
router.get('/admin/reportes', soloAdmin, admin.reportes);

router.get('/admin/clientes', soloAdmin, clientes.lista);
router.get('/admin/clientes/nuevo', soloAdmin, clientes.formularioNuevo);
router.post('/admin/clientes', soloAdmin, validarCliente, clientes.crear);
router.get('/admin/clientes/:id', soloAdmin, clientes.detalle);
router.get('/admin/clientes/:id/editar', soloAdmin, clientes.formularioEditar);
router.post('/admin/clientes/:id', soloAdmin, validarCliente, clientes.actualizar);

router.get('/admin/clientes/:id/predios/nuevo', soloAdmin, predios.formularioNuevo);
router.post('/admin/clientes/:id/predios', soloAdmin, validarPredio, predios.crear);
router.get('/admin/predios/:id/editar', soloAdmin, predios.formularioEditar);
router.post('/admin/predios/:id', soloAdmin, validarPredio, predios.actualizar);
router.post('/admin/predios/:id/estado', soloAdmin, predios.cambiarEstado);

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