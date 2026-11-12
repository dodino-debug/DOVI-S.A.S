const { body } = require('express-validator');

const base = [
  body('nombre', 'El nombre debe tener entre 3 y 120 caracteres.')
    .isString()
    .trim()
    .isLength({ min: 3, max: 120 }),
  body('correo', 'Ingresa un correo válido (máximo 160 caracteres).')
    .isString()
    .trim()
    .toLowerCase()
    .isEmail()
    .isLength({ max: 160 }),
  body('telefono', 'El teléfono solo puede tener números, espacios, +, - y paréntesis (7 a 30 caracteres).')
    .optional({ values: 'falsy' })
    .isString()
    .trim()
    .matches(/^[0-9+()\-\s]{7,30}$/)
];

const validarUsuarioNuevo = [
  ...base,
  body('rol', 'Elige un rol válido.').isIn(['admin', 'supervisor', 'empleado'])
];

const validarUsuarioEdicion = base;

module.exports = { validarUsuarioNuevo, validarUsuarioEdicion };