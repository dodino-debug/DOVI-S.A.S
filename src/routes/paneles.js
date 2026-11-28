const router = require('express').Router();
const { requerirRol } = require('../middlewares/auth');
const portal = require('../controllers/portal-cliente.controller');
const empleado = require('../controllers/empleado.controller');
const { validarSolicitud } = require('../validators/solicitud.validator');
const { validarObservaciones } = require('../validators/labor.validator');

const soloCliente = requerirRol('cliente');

router.get('/cliente', soloCliente, portal.mostrarServicios);
router.get('/cliente/solicitar', soloCliente, portal.mostrarFormulario);
router.get('/cliente/solicitudes', soloCliente, portal.mostrarSolicitudes);
router.post('/cliente/solicitudes', soloCliente, validarSolicitud, portal.crearSolicitud);

const soloEmpleado = requerirRol('empleado');
router.get(['/empleado', '/empleado/labores'], soloEmpleado, empleado.mostrarLabores);
router.post('/empleado/labores/:id/iniciar', soloEmpleado, empleado.iniciarLabor);
router.post('/empleado/labores/:id/completar', soloEmpleado, validarObservaciones, empleado.completarLabor);

module.exports = router;
