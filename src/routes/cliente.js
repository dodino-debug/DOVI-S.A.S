const router = require('express').Router();
const { requerirRol } = require('../middlewares/auth');
const { evitarCache } = require('../middlewares/cache');
const portal = require('../controllers/portal-cliente.controller');
const clienteFincas = require('../controllers/cliente-fincas.controller');
const { validarSolicitud } = require('../validators/solicitud.validator');
const { validarPredio } = require('../validators/predio.validator');

router.use('/cliente', requerirRol('cliente'), evitarCache);

router.get('/cliente', portal.mostrarServicios);
router.get('/cliente/servicios', portal.mostrarServicios);
router.get('/cliente/solicitar', portal.mostrarFormulario);
router.get('/cliente/solicitudes', portal.mostrarSolicitudes);
router.post('/cliente/solicitudes', validarSolicitud, portal.crearSolicitud);

router.get('/cliente/fincas', clienteFincas.lista);
router.get('/cliente/fincas/nueva', clienteFincas.formularioNuevo);
router.post('/cliente/fincas', validarPredio, clienteFincas.crear);
router.get('/cliente/fincas/:id/editar', clienteFincas.formularioEditar);
router.post('/cliente/fincas/:id', validarPredio, clienteFincas.actualizar);

module.exports = router;
