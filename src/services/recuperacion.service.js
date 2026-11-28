const Usuario = require('../models/usuario.model');
const Recuperacion = require('../models/recuperacion.model');
const { generarTokenHex, hashearTokenSha256, hashearClave } = require('./claves');
const { enviarRecuperacionClave } = require('./correo');

const FORMATO_TOKEN = /^[a-f0-9]{64}$/;
const MINUTOS_EXPIRACION = 30;

function esFormatoTokenValido(token) {
  return typeof token === 'string' && FORMATO_TOKEN.test(token);
}

async function solicitarRecuperacion({ correo, urlBase }) {
  const usuario = await Usuario.buscarPorCorreo(correo);
  if (!usuario || !usuario.activo) return;

  const tokenPlano = generarTokenHex(32);
  const tokenHash = hashearTokenSha256(tokenPlano);

  await Recuperacion.crearToken(usuario.id, tokenHash, MINUTOS_EXPIRACION);

  const baseLimpia = urlBase.replace(/\/+$/, '');
  const enlace = `${baseLimpia}/restablecer/${tokenPlano}`;

  await enviarRecuperacionClave({
    para: usuario.correo,
    nombre: usuario.nombre,
    enlace,
    minutos: MINUTOS_EXPIRACION
  });
}

async function verificarTokenRecuperacion(token) {
  if (!esFormatoTokenValido(token)) return null;
  const tokenHash = hashearTokenSha256(token);
  return Recuperacion.buscarTokenValido(tokenHash);
}

async function restablecerContrasena(token, claveNueva) {
  if (!esFormatoTokenValido(token)) return false;
  const tokenHash = hashearTokenSha256(token);
  const passwordHash = await hashearClave(claveNueva);
  const resultado = await Recuperacion.consumirTokenYActualizarClave(tokenHash, passwordHash);
  return Boolean(resultado);
}

module.exports = {
  solicitarRecuperacion,
  verificarTokenRecuperacion,
  restablecerContrasena,
  MINUTOS_EXPIRACION
};
