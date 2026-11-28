function validarEntorno() {
  const errores = [];

  if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.trim()) {
    errores.push('Falta la variable de entorno DATABASE_URL.');
  }

  const secreto = process.env.SESSION_SECRET || '';
  const esProduccion = process.env.NODE_ENV === 'production';

  if (!secreto.trim()) {
    errores.push('Falta la variable de entorno SESSION_SECRET.');
  } else if (esProduccion && secreto.length < 32) {
    errores.push('En producción, SESSION_SECRET debe tener al menos 32 caracteres.');
  } else if (!esProduccion && secreto.length < 16) {
    console.warn('Aviso: SESSION_SECRET es corto. Usa al menos 32 caracteres aleatorios.');
  }

  if (errores.length > 0) {
    throw new Error(`Configuración inválida:\n- ${errores.join('\n- ')}`);
  }
}

module.exports = { validarEntorno };
