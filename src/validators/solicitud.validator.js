const { body } = require('express-validator');

const validarFecha = body('fecha', 'Selecciona una fecha válida que no haya pasado.')
  .isString().bail().matches(/^\d{4}-\d{2}-\d{2}$/).bail()
  .isISO8601({ strict: true }).bail()
  .custom((fecha) => fecha >= fechaMinima());

const validarSolicitud = [
  body('predio', 'Selecciona un predio válido.')
    .isString().bail().isInt({ min: 1, max: 2147483647 }),
  body('servicio', 'Selecciona un servicio válido.')
    .isString().bail().isInt({ min: 1, max: 2147483647 }),
  validarFecha,
  body('detalles', 'Los detalles pueden tener hasta 255 caracteres.')
    .optional().isString().bail().trim().isLength({ max: 255 })
];

const formatoBogota = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Bogota',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

function fechaMinima() {
  return formatoBogota.format(new Date());
}

const validarRechazo = body('motivo', 'Ingresa un motivo de rechazo de 1 a 255 caracteres.')
  .isString().bail().trim().isLength({ min: 1, max: 255 });

module.exports = { validarSolicitud, validarRechazo, validarFecha, fechaMinima };
