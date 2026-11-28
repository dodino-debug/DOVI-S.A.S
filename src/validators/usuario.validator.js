const { body } = require('express-validator');
const { validarDatosPersona } = require('./comun.validator');

const validarUsuarioNuevo = [
  ...validarDatosPersona,
  body('rol', 'Elige un rol válido.').isIn(['admin', 'empleado'])
];

const validarUsuarioEdicion = validarDatosPersona;

module.exports = { validarUsuarioNuevo, validarUsuarioEdicion };
