const RUTA_POR_ROL = {
  admin: '/admin',
  supervisor: '/supervisor',
  empleado: '/empleado',
  cliente: '/cliente'
};

function rutaInicial(usuario) {
  return usuario.debeCambiarClave ? '/cambiar-clave' : RUTA_POR_ROL[usuario.rol];
}

module.exports = { RUTA_POR_ROL, rutaInicial };