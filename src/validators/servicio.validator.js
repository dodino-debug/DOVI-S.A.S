const { body } = require('express-validator');

const validarServicio = [
  body('nombre', 'El nombre debe tener entre 3 y 120 caracteres.')
    .isString()
    .trim()
    .isLength({ min: 3, max: 120 }),
  body('descripcion', 'La descripción no puede superar los 500 caracteres.')
    .optional({ values: 'falsy' })
    .isString()
    .trim()
    .isLength({ max: 500 })
];

module.exports = { validarServicio };