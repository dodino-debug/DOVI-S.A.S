const ZONA = 'America/Bogota';

// Fecha de hoy en Colombia (YYYY-MM-DD), no en la hora del servidor.
function hoyBogota() {
  return new Date().toLocaleDateString('en-CA', { timeZone: ZONA });
}

function esFecha(valor) {
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const [a, m, d] = valor.split('-').map(Number);
  const fecha = new Date(Date.UTC(a, m - 1, d));
  return fecha.getUTCFullYear() === a && fecha.getUTCMonth() === m - 1 && fecha.getUTCDate() === d;
}

function esHora(valor) {
  return typeof valor === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(valor);
}

const aUtc = (f) => {
  const [a, m, d] = f.split('-').map(Number);
  return Date.UTC(a, m - 1, d);
};

function diasEntre(desde, hasta) {
  return Math.round((aUtc(hasta) - aUtc(desde)) / 86400000);
}

function sumarDias(fecha, dias) {
  return new Date(aUtc(fecha) + dias * 86400000).toISOString().slice(0, 10);
}

// Lee ?desde=&hasta= de la URL y los valida. Si no vienen y se pide un rango por defecto, lo calcula.
function leerRango(query, diasPorDefecto) {
  let desde = typeof query.desde === 'string' ? query.desde.trim() : '';
  let hasta = typeof query.hasta === 'string' ? query.hasta.trim() : '';

  if (!desde && !hasta && diasPorDefecto) {
    hasta = hoyBogota();
    desde = sumarDias(hasta, -diasPorDefecto);
  }

  let error = null;
  if (desde && !esFecha(desde)) error = 'La fecha inicial no es válida.';
  else if (hasta && !esFecha(hasta)) error = 'La fecha final no es válida.';
  else if (desde && hasta && desde > hasta) error = 'La fecha inicial no puede ser posterior a la final.';
  else if (desde && hasta && diasEntre(desde, hasta) > 366) error = 'El rango no puede superar un año.';

  return { desde, hasta, error };
}

module.exports = { hoyBogota, esFecha, esHora, diasEntre, sumarDias, leerRango };
