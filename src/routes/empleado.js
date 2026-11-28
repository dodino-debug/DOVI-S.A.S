const router = require('express').Router();
const { requerirRol } = require('../middlewares/auth');
const { evitarCache } = require('../middlewares/cache');

router.use('/empleado', requerirRol('empleado'), evitarCache);

router.get('/empleado', (req, res) => res.redirect('/empleado/labores'));
router.get('/empleado/labores', (req, res) => {
  res.render('pages/panel-provisional', { titulo: 'Módulo Empleado' });
});

module.exports = router;
