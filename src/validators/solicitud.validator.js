const { body } = require('express-validator');
const { esFecha, hoyBogota } = require('../utils/fechas');

const nota = () =>
  body('nota', 'La nota no puede superar los 255 caracteres.')
    .optional({ values: 'falsy' })
    .isString()
    .trim()
    .isLength({ max: 255 });

const validarAprobar = [nota()];

const validarRechazar = [
  body('nota', 'Escribe el motivo del rechazo (3 a 255 caracteres).')
    .isString()
    .trim()
    .isLength({ min: 3, max: 255 })
];

const validarReagendar = [
  body('fecha', 'Indica una nueva fecha válida que no sea anterior a hoy.').custom(
    (valor) => esFecha(valor) && valor >= hoyBogota()
  ),
  nota()
];

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


module.exports = { validarSolicitud, fechaMinima,  validarAprobar, validarRechazar, validarReagendar };
