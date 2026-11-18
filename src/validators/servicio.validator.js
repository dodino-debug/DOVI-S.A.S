const { body } = require('express-validator');

const validarServicio = [
  body('nombre', 'El nombre debe tener entre 3 y 100 caracteres.')
    .isString()
    .trim()
    .isLength({ min: 3, max: 100 }),
  body('descripcion', 'La descripción no puede superar los 255 caracteres.')
    .optional({ values: 'falsy' })
    .isString()
    .trim()
    .isLength({ max: 255 })
];

module.exports = { validarServicio };
