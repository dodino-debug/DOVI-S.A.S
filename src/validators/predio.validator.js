const { body } = require('express-validator');

const validarPredio = [
  body('nombre', 'El nombre del predio debe tener entre 3 y 100 caracteres.')
    .isString()
    .trim()
    .isLength({ min: 3, max: 100 }),
  body('ubicacion', 'La ubicación es obligatoria (3 a 255 caracteres): vereda, corregimiento o coordenadas.')
    .isString()
    .trim()
    .isLength({ min: 3, max: 255 }),
  body('area', 'Las hectáreas son obligatorias: un número mayor que 0, con hasta 2 decimales (por ejemplo 12.5).')
    .isString()
    .trim()
    .customSanitizer((valor) => (typeof valor === 'string' ? valor.replace(',', '.') : valor))
    .matches(/^\d{1,8}(\.\d{1,2})?$/)
    .custom((valor) => Number(valor) > 0)
];

module.exports = { validarPredio };
