(function () {
  var rol = document.getElementById('rol');
  var bloqueCheck = document.querySelector('[data-bloque-es-supervisor]');
  var bloqueSupervisor = document.querySelector('[data-bloque-supervisor]');
  var check = document.getElementById('es_supervisor');
  if (!bloqueCheck || !bloqueSupervisor) return;

  function ajustar() {
    // En edición no hay selector de rol: el formulario solo se muestra para empleados.
    var esEmpleado = rol ? rol.value === 'empleado' : true;
    var esSupervisor = Boolean(check && check.checked);
    bloqueCheck.hidden = !esEmpleado;
    bloqueSupervisor.hidden = !esEmpleado || esSupervisor;
  }

  if (rol) rol.addEventListener('change', ajustar);
  if (check) check.addEventListener('change', ajustar);
  ajustar();
})();
