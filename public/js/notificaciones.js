(function () {
  var INTERVALO_MS = 30000;

  var raiz = document.querySelector('[data-campana]');
  if (!raiz) return;

  var boton = raiz.querySelector('.campana__boton');
  var panel = raiz.querySelector('.campana__panel');
  var contador = raiz.querySelector('[data-contador]');
  var lista = raiz.querySelector('[data-lista]');
  var todas = raiz.querySelector('[data-marcar-todas]');
  var meta = document.querySelector('meta[name="csrf-token"]');
  var csrf = meta ? meta.getAttribute('content') : '';

  function enlaceSeguro(enlace) {
    return typeof enlace === 'string' && /^\/(?![\\/])[^\\\u0000-\u001f]*$/.test(enlace) &&
      new URL(enlace, window.location.origin).origin === window.location.origin;
  }

  function enviar(url) {
    return fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: '_csrf=' + encodeURIComponent(csrf)
    });
  }

  function crearItem(n) {
    var li = document.createElement('li');
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'campana__item' + (n.leido ? '' : ' campana__item--nueva');

    var texto = document.createElement('span');
    texto.className = 'campana__texto';
    texto.textContent = n.mensaje;
    var fecha = document.createElement('span');
    fecha.className = 'campana__fecha';
    fecha.textContent = n.fecha;
    b.appendChild(texto);
    b.appendChild(fecha);

    b.addEventListener('click', async function () {
      try {
        if (!n.leido) await enviar('/api/notificaciones/' + encodeURIComponent(n.id) + '/leida');
      } catch (error) { /* si falla, igual se abre el enlace */ }
      if (enlaceSeguro(n.enlace)) window.location.href = n.enlace;
      else cargar();
    });

    li.appendChild(b);
    return li;
  }

  function pintar(datos) {
    contador.textContent = datos.noLeidas > 99 ? '99+' : String(datos.noLeidas);
    contador.hidden = datos.noLeidas === 0;

    lista.replaceChildren();
    if (datos.items.length === 0) {
      var vacio = document.createElement('li');
      vacio.className = 'campana__vacio';
      vacio.textContent = 'Sin notificaciones';
      lista.appendChild(vacio);
      return;
    }
    datos.items.forEach(function (n) { lista.appendChild(crearItem(n)); });
  }

  async function cargar() {
    try {
      var respuesta = await fetch('/api/notificaciones', {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
        cache: 'no-store'
      });
      if (respuesta.status === 401 || respuesta.status === 403) {
        window.location.href = '/auth/login';
        return;
      }
      if (!respuesta.ok) return;
      pintar(await respuesta.json());
    } catch (error) { /* se reintenta en el siguiente ciclo */ }
  }

  function abrir(abierto) {
    panel.hidden = !abierto;
    boton.setAttribute('aria-expanded', String(abierto));
    if (abierto) cargar();
  }

  boton.addEventListener('click', function (evento) {
    evento.stopPropagation();
    abrir(panel.hidden);
  });

  todas.addEventListener('click', async function () {
    try { await enviar('/api/notificaciones/leidas'); } catch (error) { /* ver siguiente carga */ }
    cargar();
  });

  document.addEventListener('click', function (evento) {
    if (!panel.hidden && !raiz.contains(evento.target)) abrir(false);
  });
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && !panel.hidden) { abrir(false); boton.focus(); }
  });

  setInterval(function () { if (!document.hidden) cargar(); }, INTERVALO_MS);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) cargar(); });
  cargar();
})();
