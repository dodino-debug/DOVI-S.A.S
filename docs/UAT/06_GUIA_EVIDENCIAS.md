# Registro y guía de evidencias UAT

El intento de renderizado automatizado en Edge falló en el entorno restringido. Se dispone de un soporte real de pruebas HTTP y PostgreSQL. Las capturas visuales quedan pendientes.

1. Usar únicamente la instancia de QA. Registrar fecha de Bogotá, versión, navegador, dispositivo y actor. Las cuentas dovi.test requieren claves sintéticas asignadas por el evaluador.
2. Preparar Finca Horizonte para cliente@dovi.test y Finca Reserva para otro@dovi.test. D es el día de reejecución. Mantener sesiones separadas por rol.
3. Guardar el estado obtenido al terminar cada caso. Para pasos intermedios agregar sufijos `-01`, `-02` antes de la extensión. Ocultar credenciales, cookies, cabeceras y valores sensibles.
4. Si el caso permanece bloqueado, capturar el punto exacto en el que falta la opción o adjuntar la referencia técnica. Agregar sufijo `-bloqueo` y reservar el archivo principal para la reejecución. Para las comprobaciones técnicas, usar extractos depurados.

## Navegación por módulo

| Módulo | Entrada y punto de control |
| --- | --- |
| Autenticación | Abrir `/login`. Usar Cerrar sesión o `/cambiar-clave` según el caso. |
| Usuarios | Administración → Usuarios, `/admin/usuarios`. Capturar listado o ficha después de guardar. Excluir la pantalla de credenciales. |
| Clientes y predios | Administración → Clientes, `/admin/clientes`. Entrar a la ficha de la propietaria y abrir Predios. |
| Catálogo | Administración → Servicios, `/admin/servicios`. Contrastar con el catálogo del portal `/cliente`. |
| Solicitudes | Cliente → Solicitar o Mis solicitudes, `/cliente/solicitar` y `/cliente/solicitudes`. Administración → Tablero → detalle de solicitud. |
| Órdenes y asignaciones | En `/admin`, abrir el detalle de UAT-A antes de decidirla. La versión auditada muestra decisiones de solicitud y carece del formulario de programación o cuadrilla. |
| Labores y supervisión | Abrir `/empleado` con el rol del caso. La versión auditada muestra el panel provisional. |
| Historial y avisos | Revisar el menú y las fichas de `/cliente`, `/empleado` o `/admin/clientes` según el rol. Capturar el punto donde falta la opción. |
| Reportes | Administración → Reportes, `/admin/reportes`. La versión auditada muestra el aviso de módulo futuro. |

## EV-001 Alta, edición y baja de personal

- **Caso y estado** CP-001 · APROBADO.
- **Módulo y rol** Usuarios · Administrador.
- **Datos** Personal UAT, personal@dovi.test, 3000001234, rol Empleado, supervisor supervisor@dovi.test.
- **Acciones** 1. Crear la cuenta y asignar supervisor · 2. Repetir el alta con el mismo correo · 3. Editar el nombre a Personal UAT Editado y filtrar por Empleado · 4. Desactivar y consultar el estado.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** Se crea una cuenta con el supervisor elegido, se rechaza el duplicado, se conserva la edición y queda Inactivo.
- **Nombre de archivo** `EV-001-alta-edicion-y-baja-de-personal.png`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `staff`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-002 Cambiar rol de una cuenta existente

- **Caso y estado** CP-002 · NO APROBADO.
- **Módulo y rol** Usuarios · Administrador.
- **Datos** personal@dovi.test, de Empleado a Administrador.
- **Acciones** 1. Abrir la edición de la cuenta · 2. Buscar el selector de rol y elegir Administrador · 3. Guardar y volver al listado.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** La edición permite asignar y persistir el nuevo rol, como establece el caso de uso RF01.
- **Nombre de archivo** `EV-002-cambiar-rol-de-una-cuenta-existente.png`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `roleedit`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-003 Alta de administrador

- **Caso y estado** CP-003 · APROBADO.
- **Módulo y rol** Usuarios · Administrador.
- **Datos** Jefa UAT, jefa@dovi.test, 3000001450.
- **Acciones** 1. Crear la cuenta con rol Administrador · 2. Abrir listado y filtrar por Administrador.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** Aparece exactamente una cuenta con ese correo y rol.
- **Nombre de archivo** `EV-003-alta-de-administrador.png`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `newadmin`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-004 Ingreso de los cuatro perfiles

- **Caso y estado** CP-004 · APROBADO.
- **Módulo y rol** Login · Administrador, cliente, empleado y supervisor.
- **Datos** admin@dovi.test, cliente@dovi.test, empleado@dovi.test, supervisor@dovi.test.
- **Acciones** 1. En cuatro sesiones independientes abrir /login · 2. Autenticar cada cuenta con su clave de prueba · 3. Comprobar la página de destino.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** Las cuatro cuentas ingresan y reciben su panel según rol. Supervisor conserva el perfil base empleado.
- **Nombre de archivo** `EV-004-ingreso-de-los-cuatro-perfiles.png`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `login`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-005 Credenciales incorrectas

