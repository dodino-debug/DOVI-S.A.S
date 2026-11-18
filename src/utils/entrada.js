const esId = (valor) => /^\d{1,9}$/.test(String(valor));

const texto = (valor) => (typeof valor === 'string' ? valor.trim() : '');

function mensajesDeError(resultado) {
  return resultado.array({ onlyFirstError: true }).map((e) => e.msg);
}

module.exports = { esId, texto, mensajesDeError };
