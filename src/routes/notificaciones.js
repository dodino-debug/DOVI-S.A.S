const router = require('express').Router();
const notificaciones = require('../controllers/notificaciones.controller');
const { requerirRolApi } = require('../middlewares/auth');
const requerirSesionApi = requerirRolApi('admin', 'empleado', 'cliente');

router.get('/api/notificaciones', requerirSesionApi, notificaciones.listar);
router.post('/api/notificaciones/leidas', requerirSesionApi, notificaciones.marcarTodas);
router.post('/api/notificaciones/:id/leida', requerirSesionApi, notificaciones.marcarLeida);

module.exports = router;