- **Caso y estado** CP-005 · APROBADO.
- **Módulo y rol** Login · Anónimo.
- **Datos** admin@dovi.test y una clave de ensayo distinta de la asignada.
- **Acciones** 1. Abrir /login · 2. Ingresar el correo y la clave incorrecta · 3. Enviar.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** Se rechaza el acceso con aviso genérico y HTTP 401.
- **Nombre de archivo** `EV-005-credenciales-incorrectas.png`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `wrong`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-006 Cerrar sesión y volver al panel

- **Caso y estado** CP-006 · APROBADO.
- **Módulo y rol** Login · Administrador.
- **Datos** admin@dovi.test y /admin.
- **Acciones** 1. Ingresar al panel · 2. Cerrar sesión · 3. Volver a abrir /admin.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** La sesión termina y la ruta protegida redirige a /login.
- **Nombre de archivo** `EV-006-cerrar-sesion-y-volver-al-panel.png`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `logout`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-007 Acceso directo a rutas protegidas

- **Caso y estado** CP-007 · APROBADO.
- **Módulo y rol** Permisos · Anónimo, cliente, empleado, supervisor y administrador.
- **Datos** /admin, /cliente y /api/admin/dashboard.
- **Acciones** 1. Abrir /admin y la API sin iniciar sesión · 2. Como cliente, empleado y supervisor abrir /admin · 3. Comparar con acceso de administrador y visitar /cliente con la cuenta administrativa.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** HTML anónimo redirige, API anónima responde 401 y una sesión con rol ajeno recibe 403.
- **Nombre de archivo** `EV-007-acceso-directo-a-rutas-protegidas.png`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `roles`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-008 Cambio inicial de contraseña

- **Caso y estado** CP-008 · APROBADO.
- **Módulo y rol** Contraseña · Empleado.
- **Datos** temporal@dovi.test, clave temporal del evaluador, nueva clave de 18 caracteres o más, confirmación desigual.
- **Acciones** 1. Entrar con la clave temporal · 2. Abrir /empleado antes de cambiarla · 3. Enviar primero confirmación desigual y después igual · 4. Salir e intentar la clave anterior.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** El cambio es obligatorio, se rechaza la confirmación desigual y la clave anterior deja de funcionar.
- **Nombre de archivo** `EV-008-cambio-inicial-de-contrasena.png`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `change`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-009 Directorio, búsqueda y predios

- **Caso y estado** CP-009 · APROBADO.
- **Módulo y rol** Clientes y predios · Administrador.
- **Datos** Propietaria UAT, propietaria@dovi.test, 3000000123/3000000124, Finca Mirador, Vereda Norte/Sur, 0/12,5/13,5 ha.
- **Acciones** 1. Crear propietaria · 2. Editar teléfono y buscar por Propietaria · 3. Crear predio con 0 ha y luego con 12,5 ha · 4. Editar ubicación y área, y reabrir detalle.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** El directorio encuentra la cuenta, se rechaza el área cero y el detalle conserva la finca actualizada.
- **Nombre de archivo** `EV-009-directorio-busqueda-y-predios.png`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `customers`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-010 Registro de finca descrito en colaboración

- **Caso y estado** CP-010 · BLOQUEADO.
- **Módulo y rol** Predios · Cliente.
- **Datos** cliente@dovi.test, Finca Ladera, Vereda UAT, 9 ha.
- **Acciones** 1. Abrir portal de cliente · 2. Buscar opción de registrar finca propia · 3. Guardar y comprobar la nueva ubicación en una solicitud.
- **Momento** Registrar el punto de bloqueo. Al disponer del módulo, capturar al concluir el último paso.
- **Resultado esperado** Si la empresa ratifica la colaboración de la figura 59, el cliente puede registrar su finca. El caso de uso RF03 describe al administrador.
- **Nombre de archivo** `EV-010-registro-de-finca-descrito-en-colaboracion.png`.
- **Soporte real** Pendiente. Pendiente de ratificación del actor en RF03. La ruta de autoservicio no existe.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-011 Crear, editar, deshabilitar y consultar catálogo

- **Caso y estado** CP-011 · APROBADO.
- **Módulo y rol** Servicios · Administrador y cliente.
- **Datos** Poda UAT, PODA UAT y Poda dirigida UAT.
- **Acciones** 1. Crear Poda UAT · 2. Intentar el duplicado en mayúsculas · 3. Renombrar · 4. Consultar catálogo como cliente antes y después de deshabilitar.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** Persiste la edición, se rechaza el duplicado y el cliente solo ve el servicio mientras esté activo.
- **Nombre de archivo** `EV-011-crear-editar-deshabilitar-y-consultar-catalogo.png`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `services`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-012 Registrar tres solicitudes válidas

