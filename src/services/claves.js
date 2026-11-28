const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Sin 0, O, 1, l, I para evitar confusiones al dictarla o copiarla.
const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
const COSTO_BCRYPT = 12;

// Hash de relleno: así el tiempo de respuesta del login es parecido exista o no el correo.
const HASH_FALSO = bcrypt.hashSync('relleno-no-valido', COSTO_BCRYPT);

function claveTemporal(longitud = 12) {
  let clave = '';
  for (let i = 0; i < longitud; i += 1) {
    clave += ALFABETO[crypto.randomInt(ALFABETO.length)];
  }
  return clave;
}

function hashearClave(clave) {
  return bcrypt.hash(clave, COSTO_BCRYPT);
}

function compararClave(clave, hash) {
  return bcrypt.compare(clave, hash || HASH_FALSO);
}

function generarTokenHex(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

function hashearTokenSha256(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = {
  claveTemporal,
  hashearClave,
  compararClave,
  generarTokenHex,
  hashearTokenSha256,
  HASH_FALSO
};
