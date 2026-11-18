// La base de datos usa los valores del diccionario (ADMINISTRADOR, EMPLEADO, CLIENTE).
// La aplicación usa códigos cortos. El supervisor es un EMPLEADO con es_supervisor = TRUE.
const ROL_DB = { admin: 'ADMINISTRADOR', empleado: 'EMPLEADO', cliente: 'CLIENTE' };
const ROL_APP = { ADMINISTRADOR: 'admin', EMPLEADO: 'empleado', CLIENTE: 'cliente' };

const RUTA_POR_ROL = {
  admin: '/admin',
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

module.exports = { ROL_DB, ROL_APP, RUTA_POR_ROL, ETIQUETA_ROL, rutaInicial };