- **Caso y estado** CP-012 · APROBADO.
- **Módulo y rol** Solicitudes · Cliente.
- **Datos** Siembra, Finca Horizonte, D+7, detalles UAT-A, UAT-R y UAT-G.
- **Acciones** 1. Abrir Solicitar · 2. Crear una solicitud por detalle con la misma fecha · 3. Abrir Mis solicitudes y recargar.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** Se observan las tres solicitudes propias pendientes, con servicio, predio y fecha.
- **Nombre de archivo** `EV-012-registrar-tres-solicitudes-validas.png`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `request`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-013 Rechazar fecha anterior y predio ajeno

- **Caso y estado** CP-013 · APROBADO.
- **Módulo y rol** Solicitudes · Cliente.
- **Datos** Siembra, 2000-01-01, Finca Reserva del cliente alterno.
- **Acciones** 1. Enviar una solicitud con fecha anterior en navegador o mediante el formulario HTTP · 2. Comprobar que el selector excluye Finca Reserva y validar propiedad en prueba de integración con los datos sintéticos · 3. Revisar el listado.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** La aplicación rechaza ambas combinaciones y el número de solicitudes permanece igual.
- **Nombre de archivo** `EV-013-rechazar-fecha-anterior-y-predio-ajeno.png`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `invalidrequest`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-014 Revisar y resolver solicitudes pendientes

- **Caso y estado** CP-014 · APROBADO.
- **Módulo y rol** Solicitudes · Administrador.
- **Datos** UAT-A, UAT-R y UAT-G, motivo Cuadrilla no disponible, D+7 y D+8.
- **Acciones** 1. Abrir los tres detalles desde el panel · 2. Intentar rechazo sin motivo y reagendar a la fecha original · 3. Aprobar UAT-A, rechazar UAT-R con motivo y reagendar UAT-G · 4. Revisar los historiales y verificar que una solicitud resuelta no admite otra decisión.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** Se rechazan los datos inválidos, se conserva cada decisión y solo existe una decisión por solicitud.
- **Nombre de archivo** `EV-014-revisar-y-resolver-solicitudes-pendientes.png`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `decision`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-015 Estado visible luego de reagendar

- **Caso y estado** CP-015 · NO APROBADO.
- **Módulo y rol** Solicitudes · Administrador y cliente.
- **Datos** UAT-G, de D+7 a D+8.
- **Acciones** 1. Abrir el detalle de UAT-G previamente reagendada · 2. Comparar fecha y estado con el historial · 3. Consultar el estado en el portal.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** La fecha pasa a D+8 y el estado queda Reagendada según el diagrama de actividades.
- **Nombre de archivo** `EV-015-estado-visible-luego-de-reagendar.png`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `reschedule`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-016 Crear, consultar y editar una labor aprobada

- **Caso y estado** CP-016 · BLOQUEADO.
- **Módulo y rol** Labores · Administrador.
- **Datos** UAT-A aprobada, D+8, 07:30, Finca Horizonte, cambiar a 08:00.
- **Acciones** 1. Abrir Programar órdenes · 2. Elegir UAT-A e introducir fecha, hora y ubicación · 3. Guardar, consultar y editar la hora · 4. Recargar.
- **Momento** Registrar el punto de bloqueo. Al disponer del módulo, capturar al concluir el último paso.
- **Resultado esperado** Existe una sola labor vinculada a UAT-A y conserva la hora editada.
- **Nombre de archivo** `EV-016-crear-consultar-y-editar-una-labor-aprobada.png`.
- **Soporte real** Pendiente. La funcionalidad o dependencia de campo requerida no está disponible en esta versión.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-017 Excluir solicitudes pendientes o rechazadas

- **Caso y estado** CP-017 · BLOQUEADO.
- **Módulo y rol** Labores · Administrador.
- **Datos** Una pendiente UAT-P y UAT-R rechazada.
- **Acciones** 1. Abrir Programar órdenes · 2. Buscar ambas solicitudes para crear una labor · 3. Consultar las órdenes.
- **Momento** Registrar el punto de bloqueo. Al disponer del módulo, capturar al concluir el último paso.
- **Resultado esperado** Solo se pueden programar solicitudes aprobadas y no se crea una labor para las dos entradas.
- **Nombre de archivo** `EV-017-excluir-solicitudes-pendientes-o-rechazadas.png`.
- **Soporte real** Pendiente. La funcionalidad o dependencia de campo requerida no está disponible en esta versión.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-018 Asignar y reasignar cuadrilla

