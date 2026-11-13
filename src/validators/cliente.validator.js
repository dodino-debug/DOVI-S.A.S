const { body } = require('express-validator');

const validarCliente = [
  body('nombre', 'El nombre debe tener entre 3 y 160 caracteres.')
    .isString()
    .trim()
    .isLength({ min: 3, max: 160 }),
  body('documento', 'El documento solo puede tener letras, números, puntos y guiones, sin espacios (3 a 30 caracteres).')
    .optional({ values: 'falsy' })
    .isString()
    .trim()
    .matches(/^[A-Za-z0-9.\-]{3,30}$/),
  body('telefono', 'El teléfono solo puede tener números, espacios, +, - y paréntesis (7 a 30 caracteres).')
    .optional({ values: 'falsy' })
    .isString()
    .trim()
    .matches(/^[0-9+()\-\s]{7,30}$/),
  body('direccion_contacto', 'La dirección de contacto no puede superar los 200 caracteres.')
    .optional({ values: 'falsy' })
    .isString()
    .trim()
    .isLength({ max: 200 }),
  body('correo', 'Ingresa un correo válido (máximo 160 caracteres).')
    .optional({ values: 'falsy' })
    .isString()
    .trim()
    .toLowerCase()
    .isEmail()
    .isLength({ max: 160 })
];

module.exports = { validarCliente };