const router = require('express').Router();
const { requerirRol } = require('../middlewares/auth');

// Provisional: se reemplaza por los paneles reales del empleado (que incluye al supervisor) y del cliente.
const paneles = [
  ['/empleado', 'empleado', 'Módulo Empleado'],
  ['/cliente', 'cliente', 'Portal Clientes']
];

paneles.forEach(([ruta, rol, titulo]) => {
  router.get(ruta, requerirRol(rol), (req, res) => {
    res.render('pages/panel-provisional', { titulo });
  });
});

module.exports = router;
