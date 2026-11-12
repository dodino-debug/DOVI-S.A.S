const RUTA_POR_ROL = {
  admin: '/admin',
  supervisor: '/supervisor',
  empleado: '/empleado',
  cliente: '/cliente'
};

const ETIQUETA_ROL = {
  admin: 'Administrador',
  supervisor: 'Supervisor',
  empleado: 'Empleado',
  cliente: 'Cliente'
};

function rutaInicial(usuario) {
  return usuario.debeCambiarClave ? '/cambiar-clave' : RUTA_POR_ROL[usuario.rol];
}

module.exports = { RUTA_POR_ROL, ETIQUETA_ROL, rutaInicial };