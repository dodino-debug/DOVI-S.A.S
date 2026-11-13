const { body } = require('express-validator');

const validarPredio = [
  body('nombre', 'El nombre del predio debe tener entre 3 y 160 caracteres.')
    .isString()
    .trim()
    .isLength({ min: 3, max: 160 }),
  body('ubicacion', 'La ubicación es obligatoria (3 a 500 caracteres). Indica vereda, municipio y referencias.')
    .isString()
    .trim()
    .isLength({ min: 3, max: 500 }),
  body('area', 'El área debe ser un número mayor que 0, con hasta 2 decimales (por ejemplo 12.5).')
    .optional({ values: 'falsy' })
    .isString()
    .trim()
    .customSanitizer((valor) => (typeof valor === 'string' ? valor.replace(',', '.') : valor))
    .matches(/^\d{1,7}(\.\d{1,2})?$/)
    .custom((valor) => Number(valor) > 0)
];

module.exports = { validarPredio };