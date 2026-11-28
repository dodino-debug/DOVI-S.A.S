const { body } = require('express-validator');
const { esFecha, esHora, hoyBogota } = require('../utils/fechas');
const { ESTADOS } = require('../services/estados-labor');

const fecha = () =>
  body('fecha', 'La fecha debe ser válida y no puede ser anterior a hoy.').custom(
    (valor) => esFecha(valor) && valor >= hoyBogota()
  );

const hora = () => body('hora', 'Indica una hora válida (HH:MM).').custom((valor) => esHora(valor));

const validarLabor = [
  body('solicitud_id', 'Elige una solicitud aprobada.').isInt({ min: 1, max: 999999999 }),
  fecha(),
  hora()
];

const validarLaborEdicion = [fecha(), hora()];

const validarEstadoLabor = [
  body('estado', 'Elige un estado válido.').isIn(ESTADOS),
  body('observaciones', 'Las observaciones no pueden superar los 255 caracteres.')
    .optional({ values: 'falsy' })
    .isString()
    .trim()
    .isLength({ max: 255 })
];

const validarObservaciones = body('observaciones', 'Escribe una observación de hasta 255 caracteres.')
  .optional().isString().bail().trim().isLength({ max: 255 }).bail()
  .custom((valor) => !valor.includes('\0'));


module.exports = { validarObservaciones,  validarLabor, validarLaborEdicion, validarEstadoLabor };
