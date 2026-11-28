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
const { validarRechazo, validarFecha } = require('../validators/solicitud.validator');
const { validarEstadoActivo } = require('../validators/comun.validator');
const { requerirRol, requerirRolApi } = require('../middlewares/auth');
const { evitarCache } = require('../middlewares/cache');
const setAdminMenu = require('../middlewares/adminMenu');

const soloAdmin = requerirRol('admin');

router.use('/admin', soloAdmin, evitarCache, setAdminMenu);

router.get('/admin', (req, res) => res.redirect('/admin/dashboard'));
router.get('/admin/dashboard', admin.mostrarDashboard);
router.get('/admin/solicitudes/:id', admin.verSolicitud);
router.post('/admin/solicitudes/:id/aprobar', admin.resolverSolicitud('APROBADA'));
router.post('/admin/solicitudes/:id/rechazar', validarRechazo, admin.resolverSolicitud('RECHAZADA'));
router.post('/admin/solicitudes/:id/reagendar', validarFecha, admin.resolverSolicitud('REAGENDADA'));
router.get('/admin/reportes', admin.reportes);

router.get('/admin/clientes', clientes.lista);
router.get('/admin/clientes/nuevo', clientes.formularioNuevo);
router.post('/admin/clientes', validarCliente, clientes.crear);
router.get('/admin/clientes/:id', clientes.detalle);
router.get('/admin/clientes/:id/editar', clientes.formularioEditar);
router.post('/admin/clientes/:id', validarCliente, clientes.actualizar);

router.get('/admin/clientes/:id/predios/nuevo', predios.formularioNuevo);
router.post('/admin/clientes/:id/predios', validarPredio, predios.crear);
router.get('/admin/predios/:id/editar', predios.formularioEditar);
router.post('/admin/predios/:id', validarPredio, predios.actualizar);
router.post('/admin/predios/:id/estado', validarEstadoActivo, predios.cambiarEstado);

router.get('/admin/servicios', servicios.lista);
router.get('/admin/servicios/nuevo', servicios.formularioNuevo);
router.post('/admin/servicios', validarServicio, servicios.crear);
router.get('/admin/servicios/:id/editar', servicios.formularioEditar);
router.post('/admin/servicios/:id', validarServicio, servicios.actualizar);
router.post('/admin/servicios/:id/estado', validarEstadoActivo, servicios.cambiarEstado);

router.get('/admin/usuarios', usuarios.lista);
router.get('/admin/usuarios/nuevo', usuarios.formularioNuevo);
router.post('/admin/usuarios', validarUsuarioNuevo, usuarios.crear);
router.get('/admin/usuarios/:id/editar', usuarios.formularioEditar);
router.post('/admin/usuarios/:id', validarUsuarioEdicion, usuarios.actualizar);
router.post('/admin/usuarios/:id/estado', validarEstadoActivo, usuarios.cambiarEstado);
router.post('/admin/usuarios/:id/restablecer-clave', usuarios.restablecerClave);

router.get('/api/admin/dashboard', requerirRolApi('admin'), evitarCache, admin.datosDashboard);

module.exports = router;
