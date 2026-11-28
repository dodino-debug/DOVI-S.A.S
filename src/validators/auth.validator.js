const { body } = require('express-validator');

const validarLogin = [
  body('correo').isString().trim().toLowerCase().isEmail().isLength({ max: 100 }),
  body('clave').isString().isLength({ min: 1, max: 200 })
];

const validarCambioClave = [
  body('claveActual').isString().isLength({ min: 1, max: 200 }),
  body('claveNueva')
    .isString()
    .isLength({ min: 10, max: 64 })
    .custom((valor, { req }) => valor !== req.body.claveActual),
  body('confirmacion').custom((valor, { req }) => valor === req.body.claveNueva)
];

const validarRecuperacion = [
  body('correo', 'Ingresa un correo electrónico válido.')
    .isString()
    .trim()
    .toLowerCase()
    .isEmail()
    .isLength({ max: 100 })
];

const validarRestablecimiento = [
  body('claveNueva', 'La nueva contraseña debe tener entre 10 y 64 caracteres.')
    .isString()
    .isLength({ min: 10, max: 64 }),
  body('confirmacion', 'La confirmación debe coincidir con la nueva contraseña.')
    .isString()
    .custom((valor, { req }) => valor === req.body.claveNueva)
];

module.exports = {
  validarLogin,
  validarCambioClave,
  validarRecuperacion,
  validarRestablecimiento
};