- **Caso y estado** CP-018 · BLOQUEADO.
- **Módulo y rol** Labores · Administrador.
- **Datos** Labor UAT-A, empleado@dovi.test, personal@dovi.test y apoyo@dovi.test activos.
- **Acciones** 1. Abrir asignación y guardar un empleado · 2. Agregar un segundo · 3. Reemplazar el segundo por Apoyo UAT y volver al detalle.
- **Momento** Registrar el punto de bloqueo. Al disponer del módulo, capturar al concluir el último paso.
- **Resultado esperado** Se conservan las asignaciones esperadas sin duplicados y el reemplazado deja de figurar.
- **Nombre de archivo** `EV-018-asignar-y-reasignar-cuadrilla.png`.
- **Soporte real** Pendiente. La funcionalidad o dependencia de campo requerida no está disponible en esta versión.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-019 Validar selección vacía

- **Caso y estado** CP-019 · BLOQUEADO.
- **Módulo y rol** Labores · Administrador.
- **Datos** Labor UAT-A y cero empleados seleccionados.
- **Acciones** 1. Abrir el formulario de asignaciones · 2. Enviar sin seleccionar · 3. Volver a consultar.
- **Momento** Registrar el punto de bloqueo. Al disponer del módulo, capturar al concluir el último paso.
- **Resultado esperado** Aparece el aviso de selección inválida y la cuadrilla previamente guardada sigue igual.
- **Nombre de archivo** `EV-019-validar-seleccion-vacia.png`.
- **Soporte real** Pendiente. La funcionalidad o dependencia de campo requerida no está disponible en esta versión.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-020 Ver labores propias y ubicación

- **Caso y estado** CP-020 · NO APROBADO.
- **Módulo y rol** Panel empleado · Empleado.
- **Datos** empleado@dovi.test, UAT-A a las 07:30, Finca Horizonte.
- **Acciones** 1. Entrar como empleado en dispositivo móvil · 2. Abrir Mis labores · 3. Abrir el detalle de UAT-A y revisar ubicación.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** El panel muestra la lista propia y el detalle con fecha, hora y ubicación.
- **Nombre de archivo** `EV-020-ver-labores-propias-y-ubicacion.png`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `workview`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-021 Consultar solo al personal a cargo

- **Caso y estado** CP-021 · BLOQUEADO.
- **Módulo y rol** Panel supervisor · Supervisor.
- **Datos** supervisor@dovi.test, Personal UAT subordinado y Apoyo UAT de otro equipo.
- **Acciones** 1. Abrir progreso de equipo · 2. Consultar el estado de la labor de Personal UAT · 3. Buscar labores de Apoyo UAT.
- **Momento** Registrar el punto de bloqueo. Al disponer del módulo, capturar al concluir el último paso.
- **Resultado esperado** Se ve el progreso del subordinado y se excluye al personal ajeno.
- **Nombre de archivo** `EV-021-consultar-solo-al-personal-a-cargo.png`.
- **Soporte real** Pendiente. La funcionalidad o dependencia de campo requerida no está disponible en esta versión.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-022 Actualizar estados permitidos y observación

- **Caso y estado** CP-022 · BLOQUEADO.
- **Módulo y rol** Labores · Empleado.
- **Datos** Ejemplares de labor UAT con estados Pendiente, En Proceso, Completada y Cancelada; nota Lote norte revisado.
- **Acciones** 1. Abrir labores propias · 2. Registrar los estados previstos en ejemplares independientes y escribir la nota · 3. Recargar cada detalle.
- **Momento** Registrar el punto de bloqueo. Al disponer del módulo, capturar al concluir el último paso.
- **Resultado esperado** Se conservan estados y observaciones válidas de las labores asignadas.
- **Nombre de archivo** `EV-022-actualizar-estados-permitidos-y-observacion.png`.
- **Soporte real** Pendiente. La funcionalidad o dependencia de campo requerida no está disponible en esta versión.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-023 Registrar nota en perfil del subordinado

- **Caso y estado** CP-023 · BLOQUEADO.
- **Módulo y rol** Panel supervisor · Supervisor.
- **Datos** Personal UAT, Apoyo UAT y nota Equipo verificado.
- **Acciones** 1. Abrir el perfil del subordinado · 2. Registrar la observación y recargar · 3. Comprobar que un empleado ajeno no ofrece esa acción al supervisor.
- **Momento** Registrar el punto de bloqueo. Al disponer del módulo, capturar al concluir el último paso.
- **Resultado esperado** La nota persiste para Personal UAT y el supervisor carece de acceso de edición sobre Apoyo UAT.
- **Nombre de archivo** `EV-023-registrar-nota-en-perfil-del-subordinado.png`.
- **Soporte real** Pendiente. La funcionalidad o dependencia de campo requerida no está disponible en esta versión.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-024 Consultar estado de solicitudes

- **Caso y estado** CP-024 · APROBADO.
- **Módulo y rol** Portal cliente · Cliente.
- **Datos** UAT-A, UAT-R y motivo Cuadrilla no disponible.
- **Acciones** 1. Entrar al portal con la cuenta de prueba · 2. Abrir Mis solicitudes después de la decisión administrativa · 3. Comparar estados y motivo.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** Se muestran Aprobada y Rechazada para las solicitudes propias y se presenta el motivo.
- **Nombre de archivo** `EV-024-consultar-estado-de-solicitudes.png`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `status`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-025 Ver cambios en tiempo real y progreso de la labor

