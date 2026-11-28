// Textos y estilos de los estados definidos en el diccionario de datos.
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

const CLASE_ESTADO = {
  PENDIENTE: 'insignia--aviso',
  APROBADA: 'insignia--ok',
  RECHAZADA: 'insignia--rojo',
  REAGENDADA: 'insignia--azul',
  'EN PROCESO': 'insignia--azul',
  COMPLETADA: 'insignia--ok',
  CANCELADA: 'insignia--rojo'
};

module.exports = { ESTADO_SOLICITUD, ESTADO_LABOR, CLASE_ESTADO };
