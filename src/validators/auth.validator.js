const { body } = require('express-validator');

const validarLogin = [
  body('correo').isString().trim().toLowerCase().isEmail().isLength({ max: 160 }),
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

module.exports = { validarLogin, validarCambioClave };