- **Caso y estado** CP-025 · BLOQUEADO.
- **Módulo y rol** Portal cliente · Cliente y administrador.
- **Datos** UAT-A, labor asociada y estado En Proceso.
- **Acciones** 1. Dejar abierto Mis solicitudes · 2. En otra sesión actualizar la labor · 3. Observar la vista cliente sin recarga manual y abrir detalle.
- **Momento** Registrar el punto de bloqueo. Al disponer del módulo, capturar al concluir el último paso.
- **Resultado esperado** El cliente observa el cambio sin recargar y consulta el progreso de la labor. Registrar tiempo observado, pues el requisito no fija latencia.
- **Nombre de archivo** `EV-025-ver-cambios-en-tiempo-real-y-progreso-de-la-labor.png`.
- **Soporte real** Pendiente. La funcionalidad o dependencia de campo requerida no está disponible en esta versión.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-026 Historial por cliente y filtros

- **Caso y estado** CP-026 · BLOQUEADO.
- **Módulo y rol** Historial · Administrador y cliente.
- **Datos** Finca Horizonte, Siembra completada D+8, Personal UAT, evento fuera del rango D+12.
- **Acciones** 1. Abrir historial como cliente y como administrador del cliente · 2. Seleccionar Siembra y el periodo D+7 a D+9 · 3. Revisar resultados, fechas, labores y personal.
- **Momento** Registrar el punto de bloqueo. Al disponer del módulo, capturar al concluir el último paso.
- **Resultado esperado** Figura el evento completado dentro del rango con sus datos y se excluye el evento de D+12.
- **Nombre de archivo** `EV-026-historial-por-cliente-y-filtros.png`.
- **Soporte real** Pendiente. La funcionalidad o dependencia de campo requerida no está disponible en esta versión.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-027 Aviso por nueva labor

- **Caso y estado** CP-027 · BLOQUEADO.
- **Módulo y rol** Notificaciones · Empleado.
- **Datos** UAT-A y empleado@dovi.test.
- **Acciones** 1. Asignar la labor como administrador · 2. Abrir avisos del empleado · 3. Marcar el aviso como leído y recargar.
- **Momento** Registrar el punto de bloqueo. Al disponer del módulo, capturar al concluir el último paso.
- **Resultado esperado** La alerta se entrega al empleado destinatario y el estado leído se conserva.
- **Nombre de archivo** `EV-027-aviso-por-nueva-labor.png`.
- **Soporte real** Pendiente. La funcionalidad o dependencia de campo requerida no está disponible en esta versión.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-028 Aviso por cambio de solicitud

- **Caso y estado** CP-028 · BLOQUEADO.
- **Módulo y rol** Notificaciones · Cliente.
- **Datos** UAT-R rechazada, cliente@dovi.test y otro@dovi.test.
- **Acciones** 1. Cambiar el estado desde administración · 2. Abrir avisos como cliente propietario y como otro cliente · 3. Marcar el aviso propio como leído.
- **Momento** Registrar el punto de bloqueo. Al disponer del módulo, capturar al concluir el último paso.
- **Resultado esperado** Solo el propietario recibe la alerta de cambio y puede marcarla como leída.
- **Nombre de archivo** `EV-028-aviso-por-cambio-de-solicitud.png`.
- **Soporte real** Pendiente. La funcionalidad o dependencia de campo requerida no está disponible en esta versión.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-029 Ver pendientes, labores del día y servicios activos

- **Caso y estado** CP-029 · NO APROBADO.
- **Módulo y rol** Panel y API · Administrador.
- **Datos** Esquema con cuatro servicios activos, solicitudes sintéticas y conteo esperado de labores del día.
- **Acciones** 1. Abrir /admin · 2. Anotar contadores y abrir el detalle de una solicitud pendiente · 3. Comparar el resumen y la respuesta de /api/admin/dashboard con el catálogo activo.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** El resumen muestra las tres categorías documentadas y permite revisar el detalle de una solicitud.
- **Nombre de archivo** `EV-029-ver-pendientes-labores-del-dia-y-servicios-activos.png`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `dashboard`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-030 Consultar reportes por rango

- **Caso y estado** CP-030 · NO APROBADO.
- **Módulo y rol** Reportes · Administrador.
- **Datos** Rango D+7 a D+9, labor completada D+8 y otra D+12.
- **Acciones** 1. Abrir Reportes · 2. Seleccionar el rango y consultar · 3. Si existe exportación, abrir el archivo y comparar sus filas con el resultado.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** La consulta muestra solo la labor dentro del rango. Si se ofrece exportación, contiene el mismo conjunto.
- **Nombre de archivo** `EV-030-consultar-reportes-por-rango.png`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `reports`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-031 Validar rango invertido

