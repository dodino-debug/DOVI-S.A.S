(function () {
  var INTERVALO_MS = 15000;

  var filas = document.querySelector('[data-filas]');
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

  function crearFila(s) {
    var tr = document.createElement('tr');
    tr.appendChild(celda('#' + s.id, 'id'));
    tr.appendChild(celda(s.cliente, 'cliente'));
    tr.appendChild(celda(s.predio));
    tr.appendChild(celda(s.labor));
    tr.appendChild(celda(s.fechaDeseada));

    var td = document.createElement('td');
    var enlace = document.createElement('a');
    enlace.className = 'boton';
    enlace.href = '/admin/solicitudes/' + encodeURIComponent(s.id);
    enlace.textContent = 'Programar Labor';
    td.appendChild(enlace);
    tr.appendChild(td);
    return tr;
  }

  function crearFilaVacia() {
    var tr = document.createElement('tr');
    var td = celda('No hay solicitudes pendientes por revisar.', 'vacio');
    td.colSpan = 6;
    tr.appendChild(td);
    return tr;
  }

  function pintar(datos) {
    ['pendientes', 'laboresHoy', 'empleadosEnCampo'].forEach(function (clave) {
      var el = document.querySelector('[data-metrica="' + clave + '"]');
      if (el) el.textContent = String(datos[clave]);
    });

    filas.replaceChildren();
    if (datos.solicitudes.length === 0) {
      filas.appendChild(crearFilaVacia());
    } else {
      datos.solicitudes.forEach(function (s) { filas.appendChild(crearFila(s)); });
    }
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
        window.location.href = '/login';
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