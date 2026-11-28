(function () {
  var INTERVALO_MS = 15000;

  var filas = document.querySelector('[data-filas]');
  var filasActivos = document.querySelector('[data-filas-activos]');
  var aviso = document.querySelector('[data-aviso]');
  if (!filas) return;

  var ultimo = null;
  var enCurso = false;

  function celda(texto, clase) {
    var td = document.createElement('td');
    if (clase) td.className = clase;
    td.textContent = texto;
    return td;
  }

  function celdaEnlace(href, texto) {
    var td = document.createElement('td');
    var a = document.createElement('a');
    a.className = 'boton';
    a.href = href;
    a.textContent = texto;
    td.appendChild(a);
    return td;
  }

  function filaVacia(mensaje) {
    var tr = document.createElement('tr');
    var td = celda(mensaje, 'vacio');
    td.colSpan = 6;
    tr.appendChild(td);
    return tr;
  }

  function filaSolicitud(s) {
    var tr = document.createElement('tr');
    tr.appendChild(celda('#' + s.id, 'id'));
    tr.appendChild(celda(s.cliente, 'cliente'));
    tr.appendChild(celda(s.predio));
    tr.appendChild(celda(s.labor));
    tr.appendChild(celda(s.fechaDeseada));
    tr.appendChild(celdaEnlace('/admin/solicitudes/' + encodeURIComponent(s.id), 'Programar Labor'));
    return tr;
  }

  function filaActivo(a) {
    var tr = document.createElement('tr');
    tr.appendChild(celda(a.cliente, 'cliente'));
    tr.appendChild(celda(a.predio));
    tr.appendChild(celda(a.labor));
    tr.appendChild(celda(a.hora));
    tr.appendChild(celda(a.cuadrilla));
    tr.appendChild(celdaEnlace('/admin/labores/' + encodeURIComponent(a.id), 'Ver'));
    return tr;
  }

  function llenar(cuerpo, lista, crearFila, mensajeVacio) {
    if (!cuerpo) return;
    cuerpo.replaceChildren();
    if (lista.length === 0) cuerpo.appendChild(filaVacia(mensajeVacio));
    else lista.forEach(function (elemento) { cuerpo.appendChild(crearFila(elemento)); });
  }

  function pintar(datos) {
    ['pendientes', 'laboresHoy', 'empleadosEnCampo'].forEach(function (clave) {
      var el = document.querySelector('[data-metrica="' + clave + '"]');
      if (el) el.textContent = String(datos[clave]);
    });

    llenar(filas, datos.solicitudes, filaSolicitud, 'No hay solicitudes pendientes por revisar.');
    llenar(filasActivos, datos.serviciosActivos || [], filaActivo, 'No hay labores en proceso en este momento.');
  }

  async function actualizar() {
    if (enCurso) return;
    enCurso = true;
    try {
      var respuesta = await fetch('/api/admin/dashboard', {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
        cache: 'no-store'
      });
      if (respuesta.status === 401 || respuesta.status === 403) {
        window.location.href = '/auth/login';
        return;
      }
      if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);

      var datos = await respuesta.json();
      if (aviso) aviso.hidden = true;

      var huella = JSON.stringify(datos);
      if (huella !== ultimo) {
        ultimo = huella;
        pintar(datos);
      }
    } catch (error) {
      if (aviso) aviso.hidden = false;
    } finally {
      enCurso = false;
    }
  }

  setInterval(function () { if (!document.hidden) actualizar(); }, INTERVALO_MS);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) actualizar(); });
  window.addEventListener('online', actualizar);
})();