- **Caso y estado** CP-031 · BLOQUEADO.
- **Módulo y rol** Reportes · Administrador.
- **Datos** Desde D+9, hasta D+7.
- **Acciones** 1. Abrir Reportes · 2. Enviar el rango invertido.
- **Momento** Registrar el punto de bloqueo. Al disponer del módulo, capturar al concluir el último paso.
- **Resultado esperado** Se muestra validación y se evita generar un reporte ambiguo.
- **Nombre de archivo** `EV-031-validar-rango-invertido.png`.
- **Soporte real** Pendiente. La funcionalidad o dependencia de campo requerida no está disponible en esta versión.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-032 Almacenamiento seguro de contraseñas

- **Caso y estado** CP-032 · APROBADO.
- **Módulo y rol** Usuarios y PostgreSQL · Desarrollador.
- **Datos** Cuenta admin sintética y cuenta personal creada por formulario.
- **Acciones** 1. Consultar metadatos y formato de la clave almacenada con acceso QA · 2. Verificar algoritmo y comparar en memoria · 3. Registrar solo el resultado.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** BCrypt de coste verificado, sin valor original en la base y sin divulgar hashes.
- **Nombre de archivo** `EV-032-almacenamiento-seguro-de-contrasenas.txt`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `hash`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-033 HTTPS obligatorio

- **Caso y estado** CP-033 · NO EJECUTADO.
- **Módulo y rol** Despliegue · Desarrollador.
- **Datos** Host de preproducción por diligenciar, HTTP y HTTPS.
- **Acciones** 1. Abrir ambos esquemas sin credenciales · 2. Verificar que HTTP no entregue formularios y que HTTPS tenga certificado válido · 3. Confirmar atributo Secure en sesión de producción.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** Toda vista y sesión operan bajo TLS, y HTTP redirige o se rechaza antes de recibir datos.
- **Nombre de archivo** `EV-033-https-obligatorio.png`.
- **Soporte real** Pendiente. Pendiente de ejecución y soporte específico.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-034 Validación de entrada y CSRF

- **Caso y estado** CP-034 · APROBADO.
- **Módulo y rol** Middleware y servicios · Desarrollador.
- **Datos** Nombre vacío, descripción dato UAT, POST sin token.
- **Acciones** 1. Abrir formulario nuevo de servicio · 2. Enviar nombre obligatorio vacío · 3. Ejecutar con el cliente QA una solicitud ordinaria sin token · 4. Comprobar continuidad de sesión.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** El servicio inválido se rechaza con 400 y el POST sin token con 403.
- **Nombre de archivo** `EV-034-validacion-de-entrada-y-csrf.png`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `csrf`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-035 Revisión defensiva de entradas y salida

- **Caso y estado** CP-035 · NO EJECUTADO.
- **Módulo y rol** Validadores y vistas · Desarrollador.
- **Datos** Datos ordinarios con comillas y ampersand, errores de validación previamente generados.
- **Acciones** 1. Revisar que las escrituras pasan por validadores · 2. Verificar parámetros enlazados en modelos y salida escapada en EJS · 3. Guardar un nombre ordinario con ampersand y comprobar representación literal.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** Las entradas se validan en servidor, se parametrizan las consultas y el texto se muestra literalmente por la vista.
- **Nombre de archivo** `EV-035-revision-defensiva-de-entradas-y-salida.txt`.
- **Soporte real** Pendiente. Pendiente de ejecución y soporte específico.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-036 Adaptación móvil y escritorio

- **Caso y estado** CP-036 · NO EJECUTADO.
- **Módulo y rol** Login, Administración, Portal cliente y Empleado · Evaluador.
- **Datos** 360×800, 390×844, 768×1024 y 1366×768.
- **Acciones** 1. Repetir inicio de sesión, navegación y solicitud a cada tamaño · 2. Abrir panel de empleado · 3. Comprobar desplazamiento, acciones, campos y legibilidad.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** Los controles se pueden usar sin recorte ni desplazamiento horizontal de la página. Las tablas con contenedor propio conservan las acciones.
- **Nombre de archivo** `EV-036-adaptacion-movil-y-escritorio.png`.
- **Soporte real** Pendiente. Pendiente de ejecución y soporte específico.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-037 Facilidad de uso en campo

- **Caso y estado** CP-037 · BLOQUEADO.
- **Módulo y rol** Panel empleado · Empleado y diseñador.
- **Datos** Tres evaluadores previstos, labor UAT-A, nota Lote norte revisado.
- **Acciones** 1. Pedir a cada evaluador que encuentre una labor, identifique la ubicación y actualice el estado sin ayuda · 2. Registrar tiempo, errores y percepción.
- **Momento** Registrar el punto de bloqueo. Al disponer del módulo, capturar al concluir el último paso.
- **Resultado esperado** Cada evaluador completa las tres tareas sin asistencia. DOVI ratifica este criterio operativo antes de la sesión.
- **Nombre de archivo** `EV-037-facilidad-de-uso-en-campo.png`.
- **Soporte real** Pendiente. La funcionalidad o dependencia de campo requerida no está disponible en esta versión.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-038 Tiempo de lectura de solicitudes

