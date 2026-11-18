const { body } = require('express-validator');

const base = [
  body('nombre', 'El nombre debe tener entre 3 y 150 caracteres.')
    .isString()
    .trim()
    .isLength({ min: 3, max: 150 }),
  body('correo', 'Ingresa un correo válido (máximo 100 caracteres).')
    .isString()
    .trim()
    .toLowerCase()
    .isEmail()
    .isLength({ max: 100 }),
  body('telefono', 'El teléfono es obligatorio: solo números, con prefijo + opcional (7 a 20 caracteres).')
    .isString()
    .trim()
    .matches(/^\+?[0-9]{7,19}$/)
];

const validarUsuarioNuevo = [
  ...base,
  body('rol', 'Elige un rol válido.').isIn(['admin', 'empleado'])
];

const validarUsuarioEdicion = base;

module.exports = { validarUsuarioNuevo, validarUsuarioEdicion };
