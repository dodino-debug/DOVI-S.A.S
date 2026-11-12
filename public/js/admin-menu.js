(function () {
  var boton = document.querySelector('.barra__toggle');
  var menu = document.getElementById('menu-admin');
  if (!boton || !menu) return;

  boton.addEventListener('click', function () {
    var abierto = menu.classList.toggle('abierto');
    boton.setAttribute('aria-expanded', String(abierto));
  });
})();