- **Caso y estado** CP-038 · APROBADO.
- **Módulo y rol** Portal cliente · Desarrollador.
- **Datos** Diez GET de /cliente/solicitudes con cuenta cliente y datos UAT.
- **Acciones** 1. Confirmar respuesta 200 · 2. Ejecutar diez lecturas consecutivas con Node y medir de inicio a fin de respuesta · 3. Registrar máximo y perfil.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** Cada lectura estándar es menor o igual a 2.000 ms bajo el perfil registrado.
- **Nombre de archivo** `EV-038-tiempo-de-lectura-de-solicitudes.txt`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `timing`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-039 Tiempo de lectura de labores

- **Caso y estado** CP-039 · BLOQUEADO.
- **Módulo y rol** Panel empleado · Desarrollador.
- **Datos** Diez consultas autenticadas de labores, una labor UAT asignada.
- **Acciones** 1. Abrir el listado de labores · 2. Medir diez lecturas con el perfil normal acordado · 3. Registrar estados y latencias.
- **Momento** Registrar el punto de bloqueo. Al disponer del módulo, capturar al concluir el último paso.
- **Resultado esperado** Todas las lecturas de labores son HTTP 200 y no exceden 2.000 ms.
- **Nombre de archivo** `EV-039-tiempo-de-lectura-de-labores.png`.
- **Soporte real** Pendiente. La funcionalidad o dependencia de campo requerida no está disponible en esta versión.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-040 Carga con conexión rural

- **Caso y estado** CP-040 · BLOQUEADO.
- **Módulo y rol** Panel empleado · Diseñador y empleado.
- **Datos** Perfiles 3G rural y 4G rural, labor UAT-A, tres cargas en frío por perfil.
- **Acciones** 1. Acordar límites y publicar ancho de banda y latencia de cada perfil · 2. Limpiar caché y cargar la vista tres veces por perfil · 3. Registrar tiempos, volumen y posibilidad de uso.
- **Momento** Registrar el punto de bloqueo. Al disponer del módulo, capturar al concluir el último paso.
- **Resultado esperado** La vista cumple el presupuesto acordado con DOVI en ambos perfiles y permite abrir la labor. Umbral por diligenciar.
- **Nombre de archivo** `EV-040-carga-con-conexion-rural.png`.
- **Soporte real** Pendiente. La funcionalidad o dependencia de campo requerida no está disponible en esta versión.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-041 Separación modular

- **Caso y estado** CP-041 · NO EJECUTADO.
- **Módulo y rol** Arquitectura · Desarrollador.
- **Datos** Flujo POST /cliente/solicitudes.
- **Acciones** 1. Rastrear ruta, guardas, controlador, modelo, SQL y vista · 2. Repetir con catálogo · 3. Registrar responsabilidades por capa.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** Las rutas coordinan, los modelos consultan datos y las vistas presentan resultados sin acceso directo a PostgreSQL.
- **Nombre de archivo** `EV-041-separacion-modular.txt`.
- **Soporte real** Pendiente. Pendiente de ejecución y soporte específico.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-042 Convenciones y reutilización

- **Caso y estado** CP-042 · NO EJECUTADO.
- **Módulo y rol** Código fuente · Desarrollador.
- **Datos** Controladores de servicios, clientes, predios y usuarios.
- **Acciones** 1. Acordar convención y revisar nombres y formato · 2. Comparar validación, manejo de duplicados y credenciales · 3. Registrar duplicación relevante.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** Se documentan criterios homogéneos y la lógica repetida que debe centralizarse según DRY.
- **Nombre de archivo** `EV-042-convenciones-y-reutilizacion.txt`.
- **Soporte real** Pendiente. Pendiente de ejecución y soporte específico.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-043 Integridad referencial del predio

- **Caso y estado** CP-043 · APROBADO.
- **Módulo y rol** PostgreSQL · Desarrollador.
- **Datos** cliente@dovi.test, Finca Reserva, Siembra, D+7.
- **Acciones** 1. En una transacción de QA intentar alta con cliente y finca de distinto propietario · 2. Registrar SQLSTATE · 3. Revertir la transacción.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** La FK compuesta rechaza la pareja con SQLSTATE 23503.
- **Nombre de archivo** `EV-043-integridad-referencial-del-predio.txt`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `integrity`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-044 Revisar tercera forma normal

- **Caso y estado** CP-044 · NO EJECUTADO.
- **Módulo y rol** PostgreSQL · Desarrollador.
- **Datos** usuarios, fincas, servicios, solicitudes, labores y labor_empleado.
- **Acciones** 1. Enumerar claves candidatas y dependencias funcionales · 2. Buscar dependencias parciales y transitivas · 3. Confirmar el esquema con el analista.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** Las tablas funcionales cumplen 3FN para las dependencias de negocio ratificadas y las claves protegen las relaciones.
- **Nombre de archivo** `EV-044-revisar-tercera-forma-normal.txt`.
- **Soporte real** Pendiente. Pendiente de ejecución y soporte específico.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-045 Extensión modular futura

