(function () {
  var rol = document.getElementById('rol');
  var bloque = document.querySelector('[data-bloque-supervisor]');
  if (!rol || !bloque) return;

  function ajustar() {
    bloque.hidden = rol.value !== 'empleado';
  }

  rol.addEventListener('change', ajustar);
  ajustar();
})();