// Las notificaciones se crean dentro de la misma transacción que el cambio que las origina.
const MAXIMO = 255;

const recortar = (texto) => (texto.length > MAXIMO ? `${texto.slice(0, MAXIMO - 1)}…` : texto);

async function notificar(db, idsUsuario, mensaje, enlace) {
  const ids = [...new Set(idsUsuario)];
  if (ids.length === 0) return;
  await db.query(
    `INSERT INTO notificaciones (id_usuario, mensaje, enlace)
     SELECT UNNEST($1::int[]), $2::text, $3::text`,
    [ids, recortar(mensaje), enlace || null]
  );
}

async function notificarCuadrilla(db, idLabor, mensaje, enlace) {
  await db.query(
    `INSERT INTO notificaciones (id_usuario, mensaje, enlace)
     SELECT le.id_empleado, $2::text, $3::text
       FROM labor_empleado le
      WHERE le.id_labor = $1`,
    [idLabor, recortar(mensaje), enlace || null]
  );
}

module.exports = { notificar, notificarCuadrilla };