- **Caso y estado** CP-045 · NO EJECUTADO.
- **Módulo y rol** Arquitectura · Analista y desarrollador.
- **Datos** Módulo hipotético de inventario o facturación, sin desarrollo en este UAT.
- **Acciones** 1. Trazar puntos de registro de rutas, permisos, modelos y vistas · 2. Describir cambios mínimos de integración · 3. Revisar dependencias con el equipo.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** El diseño permite incorporar el módulo en componentes separados con cambios acotados de integración.
- **Nombre de archivo** `EV-045-extension-modular-futura.txt`.
- **Soporte real** Pendiente. Pendiente de ejecución y soporte específico.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-046 Compatibilidad de navegadores

- **Caso y estado** CP-046 · NO EJECUTADO.
- **Módulo y rol** Interfaz · Evaluador.
- **Datos** Chrome, Firefox, Safari y Edge; versiones por registrar.
- **Acciones** 1. En cada navegador ejecutar acceso, catálogo, alta de solicitud y cierre de sesión · 2. Anotar versión y dispositivo · 3. Registrar diferencias visuales y de comportamiento.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** El flujo termina en los cuatro navegadores sin bloqueos ni pérdida de datos.
- **Nombre de archivo** `EV-046-compatibilidad-de-navegadores.png`.
- **Soporte real** Pendiente. Pendiente de ejecución y soporte específico.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-047 Identidad corporativa

- **Caso y estado** CP-047 · NO EJECUTADO.
- **Módulo y rol** Login, administrador y cliente · Diseñador y representante DOVI.
- **Datos** Logo y paleta autorizados por DOVI; figuras 63 a 65.
- **Acciones** 1. Abrir las tres interfaces · 2. Comparar logo, nombre y paleta con los recursos autorizados · 3. Registrar aprobación visual.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** Las tres interfaces presentan la identidad ratificada por DOVI.
- **Nombre de archivo** `EV-047-identidad-corporativa.png`.
- **Soporte real** Pendiente. Pendiente de ejecución y soporte específico.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-048 Confidencialidad de solicitudes

- **Caso y estado** CP-048 · APROBADO.
- **Módulo y rol** Portal cliente · Cliente y cliente alterno.
- **Datos** cliente@dovi.test, otro@dovi.test, Finca Horizonte y tres solicitudes UAT.
- **Acciones** 1. Iniciar dos sesiones independientes · 2. Crear las solicitudes con el propietario · 3. Comparar Mis solicitudes en ambas cuentas.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** El propietario ve sus registros y la cuenta alterna no recibe registros ni detalles ajenos.
- **Nombre de archivo** `EV-048-confidencialidad-de-solicitudes.png`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `request`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-049 Confidencialidad en las labores

- **Caso y estado** CP-049 · BLOQUEADO.
- **Módulo y rol** Panel empleado y supervisor · Empleado y supervisor.
- **Datos** Personal UAT, Apoyo UAT y dos labores de equipos distintos.
- **Acciones** 1. Abrir ambas sesiones · 2. Consultar las listas y perfiles disponibles · 3. Comparar alcance por pertenencia a cada equipo.
- **Momento** Registrar el punto de bloqueo. Al disponer del módulo, capturar al concluir el último paso.
- **Resultado esperado** Cada empleado ve lo asignado y cada supervisor solo puede consultar o anotar perfiles bajo su mando.
- **Nombre de archivo** `EV-049-confidencialidad-en-las-labores.png`.
- **Soporte real** Pendiente. La funcionalidad o dependencia de campo requerida no está disponible en esta versión.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.

## EV-050 Registro de fallos del servidor

- **Caso y estado** CP-050 · NO APROBADO.
- **Módulo y rol** Backend · Desarrollador.
- **Datos** Incidente inducido en una instancia QA desechable y hora registrada.
- **Acciones** 1. Cerrar el pool en una instancia desechable de QA para simular indisponibilidad · 2. Solicitar /salud y revisar el registro · 3. Reiniciar la instancia QA y conservar un extracto depurado.
- **Momento** Capturar el resultado al concluir el último paso. Si hay cambios de rol o vistas separadas, conservar también la pantalla previa.
- **Resultado esperado** Se registra el fallo con datos suficientes para identificar momento y operación sin divulgar secretos.
- **Nombre de archivo** `EV-050-registro-de-fallos-del-servidor.txt`.
- **Soporte real** [Ejecución automatizada](evidencias/ejecucion-http.json) · clave `logging`.
- **Registro manual** Fecha y evaluador ________ · Resultado real ________ · Archivo ________.
