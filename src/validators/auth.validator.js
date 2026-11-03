const { body } = require('express-validator');

const validarLogin = [
  body('correo').isString().trim().toLowerCase().isEmail().isLength({ max: 160 }),
  body('clave').isString().isLength({ min: 1, max: 200 })
];

module.exports = { validarLogin };