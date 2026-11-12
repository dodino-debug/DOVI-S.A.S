const crypto = require('crypto');

// Sin 0, O, 1, l, I para evitar confusiones al dictarla o copiarla.
const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

function claveTemporal(longitud = 12) {
  let clave = '';
  for (let i = 0; i < longitud; i += 1) {
    clave += ALFABETO[crypto.randomInt(ALFABETO.length)];
  }
  return clave;
}

module.exports = { claveTemporal };