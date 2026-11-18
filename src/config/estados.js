// Textos que ve el usuario para los estados definidos en el diccionario de datos.
const ESTADO_SOLICITUD = {
  PENDIENTE: 'Pendiente revisión',
  APROBADA: 'Aprobada',
  RECHAZADA: 'Rechazada',
  REAGENDADA: 'Reagendada'
};

const ESTADO_LABOR = {
  PENDIENTE: 'Pendiente',
  'EN PROCESO': 'En proceso',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada'
};

module.exports = { ESTADO_SOLICITUD, ESTADO_LABOR };
