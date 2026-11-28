// Cambios de estado permitidos para una labor (RF10: "Validar estado permitido").
const TRANSICIONES = {
  PENDIENTE: ['EN PROCESO', 'CANCELADA'],
  'EN PROCESO': ['COMPLETADA', 'CANCELADA'],
  COMPLETADA: [],
  CANCELADA: []
};

const ESTADOS = Object.keys(TRANSICIONES);

function siguientes(estado) {
  return TRANSICIONES[estado] || [];
}

function esTransicionValida(de, a) {
  return siguientes(de).includes(a);
}

module.exports = { ESTADOS, siguientes, esTransicionValida };
