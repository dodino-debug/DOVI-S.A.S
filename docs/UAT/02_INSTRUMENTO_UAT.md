# Instrumento de Aceptación de Usuario

## 1. Portada

**Plataforma Web de Gestión DOVI S.A.S.**  
Universidad Popular del Cesar, Seccional Aguachica  
Asignatura Ingeniería del Software  
Empresa cliente DOVI S.A.S.  
Equipo ________________________  
Docente ________________________  
Versión del instrumento 1.0  
Verificación técnica realizada el 24 de noviembre de 2026

## 2. Tabla de contenido

1. [Portada](#1-portada)
2. [Tabla de contenido](#2-tabla-de-contenido)
3. [Introducción](#3-introducción)
4. [Objetivos del instrumento UAT](#4-objetivos-del-instrumento-uat)
5. [Identificación del proyecto](#5-identificación-del-proyecto)
6. [Responsables](#6-responsables)
7. [Ambiente de pruebas](#7-ambiente-de-pruebas)
8. [Alcance y exclusiones](#8-alcance-y-exclusiones)
9. [Criterios de aceptación](#9-criterios-de-aceptación)
10. [Matriz de trazabilidad](#10-matriz-de-trazabilidad)
11. [Diseño de casos de prueba](#11-diseño-de-casos-de-prueba)
12. [Ejecución y resultados](#12-ejecución-y-resultados)
13. [Indicadores de calidad](#13-indicadores-de-calidad)
14. [Evidencias](#14-evidencias)
15. [Registro de incidencias](#15-registro-de-incidencias)
16. [Conclusiones](#16-conclusiones)
17. [Acta de aceptación](#17-acta-de-aceptación)
18. [Anexos](#18-anexos)

## 3. Introducción

La plataforma web de DOVI S.A.S. organiza clientes, predios, catálogo agrícola y solicitudes de servicio. Los procesos de campo y seguimiento se especifican en el documento de Ingeniería del Software. Este instrumento usa su texto y diagramas como referencia principal para determinar la conformidad y registrar los resultados técnicos y de aceptación.

## 4. Objetivos del instrumento UAT

Verificar el cumplimiento de los requisitos mediante criterios observables, reproducir los flujos disponibles y registrar las brechas, evidencias y validaciones pendientes para sustentar la decisión de DOVI S.A.S.

## 5. Identificación del proyecto

| Campo | Registro |
| --- | --- |
| Proyecto | Plataforma Web de Gestión DOVI S.A.S. |
| Empresa cliente | DOVI S.A.S. |
| NIT, sede y contacto | ________________ |
| Usuario evaluador y cargo | ________________ |
| Representante del cliente | ________________ |
| Versión evaluada | Git b3d4a2f, equivalente al árbol auditado inicialmente sobre 701e6f3 |
| Fecha de ejecución técnica | 24 de noviembre de 2026 |
| Fecha de evaluación del cliente | ________________ |

## 6. Responsables

| Responsable | Nombre | Funciones |
| --- | --- | --- |
| Analista | ________________ | Confirma requisitos, mantiene trazabilidad, prepara los casos, coordina pruebas, prioriza incidencias y consolida resultados. |
| Diseñador | ________________ | Ejecuta verificación visual, accesibilidad de navegación, diseño adaptable y usabilidad de campo. Organiza capturas. |
| Desarrollador | ________________ | Prepara ambiente aislado y datos sintéticos, ejecuta pruebas HTTP y SQL, reproduce fallos y registra hallazgos. |
| Representante / evaluador DOVI | ________________ | Ejecuta o presencia la validación, confirma resultados y registra la decisión formal. |

## 7. Ambiente de pruebas

| Elemento | Configuración |
| --- | --- |
| Entorno técnico | Windows, aplicación Express en loopback, Node.js v24.21.0 y PostgreSQL 18 aislado, con esquema aplicado desde cero. |
| Tecnologías | Express, EJS, HTML, CSS, JavaScript, pg, BCrypt, express-session, express-validator, Helmet y PostgreSQL. |
| Datos | Cuentas sintéticas dovi.test. Catálogo inicial con cuatro servicios. Credenciales de prueba generadas en memoria. |
| Cliente y dispositivo ejecutados | Fetch de Node.js y consultas SQL, desde equipo Windows de escritorio. |
| Navegadores del cliente | Chrome versión ____; Firefox ____; Safari ____; Edge ____. |
| Dispositivos del cliente | Escritorio ____; iPhone ____; Android ____; resolución ____. |
| URL, versión y fecha de preproducción | ________________ / ________________ / ________________ |
| Red | Loopback para las pruebas registradas. Documentar concurrencia, perfil normal y perfiles rurales al repetir. |

## 8. Alcance y exclusiones

El alcance comprende RF01–RF15, identificados en las figuras de casos de uso, y los 15 numerales sin identificador del apartado «Requerimientos No Funcionales». Se incluyen módulos pendientes, roles, validación de formularios y persistencia. El alta de finca por cliente se evalúa como caso condicional de RF03 debido a la divergencia entre artefactos. Cierre de sesión y cambio inicial amplían la comprobación de RF02. Se excluyen datos de producción, aplicación móvil independiente, trabajo avanzado sin conexión, integraciones externas ajenas al alcance y facturación e inventario como módulos vigentes. La extensibilidad para módulos futuros se conserva en el numeral 11.

## 9. Criterios de aceptación

Los criterios usan Dado, Cuando y Entonces. Los umbrales operativos adicionales sobre usabilidad y carga rural quedan sujetos a acuerdo de DOVI. Los numerales no funcionales citan su posición en el Word.

| CA | Requisito | Dado | Cuando | Entonces | Caso |
| --- | --- | --- | --- | --- | --- |
| CA-001 | RF01 | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Crear la cuenta y asignar supervisor 2. Repetir el alta con el mismo correo 3. Editar el nombre a Personal UAT Editado y filtrar por Empleado 4. Desactivar y consultar el estado | Se crea una cuenta con el supervisor elegido, se rechaza el duplicado, se conserva la edición y queda Inactivo. | CP-001 |
| CA-002 | RF01 | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Abrir la edición de la cuenta 2. Buscar el selector de rol y elegir Administrador 3. Guardar y volver al listado | La edición permite asignar y persistir el nuevo rol, como establece el caso de uso RF01. | CP-002 |
| CA-003 | RF01 | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Crear la cuenta con rol Administrador 2. Abrir listado y filtrar por Administrador | Aparece exactamente una cuenta con ese correo y rol. | CP-003 |
| CA-004 | RF02 | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. En cuatro sesiones independientes abrir /login 2. Autenticar cada cuenta con su clave de prueba 3. Comprobar la página de destino | Las cuatro cuentas ingresan y reciben su panel según rol. Supervisor conserva el perfil base empleado. | CP-004 |
| CA-005 | RF02 | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Abrir /login 2. Ingresar el correo y la clave incorrecta 3. Enviar | Se rechaza el acceso con aviso genérico y HTTP 401. | CP-005 |
| CA-006 | RF02 | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Ingresar al panel 2. Cerrar sesión 3. Volver a abrir /admin | La sesión termina y la ruta protegida redirige a /login. | CP-006 |
| CA-007 | RF02 | Instancia QA con sesiones separadas por rol y una sesión anónima. | 1. Abrir /admin y la API sin iniciar sesión 2. Como cliente, empleado y supervisor abrir /admin 3. Comparar con acceso de administrador y visitar /cliente con la cuenta administrativa | HTML anónimo redirige, API anónima responde 401 y una sesión con rol ajeno recibe 403. | CP-007 |
| CA-008 | RF02 | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Entrar con la clave temporal 2. Abrir /empleado antes de cambiarla 3. Enviar primero confirmación desigual y después igual 4. Salir e intentar la clave anterior | El cambio es obligatorio, se rechaza la confirmación desigual y la clave anterior deja de funcionar. | CP-008 |
| CA-009 | RF03 | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Crear propietaria 2. Editar teléfono y buscar por Propietaria 3. Crear predio con 0 ha y luego con 12,5 ha 4. Editar ubicación y área, y reabrir detalle | El directorio encuentra la cuenta, se rechaza el área cero y el detalle conserva la finca actualizada. | CP-009 |
| CA-010 | RF03 | DOVI ratifica el actor documentado y la versión QA dispone del flujo. | 1. Abrir portal de cliente 2. Buscar opción de registrar finca propia 3. Guardar y comprobar la nueva ubicación en una solicitud | Si la empresa ratifica la colaboración de la figura 59, el cliente puede registrar su finca. El caso de uso RF03 describe al administrador. | CP-010 |
| CA-011 | RF04 | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Crear Poda UAT 2. Intentar el duplicado en mayúsculas 3. Renombrar 4. Consultar catálogo como cliente antes y después de deshabilitar | Persiste la edición, se rechaza el duplicado y el cliente solo ve el servicio mientras esté activo. | CP-011 |
| CA-012 | RF05 | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Abrir Solicitar 2. Crear una solicitud por detalle con la misma fecha 3. Abrir Mis solicitudes y recargar | Se observan las tres solicitudes propias pendientes, con servicio, predio y fecha. | CP-012 |
| CA-013 | RF05 | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Enviar una solicitud con fecha anterior en navegador o mediante el formulario HTTP 2. Comprobar que el selector excluye Finca Reserva y validar propiedad en prueba de integración con los datos sintéticos 3. Revisar el listado | La aplicación rechaza ambas combinaciones y el número de solicitudes permanece igual. | CP-013 |
| CA-014 | RF06 | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Abrir los tres detalles desde el panel 2. Intentar rechazo sin motivo y reagendar a la fecha original 3. Aprobar UAT-A, rechazar UAT-R con motivo y reagendar UAT-G 4. Revisar los historiales y verificar que una solicitud resuelta no admite otra decisión | Se rechazan los datos inválidos, se conserva cada decisión y solo existe una decisión por solicitud. | CP-014 |
| CA-015 | RF06 | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Abrir el detalle de UAT-G previamente reagendada 2. Comparar fecha y estado con el historial 3. Consultar el estado en el portal | La fecha pasa a D+8 y el estado queda Reagendada según el diagrama de actividades. | CP-015 |
| CA-016 | RF07 | Versión QA que disponga del módulo o dependencia y los registros indicados. | 1. Abrir Programar órdenes 2. Elegir UAT-A e introducir fecha, hora y ubicación 3. Guardar, consultar y editar la hora 4. Recargar | Existe una sola labor vinculada a UAT-A y conserva la hora editada. | CP-016 |
| CA-017 | RF07 | Versión QA que disponga del módulo o dependencia y los registros indicados. | 1. Abrir Programar órdenes 2. Buscar ambas solicitudes para crear una labor 3. Consultar las órdenes | Solo se pueden programar solicitudes aprobadas y no se crea una labor para las dos entradas. | CP-017 |
| CA-018 | RF08 | Versión QA que disponga del módulo o dependencia y los registros indicados. | 1. Abrir asignación y guardar un empleado 2. Agregar un segundo 3. Reemplazar el segundo por Apoyo UAT y volver al detalle | Se conservan las asignaciones esperadas sin duplicados y el reemplazado deja de figurar. | CP-018 |
| CA-019 | RF08 | Versión QA que disponga del módulo o dependencia y los registros indicados. | 1. Abrir el formulario de asignaciones 2. Enviar sin seleccionar 3. Volver a consultar | Aparece el aviso de selección inválida y la cuadrilla previamente guardada sigue igual. | CP-019 |
| CA-020 | RF09 | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Entrar como empleado en dispositivo móvil 2. Abrir Mis labores 3. Abrir el detalle de UAT-A y revisar ubicación | El panel muestra la lista propia y el detalle con fecha, hora y ubicación. | CP-020 |
| CA-021 | RF09 | Versión QA que disponga del módulo o dependencia y los registros indicados. | 1. Abrir progreso de equipo 2. Consultar el estado de la labor de Personal UAT 3. Buscar labores de Apoyo UAT | Se ve el progreso del subordinado y se excluye al personal ajeno. | CP-021 |
| CA-022 | RF10 | Versión QA que disponga del módulo o dependencia y los registros indicados. | 1. Abrir labores propias 2. Registrar los estados previstos en ejemplares independientes y escribir la nota 3. Recargar cada detalle | Se conservan estados y observaciones válidas de las labores asignadas. | CP-022 |
| CA-023 | RF10 | Versión QA que disponga del módulo o dependencia y los registros indicados. | 1. Abrir el perfil del subordinado 2. Registrar la observación y recargar 3. Comprobar que un empleado ajeno no ofrece esa acción al supervisor | La nota persiste para Personal UAT y el supervisor carece de acceso de edición sobre Apoyo UAT. | CP-023 |
| CA-024 | RF11 | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Entrar al portal con la cuenta de prueba 2. Abrir Mis solicitudes después de la decisión administrativa 3. Comparar estados y motivo | Se muestran Aprobada y Rechazada para las solicitudes propias y se presenta el motivo. | CP-024 |
| CA-025 | RF11 | Versión QA que disponga del módulo o dependencia y los registros indicados. | 1. Dejar abierto Mis solicitudes 2. En otra sesión actualizar la labor 3. Observar la vista cliente sin recarga manual y abrir detalle | El cliente observa el cambio sin recargar y consulta el progreso de la labor. Registrar tiempo observado, pues el requisito no fija latencia. | CP-025 |
| CA-026 | RF12 | Versión QA que disponga del módulo o dependencia y los registros indicados. | 1. Abrir historial como cliente y como administrador del cliente 2. Seleccionar Siembra y el periodo D+7 a D+9 3. Revisar resultados, fechas, labores y personal | Figura el evento completado dentro del rango con sus datos y se excluye el evento de D+12. | CP-026 |
| CA-027 | RF13 | Versión QA que disponga del módulo o dependencia y los registros indicados. | 1. Asignar la labor como administrador 2. Abrir avisos del empleado 3. Marcar el aviso como leído y recargar | La alerta se entrega al empleado destinatario y el estado leído se conserva. | CP-027 |
| CA-028 | RF13 | Versión QA que disponga del módulo o dependencia y los registros indicados. | 1. Cambiar el estado desde administración 2. Abrir avisos como cliente propietario y como otro cliente 3. Marcar el aviso propio como leído | Solo el propietario recibe la alerta de cambio y puede marcarla como leída. | CP-028 |
| CA-029 | RF14 | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Abrir /admin 2. Anotar contadores y abrir el detalle de una solicitud pendiente 3. Comparar el resumen y la respuesta de /api/admin/dashboard con el catálogo activo | El resumen muestra las tres categorías documentadas y permite revisar el detalle de una solicitud. | CP-029 |
| CA-030 | RF15 | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Abrir Reportes 2. Seleccionar el rango y consultar 3. Si existe exportación, abrir el archivo y comparar sus filas con el resultado | La consulta muestra solo la labor dentro del rango. Si se ofrece exportación, contiene el mismo conjunto. | CP-030 |
| CA-031 | RF15 | Versión QA que disponga del módulo o dependencia y los registros indicados. | 1. Abrir Reportes 2. Enviar el rango invertido | Se muestra validación y se evita generar un reporte ambiguo. | CP-031 |
| CA-032 | Requerimientos No Funcionales, numeral 1 (sin ID en la fuente) | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Consultar metadatos y formato de la clave almacenada con acceso QA 2. Verificar algoritmo y comparar en memoria 3. Registrar solo el resultado | BCrypt de coste verificado, sin valor original en la base y sin divulgar hashes. | CP-032 |
| CA-033 | Requerimientos No Funcionales, numeral 2 (sin ID en la fuente) | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Abrir ambos esquemas sin credenciales 2. Verificar que HTTP no entregue formularios y que HTTPS tenga certificado válido 3. Confirmar atributo Secure en sesión de producción | Toda vista y sesión operan bajo TLS, y HTTP redirige o se rechaza antes de recibir datos. | CP-033 |
| CA-034 | Requerimientos No Funcionales, numeral 3 (sin ID en la fuente) | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Abrir formulario nuevo de servicio 2. Enviar nombre obligatorio vacío 3. Ejecutar con el cliente QA una solicitud ordinaria sin token 4. Comprobar continuidad de sesión | El servicio inválido se rechaza con 400 y el POST sin token con 403. | CP-034 |
| CA-035 | Requerimientos No Funcionales, numeral 3 (sin ID en la fuente) | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Revisar que las escrituras pasan por validadores 2. Verificar parámetros enlazados en modelos y salida escapada en EJS 3. Guardar un nombre ordinario con ampersand y comprobar representación literal | Las entradas se validan en servidor, se parametrizan las consultas y el texto se muestra literalmente por la vista. | CP-035 |
| CA-036 | Requerimientos No Funcionales, numeral 4 (sin ID en la fuente) | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Repetir inicio de sesión, navegación y solicitud a cada tamaño 2. Abrir panel de empleado 3. Comprobar desplazamiento, acciones, campos y legibilidad | Los controles se pueden usar sin recorte ni desplazamiento horizontal de la página. Las tablas con contenedor propio conservan las acciones. | CP-036 |
| CA-037 | Requerimientos No Funcionales, numeral 5 (sin ID en la fuente) | Versión QA que disponga del módulo o dependencia y los registros indicados. | 1. Pedir a cada evaluador que encuentre una labor, identifique la ubicación y actualice el estado sin ayuda 2. Registrar tiempo, errores y percepción | Cada evaluador completa las tres tareas sin asistencia. DOVI ratifica este criterio operativo antes de la sesión. | CP-037 |
| CA-038 | Requerimientos No Funcionales, numeral 6 (sin ID en la fuente) | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Confirmar respuesta 200 2. Ejecutar diez lecturas consecutivas con Node y medir de inicio a fin de respuesta 3. Registrar máximo y perfil | Cada lectura estándar es menor o igual a 2.000 ms bajo el perfil registrado. | CP-038 |
| CA-039 | Requerimientos No Funcionales, numeral 6 (sin ID en la fuente) | Versión QA que disponga del módulo o dependencia y los registros indicados. | 1. Abrir el listado de labores 2. Medir diez lecturas con el perfil normal acordado 3. Registrar estados y latencias | Todas las lecturas de labores son HTTP 200 y no exceden 2.000 ms. | CP-039 |
| CA-040 | Requerimientos No Funcionales, numeral 7 (sin ID en la fuente) | Versión QA que disponga del módulo o dependencia y los registros indicados. | 1. Acordar límites y publicar ancho de banda y latencia de cada perfil 2. Limpiar caché y cargar la vista tres veces por perfil 3. Registrar tiempos, volumen y posibilidad de uso | La vista cumple el presupuesto acordado con DOVI en ambos perfiles y permite abrir la labor. Umbral por diligenciar. | CP-040 |
| CA-041 | Requerimientos No Funcionales, numeral 8 (sin ID en la fuente) | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Rastrear ruta, guardas, controlador, modelo, SQL y vista 2. Repetir con catálogo 3. Registrar responsabilidades por capa | Las rutas coordinan, los modelos consultan datos y las vistas presentan resultados sin acceso directo a PostgreSQL. | CP-041 |
| CA-042 | Requerimientos No Funcionales, numeral 9 (sin ID en la fuente) | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Acordar convención y revisar nombres y formato 2. Comparar validación, manejo de duplicados y credenciales 3. Registrar duplicación relevante | Se documentan criterios homogéneos y la lógica repetida que debe centralizarse según DRY. | CP-042 |
| CA-043 | Requerimientos No Funcionales, numeral 10 (sin ID en la fuente) | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. En una transacción de QA intentar alta con cliente y finca de distinto propietario 2. Registrar SQLSTATE 3. Revertir la transacción | La FK compuesta rechaza la pareja con SQLSTATE 23503. | CP-043 |
| CA-044 | Requerimientos No Funcionales, numeral 10 (sin ID en la fuente) | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Enumerar claves candidatas y dependencias funcionales 2. Buscar dependencias parciales y transitivas 3. Confirmar el esquema con el analista | Las tablas funcionales cumplen 3FN para las dependencias de negocio ratificadas y las claves protegen las relaciones. | CP-044 |
| CA-045 | Requerimientos No Funcionales, numeral 11 (sin ID en la fuente) | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Trazar puntos de registro de rutas, permisos, modelos y vistas 2. Describir cambios mínimos de integración 3. Revisar dependencias con el equipo | El diseño permite incorporar el módulo en componentes separados con cambios acotados de integración. | CP-045 |
| CA-046 | Requerimientos No Funcionales, numeral 12 (sin ID en la fuente) | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. En cada navegador ejecutar acceso, catálogo, alta de solicitud y cierre de sesión 2. Anotar versión y dispositivo 3. Registrar diferencias visuales y de comportamiento | El flujo termina en los cuatro navegadores sin bloqueos ni pérdida de datos. | CP-046 |
| CA-047 | Requerimientos No Funcionales, numeral 13 (sin ID en la fuente) | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Abrir las tres interfaces 2. Comparar logo, nombre y paleta con los recursos autorizados 3. Registrar aprobación visual | Las tres interfaces presentan la identidad ratificada por DOVI. | CP-047 |
| CA-048 | Requerimientos No Funcionales, numeral 14 (sin ID en la fuente) | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Iniciar dos sesiones independientes 2. Crear las solicitudes con el propietario 3. Comparar Mis solicitudes en ambas cuentas | El propietario ve sus registros y la cuenta alterna no recibe registros ni detalles ajenos. | CP-048 |
| CA-049 | Requerimientos No Funcionales, numeral 14 (sin ID en la fuente) | Versión QA que disponga del módulo o dependencia y los registros indicados. | 1. Abrir ambas sesiones 2. Consultar las listas y perfiles disponibles 3. Comparar alcance por pertenencia a cada equipo | Cada empleado ve lo asignado y cada supervisor solo puede consultar o anotar perfiles bajo su mando. | CP-049 |
| CA-050 | Requerimientos No Funcionales, numeral 15 (sin ID en la fuente) | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. | 1. Cerrar el pool en una instancia desechable de QA para simular indisponibilidad 2. Solicitar /salud y revisar el registro 3. Reiniciar la instancia QA y conservar un extracto depurado | Se registra el fallo con datos suficientes para identificar momento y operación sin divulgar secretos. | CP-050 |

## 10. Matriz de trazabilidad

La [matriz CSV](03_MATRIZ_TRAZABILIDAD.csv) vincula texto original, referencia de código, criterio, caso, evidencia y estado. La clasificación de implementación corresponde a la inspección. El estado de un caso corresponde a su ejecución o al impedimento registrado.

| Requisito o referencia | Implementación | Criterios | Casos | Estado de ejecución |
| --- | --- | --- | --- | --- |
| RF01 | Parcial | CA-001, CA-002, CA-003 | CP-001, CP-002, CP-003 | CP-001 APROBADO<br>CP-002 NO APROBADO<br>CP-003 APROBADO |
| RF02 | Implementado | CA-004, CA-005, CA-006, CA-007, CA-008 | CP-004, CP-005, CP-006, CP-007, CP-008 | CP-004 APROBADO<br>CP-005 APROBADO<br>CP-006 APROBADO<br>CP-007 APROBADO<br>CP-008 APROBADO |
| RF03 | Implementado | CA-009, CA-010 | CP-009, CP-010 | CP-009 APROBADO<br>CP-010 BLOQUEADO |
| RF04 | Implementado | CA-011 | CP-011 | CP-011 APROBADO |
| RF05 | Implementado | CA-012, CA-013 | CP-012, CP-013 | CP-012 APROBADO<br>CP-013 APROBADO |
| RF06 | Parcial | CA-014, CA-015 | CP-014, CP-015 | CP-014 APROBADO<br>CP-015 NO APROBADO |
| RF07 | No implementado | CA-016, CA-017 | CP-016, CP-017 | CP-016 BLOQUEADO<br>CP-017 BLOQUEADO |
| RF08 | No implementado | CA-018, CA-019 | CP-018, CP-019 | CP-018 BLOQUEADO<br>CP-019 BLOQUEADO |
| RF09 | No implementado | CA-020, CA-021 | CP-020, CP-021 | CP-020 NO APROBADO<br>CP-021 BLOQUEADO |
| RF10 | No implementado | CA-022, CA-023 | CP-022, CP-023 | CP-022 BLOQUEADO<br>CP-023 BLOQUEADO |
| RF11 | Parcial | CA-024, CA-025 | CP-024, CP-025 | CP-024 APROBADO<br>CP-025 BLOQUEADO |
| RF12 | No implementado | CA-026 | CP-026 | CP-026 BLOQUEADO |
| RF13 | No implementado | CA-027, CA-028 | CP-027, CP-028 | CP-027 BLOQUEADO<br>CP-028 BLOQUEADO |
| RF14 | Parcial | CA-029 | CP-029 | CP-029 NO APROBADO |
| RF15 | No implementado | CA-030, CA-031 | CP-030, CP-031 | CP-030 NO APROBADO<br>CP-031 BLOQUEADO |
| Requerimientos No Funcionales, numeral 1 (sin ID en la fuente) | Implementado | CA-032 | CP-032 | CP-032 APROBADO |
| Requerimientos No Funcionales, numeral 2 (sin ID en la fuente) | Parcial | CA-033 | CP-033 | CP-033 NO EJECUTADO |
| Requerimientos No Funcionales, numeral 3 (sin ID en la fuente) | Parcial | CA-034, CA-035 | CP-034, CP-035 | CP-034 APROBADO<br>CP-035 NO EJECUTADO |
| Requerimientos No Funcionales, numeral 4 (sin ID en la fuente) | Parcial | CA-036 | CP-036 | CP-036 NO EJECUTADO |
| Requerimientos No Funcionales, numeral 5 (sin ID en la fuente) | No implementado | CA-037 | CP-037 | CP-037 BLOQUEADO |
| Requerimientos No Funcionales, numeral 6 (sin ID en la fuente) | Parcial | CA-038, CA-039 | CP-038, CP-039 | CP-038 APROBADO<br>CP-039 BLOQUEADO |
| Requerimientos No Funcionales, numeral 7 (sin ID en la fuente) | No implementado | CA-040 | CP-040 | CP-040 BLOQUEADO |
| Requerimientos No Funcionales, numeral 8 (sin ID en la fuente) | Implementado | CA-041 | CP-041 | CP-041 NO EJECUTADO |
| Requerimientos No Funcionales, numeral 9 (sin ID en la fuente) | Parcial | CA-042 | CP-042 | CP-042 NO EJECUTADO |
| Requerimientos No Funcionales, numeral 10 (sin ID en la fuente) | Parcial | CA-043, CA-044 | CP-043, CP-044 | CP-043 APROBADO<br>CP-044 NO EJECUTADO |
| Requerimientos No Funcionales, numeral 11 (sin ID en la fuente) | Parcial | CA-045 | CP-045 | CP-045 NO EJECUTADO |
| Requerimientos No Funcionales, numeral 12 (sin ID en la fuente) | Parcial | CA-046 | CP-046 | CP-046 NO EJECUTADO |
| Requerimientos No Funcionales, numeral 13 (sin ID en la fuente) | Parcial | CA-047 | CP-047 | CP-047 NO EJECUTADO |
| Requerimientos No Funcionales, numeral 14 (sin ID en la fuente) | Parcial | CA-048, CA-049 | CP-048, CP-049 | CP-048 APROBADO<br>CP-049 BLOQUEADO |
| Requerimientos No Funcionales, numeral 15 (sin ID en la fuente) | Parcial | CA-050 | CP-050 | CP-050 NO APROBADO |

## 11. Diseño de casos de prueba

En el corte técnico, D+7 fue 2026-12-01 y D+8 fue 2026-12-02. Al reejecutar, D representa el día de ejecución en Bogotá. D+n indica días calendario desde D. Cada escenario usa cuentas y registros sintéticos, sesiones por rol y claves transferidas por separado. Guardar el identificador de cada solicitud para las pruebas posteriores.

### CP-001 Alta, edición y baja de personal

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-001 |
| Nombre del caso | Alta, edición y baja de personal |
| ID del requisito asociado | RF01 |
| ID del criterio de aceptación | CA-001 |
| Caso de uso asociado | RF01 · Gestionar usuarios y roles |
| Módulo evaluado | Usuarios |
| Actor o rol | Administrador |
| Objetivo de la prueba | Verificar alta, edición y baja de personal. |
| Prioridad | Media |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | Personal UAT, personal@dovi.test, 3000001234, rol Empleado, supervisor supervisor@dovi.test |
| Pasos numerados | 1. Crear la cuenta y asignar supervisor<br>2. Repetir el alta con el mismo correo<br>3. Editar el nombre a Personal UAT Editado y filtrar por Empleado<br>4. Desactivar y consultar el estado |
| Resultado esperado | Se crea una cuenta con el supervisor elegido, se rechaza el duplicado, se conserva la edición y queda Inactivo. |
| Resultado obtenido | Alta, supervisor asociado, rechazo del duplicado, edición visible y desactivación persistente. |
| Estado de la prueba | APROBADO |
| Identificador de la evidencia | EV-001 |
| Observaciones | Funcional automatizada HTTP y comprobaciones de integración Validación de usuario final pendiente. |

### CP-002 Cambiar rol de una cuenta existente

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-002 |
| Nombre del caso | Cambiar rol de una cuenta existente |
| ID del requisito asociado | RF01 |
| ID del criterio de aceptación | CA-002 |
| Caso de uso asociado | RF01 · Gestionar usuarios y roles |
| Módulo evaluado | Usuarios |
| Actor o rol | Administrador |
| Objetivo de la prueba | Verificar cambiar rol de una cuenta existente. |
| Prioridad | Media |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | personal@dovi.test, de Empleado a Administrador |
| Pasos numerados | 1. Abrir la edición de la cuenta<br>2. Buscar el selector de rol y elegir Administrador<br>3. Guardar y volver al listado |
| Resultado esperado | La edición permite asignar y persistir el nuevo rol, como establece el caso de uso RF01. |
| Resultado obtenido | Se solicitó actualizar el rol por el flujo de edición. HTTP 302 y rol persistido EMPLEADO. |
| Estado de la prueba | NO APROBADO |
| Identificador de la evidencia | EV-002 |
| Observaciones | Funcional automatizada HTTP y comprobaciones de integración Validación de usuario final pendiente. Incidencias INC-001. |

### CP-003 Alta de administrador

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-003 |
| Nombre del caso | Alta de administrador |
| ID del requisito asociado | RF01 |
| ID del criterio de aceptación | CA-003 |
| Caso de uso asociado | RF01 · Gestionar usuarios y roles |
| Módulo evaluado | Usuarios |
| Actor o rol | Administrador |
| Objetivo de la prueba | Verificar alta de administrador. |
| Prioridad | Media |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | Jefa UAT, jefa@dovi.test, 3000001450 |
| Pasos numerados | 1. Crear la cuenta con rol Administrador<br>2. Abrir listado y filtrar por Administrador |
| Resultado esperado | Aparece exactamente una cuenta con ese correo y rol. |
| Resultado obtenido | La cuenta se creó y figura en el filtro administrador. PostgreSQL conserva una sola fila ADMINISTRADOR. |
| Estado de la prueba | APROBADO |
| Identificador de la evidencia | EV-003 |
| Observaciones | Funcional automatizada HTTP y comprobaciones de integración. Validación de usuario final pendiente. |

### CP-004 Ingreso de los cuatro perfiles

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-004 |
| Nombre del caso | Ingreso de los cuatro perfiles |
| ID del requisito asociado | RF02 |
| ID del criterio de aceptación | CA-004 |
| Caso de uso asociado | RF02 · Iniciar sesión y controlar el acceso por rol |
| Módulo evaluado | Login |
| Actor o rol | Administrador, cliente, empleado y supervisor |
| Objetivo de la prueba | Verificar ingreso de los cuatro perfiles. |
| Prioridad | Alta |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | admin@dovi.test, cliente@dovi.test, empleado@dovi.test, supervisor@dovi.test |
| Pasos numerados | 1. En cuatro sesiones independientes abrir /login<br>2. Autenticar cada cuenta con su clave de prueba<br>3. Comprobar la página de destino |
| Resultado esperado | Las cuatro cuentas ingresan y reciben su panel según rol. Supervisor conserva el perfil base empleado. |
| Resultado obtenido | Cuatro perfiles autenticados con redirección y destino HTTP 200. Supervisor y empleado llegan al mismo panel. |
| Estado de la prueba | APROBADO |
| Identificador de la evidencia | EV-004 |
| Observaciones | Funcional automatizada HTTP y comprobaciones de integración Validación de usuario final pendiente. |

### CP-005 Credenciales incorrectas

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-005 |
| Nombre del caso | Credenciales incorrectas |
| ID del requisito asociado | RF02 |
| ID del criterio de aceptación | CA-005 |
| Caso de uso asociado | RF02 · Iniciar sesión y controlar el acceso por rol |
| Módulo evaluado | Login |
| Actor o rol | Anónimo |
| Objetivo de la prueba | Verificar credenciales incorrectas. |
| Prioridad | Alta |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | admin@dovi.test y una clave de ensayo distinta de la asignada |
| Pasos numerados | 1. Abrir /login<br>2. Ingresar el correo y la clave incorrecta<br>3. Enviar |
| Resultado esperado | Se rechaza el acceso con aviso genérico y HTTP 401. |
| Resultado obtenido | Credencial incorrecta rechazada con HTTP 401. |
| Estado de la prueba | APROBADO |
| Identificador de la evidencia | EV-005 |
| Observaciones | Funcional automatizada HTTP y comprobaciones de integración Validación de usuario final pendiente. |

### CP-006 Cerrar sesión y volver al panel

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-006 |
| Nombre del caso | Cerrar sesión y volver al panel |
| ID del requisito asociado | RF02 |
| ID del criterio de aceptación | CA-006 |
| Caso de uso asociado | RF02 · Iniciar sesión y controlar el acceso por rol |
| Módulo evaluado | Login |
| Actor o rol | Administrador |
| Objetivo de la prueba | Verificar cerrar sesión y volver al panel. |
| Prioridad | Alta |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | admin@dovi.test y /admin |
| Pasos numerados | 1. Ingresar al panel<br>2. Cerrar sesión<br>3. Volver a abrir /admin |
| Resultado esperado | La sesión termina y la ruta protegida redirige a /login. |
| Resultado obtenido | Cierre y visita posterior a /admin redirigieron a /login. |
| Estado de la prueba | APROBADO |
| Identificador de la evidencia | EV-006 |
| Observaciones | Funcional automatizada HTTP y comprobaciones de integración Validación de usuario final pendiente. |

### CP-007 Acceso directo a rutas protegidas

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-007 |
| Nombre del caso | Acceso directo a rutas protegidas |
| ID del requisito asociado | RF02 |
| ID del criterio de aceptación | CA-007 |
| Caso de uso asociado | RF02 · Iniciar sesión y controlar el acceso por rol |
| Módulo evaluado | Permisos |
| Actor o rol | Anónimo, cliente, empleado, supervisor y administrador |
| Objetivo de la prueba | Verificar acceso directo a rutas protegidas. |
| Prioridad | Alta |
| Precondiciones | Instancia QA con sesiones separadas por rol y una sesión anónima. |
| Datos de prueba concretos | /admin, /cliente y /api/admin/dashboard |
| Pasos numerados | 1. Abrir /admin y la API sin iniciar sesión<br>2. Como cliente, empleado y supervisor abrir /admin<br>3. Comparar con acceso de administrador y visitar /cliente con la cuenta administrativa |
| Resultado esperado | HTML anónimo redirige, API anónima responde 401 y una sesión con rol ajeno recibe 403. |
| Resultado obtenido | Sesión ausente redirige en HTML y produce HTTP 401 en API. Roles ajenos reciben 403. |
| Estado de la prueba | APROBADO |
| Identificador de la evidencia | EV-007 |
| Observaciones | Funcional automatizada HTTP y comprobaciones de integración Validación de usuario final pendiente. |

### CP-008 Cambio inicial de contraseña

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-008 |
| Nombre del caso | Cambio inicial de contraseña |
| ID del requisito asociado | RF02 |
| ID del criterio de aceptación | CA-008 |
| Caso de uso asociado | RF02 · Iniciar sesión y controlar el acceso por rol |
| Módulo evaluado | Contraseña |
| Actor o rol | Empleado |
| Objetivo de la prueba | Verificar cambio inicial de contraseña. |
| Prioridad | Alta |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | temporal@dovi.test, clave temporal del evaluador, nueva clave de 18 caracteres o más, confirmación desigual |
| Pasos numerados | 1. Entrar con la clave temporal<br>2. Abrir /empleado antes de cambiarla<br>3. Enviar primero confirmación desigual y después igual<br>4. Salir e intentar la clave anterior |
| Resultado esperado | El cambio es obligatorio, se rechaza la confirmación desigual y la clave anterior deja de funcionar. |
| Resultado obtenido | Cambio inicial obligatorio. Confirmación desigual rechazada. Clave anterior invalidada. |
| Estado de la prueba | APROBADO |
| Identificador de la evidencia | EV-008 |
| Observaciones | Funcional automatizada HTTP y comprobaciones de integración Validación de usuario final pendiente. |

### CP-009 Directorio, búsqueda y predios

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-009 |
| Nombre del caso | Directorio, búsqueda y predios |
| ID del requisito asociado | RF03 |
| ID del criterio de aceptación | CA-009 |
| Caso de uso asociado | RF03 · Gestionar clientes y fincas |
| Módulo evaluado | Clientes y predios |
| Actor o rol | Administrador |
| Objetivo de la prueba | Verificar directorio, búsqueda y predios. |
| Prioridad | Media |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | Propietaria UAT, propietaria@dovi.test, 3000000123/3000000124, Finca Mirador, Vereda Norte/Sur, 0/12,5/13,5 ha |
| Pasos numerados | 1. Crear propietaria<br>2. Editar teléfono y buscar por Propietaria<br>3. Crear predio con 0 ha y luego con 12,5 ha<br>4. Editar ubicación y área, y reabrir detalle |
| Resultado esperado | El directorio encuentra la cuenta, se rechaza el área cero y el detalle conserva la finca actualizada. |
| Resultado obtenido | Alta de propietaria, edición, búsqueda y registro/edición de finca confirmados. Área cero recibió 400. |
| Estado de la prueba | APROBADO |
| Identificador de la evidencia | EV-009 |
| Observaciones | Funcional automatizada HTTP y comprobaciones de integración Validación de usuario final pendiente. |

### CP-010 Registro de finca descrito en colaboración

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-010 |
| Nombre del caso | Registro de finca descrito en colaboración |
| ID del requisito asociado | RF03 |
| ID del criterio de aceptación | CA-010 |
| Caso de uso asociado | RF03 · Gestionar clientes y fincas |
| Módulo evaluado | Predios |
| Actor o rol | Cliente |
| Objetivo de la prueba | Verificar registro de finca descrito en colaboración. |
| Prioridad | Media |
| Precondiciones | DOVI ratifica el actor documentado y la versión QA dispone del flujo. |
| Datos de prueba concretos | cliente@dovi.test, Finca Ladera, Vereda UAT, 9 ha |
| Pasos numerados | 1. Abrir portal de cliente<br>2. Buscar opción de registrar finca propia<br>3. Guardar y comprobar la nueva ubicación en una solicitud |
| Resultado esperado | Si la empresa ratifica la colaboración de la figura 59, el cliente puede registrar su finca. El caso de uso RF03 describe al administrador. |
| Resultado obtenido | Pendiente de ratificación del actor en RF03. La ruta de autoservicio no existe. |
| Estado de la prueba | BLOQUEADO |
| Identificador de la evidencia | EV-010 |
| Observaciones | Inspección documental o de código, sin ejecución funcional. Validación de usuario final pendiente. Incidencias INC-014. |

### CP-011 Crear, editar, deshabilitar y consultar catálogo

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-011 |
| Nombre del caso | Crear, editar, deshabilitar y consultar catálogo |
| ID del requisito asociado | RF04 |
| ID del criterio de aceptación | CA-011 |
| Caso de uso asociado | RF04 · Gestionar el catálogo de servicios |
| Módulo evaluado | Servicios |
| Actor o rol | Administrador y cliente |
| Objetivo de la prueba | Verificar crear, editar, deshabilitar y consultar catálogo. |
| Prioridad | Media |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | Poda UAT, PODA UAT y Poda dirigida UAT |
| Pasos numerados | 1. Crear Poda UAT<br>2. Intentar el duplicado en mayúsculas<br>3. Renombrar<br>4. Consultar catálogo como cliente antes y después de deshabilitar |
| Resultado esperado | Persiste la edición, se rechaza el duplicado y el cliente solo ve el servicio mientras esté activo. |
| Resultado obtenido | Alta, edición y ocultación de servicio inactivo confirmadas. Duplicado sin distinguir mayúsculas rechazado. |
| Estado de la prueba | APROBADO |
| Identificador de la evidencia | EV-011 |
| Observaciones | Funcional automatizada HTTP y comprobaciones de integración Validación de usuario final pendiente. |

### CP-012 Registrar tres solicitudes válidas

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-012 |
| Nombre del caso | Registrar tres solicitudes válidas |
| ID del requisito asociado | RF05 |
| ID del criterio de aceptación | CA-012 |
| Caso de uso asociado | RF05 · Crear solicitud de servicio |
| Módulo evaluado | Solicitudes |
| Actor o rol | Cliente |
| Objetivo de la prueba | Verificar registrar tres solicitudes válidas. |
| Prioridad | Media |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | Siembra, Finca Horizonte, D+7, detalles UAT-A, UAT-R y UAT-G |
| Pasos numerados | 1. Abrir Solicitar<br>2. Crear una solicitud por detalle con la misma fecha<br>3. Abrir Mis solicitudes y recargar |
| Resultado esperado | Se observan las tres solicitudes propias pendientes, con servicio, predio y fecha. |
| Resultado obtenido | Tres solicitudes pendientes persistieron. El cliente propio las consulta y la segunda cuenta no las recibe. |
| Estado de la prueba | APROBADO |
| Identificador de la evidencia | EV-012 |
| Observaciones | Funcional automatizada HTTP y comprobaciones de integración Validación de usuario final pendiente. |

### CP-013 Rechazar fecha anterior y predio ajeno

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-013 |
| Nombre del caso | Rechazar fecha anterior y predio ajeno |
| ID del requisito asociado | RF05 |
| ID del criterio de aceptación | CA-013 |
| Caso de uso asociado | RF05 · Crear solicitud de servicio |
| Módulo evaluado | Solicitudes |
| Actor o rol | Cliente |
| Objetivo de la prueba | Verificar rechazar fecha anterior y predio ajeno. |
| Prioridad | Media |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | Siembra, 2000-01-01, Finca Reserva del cliente alterno |
| Pasos numerados | 1. Enviar una solicitud con fecha anterior en navegador o mediante el formulario HTTP<br>2. Comprobar que el selector excluye Finca Reserva y validar propiedad en prueba de integración con los datos sintéticos<br>3. Revisar el listado |
| Resultado esperado | La aplicación rechaza ambas combinaciones y el número de solicitudes permanece igual. |
| Resultado obtenido | Fecha pasada y selección de predio ajeno rechazadas con 400, sin alta adicional. |
| Estado de la prueba | APROBADO |
| Identificador de la evidencia | EV-013 |
| Observaciones | Funcional automatizada HTTP y comprobaciones de integración Validación de usuario final pendiente. |

### CP-014 Revisar y resolver solicitudes pendientes

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-014 |
| Nombre del caso | Revisar y resolver solicitudes pendientes |
| ID del requisito asociado | RF06 |
| ID del criterio de aceptación | CA-014 |
| Caso de uso asociado | RF06 · Revisar solicitudes de servicio |
| Módulo evaluado | Solicitudes |
| Actor o rol | Administrador |
| Objetivo de la prueba | Verificar revisar y resolver solicitudes pendientes. |
| Prioridad | Media |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | UAT-A, UAT-R y UAT-G, motivo Cuadrilla no disponible, D+7 y D+8 |
| Pasos numerados | 1. Abrir los tres detalles desde el panel<br>2. Intentar rechazo sin motivo y reagendar a la fecha original<br>3. Aprobar UAT-A, rechazar UAT-R con motivo y reagendar UAT-G<br>4. Revisar los historiales y verificar que una solicitud resuelta no admite otra decisión |
| Resultado esperado | Se rechazan los datos inválidos, se conserva cada decisión y solo existe una decisión por solicitud. |
| Resultado obtenido | Las tres decisiones persistieron con historial. Motivo vacío y fecha igual recibieron 400. Segunda decisión recibió 409. |
| Estado de la prueba | APROBADO |
| Identificador de la evidencia | EV-014 |
| Observaciones | Funcional automatizada HTTP y comprobaciones de integración Validación de usuario final pendiente. |

### CP-015 Estado visible luego de reagendar

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-015 |
| Nombre del caso | Estado visible luego de reagendar |
| ID del requisito asociado | RF06 |
| ID del criterio de aceptación | CA-015 |
| Caso de uso asociado | RF06 · Revisar solicitudes de servicio |
| Módulo evaluado | Solicitudes |
| Actor o rol | Administrador y cliente |
| Objetivo de la prueba | Verificar estado visible luego de reagendar. |
| Prioridad | Media |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | UAT-G, de D+7 a D+8 |
| Pasos numerados | 1. Abrir el detalle de UAT-G previamente reagendada<br>2. Comparar fecha y estado con el historial<br>3. Consultar el estado en el portal |
| Resultado esperado | La fecha pasa a D+8 y el estado queda Reagendada según el diagrama de actividades. |
| Resultado obtenido | El diagrama de actividades RF06 marca Reagendada. La fecha cambió y el estado persistido fue APROBADA. |
| Estado de la prueba | NO APROBADO |
| Identificador de la evidencia | EV-015 |
| Observaciones | Funcional automatizada HTTP y comprobaciones de integración Validación de usuario final pendiente. Incidencias INC-002. |

### CP-016 Crear, consultar y editar una labor aprobada

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-016 |
| Nombre del caso | Crear, consultar y editar una labor aprobada |
| ID del requisito asociado | RF07 |
| ID del criterio de aceptación | CA-016 |
| Caso de uso asociado | RF07 · Programar órdenes de trabajo |
| Módulo evaluado | Labores |
| Actor o rol | Administrador |
| Objetivo de la prueba | Verificar crear, consultar y editar una labor aprobada. |
| Prioridad | Alta |
| Precondiciones | Versión QA que disponga del módulo o dependencia y los registros indicados. |
| Datos de prueba concretos | UAT-A aprobada, D+8, 07:30, Finca Horizonte, cambiar a 08:00 |
| Pasos numerados | 1. Abrir Programar órdenes<br>2. Elegir UAT-A e introducir fecha, hora y ubicación<br>3. Guardar, consultar y editar la hora<br>4. Recargar |
| Resultado esperado | Existe una sola labor vinculada a UAT-A y conserva la hora editada. |
| Resultado obtenido | La funcionalidad o dependencia de campo requerida no está disponible en esta versión. |
| Estado de la prueba | BLOQUEADO |
| Identificador de la evidencia | EV-016 |
| Observaciones | Inspección documental o de código, sin ejecución funcional. Validación de usuario final pendiente. Incidencias INC-003. |

### CP-017 Excluir solicitudes pendientes o rechazadas

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-017 |
| Nombre del caso | Excluir solicitudes pendientes o rechazadas |
| ID del requisito asociado | RF07 |
| ID del criterio de aceptación | CA-017 |
| Caso de uso asociado | RF07 · Programar órdenes de trabajo |
| Módulo evaluado | Labores |
| Actor o rol | Administrador |
| Objetivo de la prueba | Verificar excluir solicitudes pendientes o rechazadas. |
| Prioridad | Alta |
| Precondiciones | Versión QA que disponga del módulo o dependencia y los registros indicados. |
| Datos de prueba concretos | Una pendiente UAT-P y UAT-R rechazada |
| Pasos numerados | 1. Abrir Programar órdenes<br>2. Buscar ambas solicitudes para crear una labor<br>3. Consultar las órdenes |
| Resultado esperado | Solo se pueden programar solicitudes aprobadas y no se crea una labor para las dos entradas. |
| Resultado obtenido | La funcionalidad o dependencia de campo requerida no está disponible en esta versión. |
| Estado de la prueba | BLOQUEADO |
| Identificador de la evidencia | EV-017 |
| Observaciones | Inspección documental o de código, sin ejecución funcional. Validación de usuario final pendiente. Incidencias INC-003. |

### CP-018 Asignar y reasignar cuadrilla

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-018 |
| Nombre del caso | Asignar y reasignar cuadrilla |
| ID del requisito asociado | RF08 |
| ID del criterio de aceptación | CA-018 |
| Caso de uso asociado | RF08 · Asignar empleados a una labor |
| Módulo evaluado | Labores |
| Actor o rol | Administrador |
| Objetivo de la prueba | Verificar asignar y reasignar cuadrilla. |
| Prioridad | Alta |
| Precondiciones | Versión QA que disponga del módulo o dependencia y los registros indicados. |
| Datos de prueba concretos | Labor UAT-A, empleado@dovi.test, personal@dovi.test y apoyo@dovi.test activos |
| Pasos numerados | 1. Abrir asignación y guardar un empleado<br>2. Agregar un segundo<br>3. Reemplazar el segundo por Apoyo UAT y volver al detalle |
| Resultado esperado | Se conservan las asignaciones esperadas sin duplicados y el reemplazado deja de figurar. |
| Resultado obtenido | La funcionalidad o dependencia de campo requerida no está disponible en esta versión. |
| Estado de la prueba | BLOQUEADO |
| Identificador de la evidencia | EV-018 |
| Observaciones | Inspección documental o de código, sin ejecución funcional. Validación de usuario final pendiente. Incidencias INC-004. |

### CP-019 Validar selección vacía

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-019 |
| Nombre del caso | Validar selección vacía |
| ID del requisito asociado | RF08 |
| ID del criterio de aceptación | CA-019 |
| Caso de uso asociado | RF08 · Asignar empleados a una labor |
| Módulo evaluado | Labores |
| Actor o rol | Administrador |
| Objetivo de la prueba | Verificar validar selección vacía. |
| Prioridad | Alta |
| Precondiciones | Versión QA que disponga del módulo o dependencia y los registros indicados. |
| Datos de prueba concretos | Labor UAT-A y cero empleados seleccionados |
| Pasos numerados | 1. Abrir el formulario de asignaciones<br>2. Enviar sin seleccionar<br>3. Volver a consultar |
| Resultado esperado | Aparece el aviso de selección inválida y la cuadrilla previamente guardada sigue igual. |
| Resultado obtenido | La funcionalidad o dependencia de campo requerida no está disponible en esta versión. |
| Estado de la prueba | BLOQUEADO |
| Identificador de la evidencia | EV-019 |
| Observaciones | Inspección documental o de código, sin ejecución funcional. Validación de usuario final pendiente. Incidencias INC-004. |

### CP-020 Ver labores propias y ubicación

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-020 |
| Nombre del caso | Ver labores propias y ubicación |
| ID del requisito asociado | RF09 |
| ID del criterio de aceptación | CA-020 |
| Caso de uso asociado | RF09 · Consultar labores asignadas y progreso del equipo |
| Módulo evaluado | Panel empleado |
| Actor o rol | Empleado |
| Objetivo de la prueba | Verificar ver labores propias y ubicación. |
| Prioridad | Alta |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | empleado@dovi.test, UAT-A a las 07:30, Finca Horizonte |
| Pasos numerados | 1. Entrar como empleado en dispositivo móvil<br>2. Abrir Mis labores<br>3. Abrir el detalle de UAT-A y revisar ubicación |
| Resultado esperado | El panel muestra la lista propia y el detalle con fecha, hora y ubicación. |
| Resultado obtenido | Panel /empleado HTTP 200 con vista provisional. Ruta mostrada en la secuencia /empleado/labores HTTP 404. |
| Estado de la prueba | NO APROBADO |
| Identificador de la evidencia | EV-020 |
| Observaciones | Funcional automatizada HTTP y comprobaciones de integración Validación de usuario final pendiente. Incidencias INC-005. |

### CP-021 Consultar solo al personal a cargo

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-021 |
| Nombre del caso | Consultar solo al personal a cargo |
| ID del requisito asociado | RF09 |
| ID del criterio de aceptación | CA-021 |
| Caso de uso asociado | RF09 · Consultar labores asignadas y progreso del equipo |
| Módulo evaluado | Panel supervisor |
| Actor o rol | Supervisor |
| Objetivo de la prueba | Verificar consultar solo al personal a cargo. |
| Prioridad | Alta |
| Precondiciones | Versión QA que disponga del módulo o dependencia y los registros indicados. |
| Datos de prueba concretos | supervisor@dovi.test, Personal UAT subordinado y Apoyo UAT de otro equipo |
| Pasos numerados | 1. Abrir progreso de equipo<br>2. Consultar el estado de la labor de Personal UAT<br>3. Buscar labores de Apoyo UAT |
| Resultado esperado | Se ve el progreso del subordinado y se excluye al personal ajeno. |
| Resultado obtenido | La funcionalidad o dependencia de campo requerida no está disponible en esta versión. |
| Estado de la prueba | BLOQUEADO |
| Identificador de la evidencia | EV-021 |
| Observaciones | Inspección documental o de código, sin ejecución funcional. Validación de usuario final pendiente. |

### CP-022 Actualizar estados permitidos y observación

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-022 |
| Nombre del caso | Actualizar estados permitidos y observación |
| ID del requisito asociado | RF10 |
| ID del criterio de aceptación | CA-022 |
| Caso de uso asociado | RF10 · Cambiar estado de labores y registrar observaciones |
| Módulo evaluado | Labores |
| Actor o rol | Empleado |
| Objetivo de la prueba | Verificar actualizar estados permitidos y observación. |
| Prioridad | Alta |
| Precondiciones | Versión QA que disponga del módulo o dependencia y los registros indicados. |
| Datos de prueba concretos | Ejemplares de labor UAT con estados Pendiente, En Proceso, Completada y Cancelada; nota Lote norte revisado |
| Pasos numerados | 1. Abrir labores propias<br>2. Registrar los estados previstos en ejemplares independientes y escribir la nota<br>3. Recargar cada detalle |
| Resultado esperado | Se conservan estados y observaciones válidas de las labores asignadas. |
| Resultado obtenido | La funcionalidad o dependencia de campo requerida no está disponible en esta versión. |
| Estado de la prueba | BLOQUEADO |
| Identificador de la evidencia | EV-022 |
| Observaciones | Inspección documental o de código, sin ejecución funcional. Validación de usuario final pendiente. Incidencias INC-006. |

### CP-023 Registrar nota en perfil del subordinado

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-023 |
| Nombre del caso | Registrar nota en perfil del subordinado |
| ID del requisito asociado | RF10 |
| ID del criterio de aceptación | CA-023 |
| Caso de uso asociado | RF10 · Cambiar estado de labores y registrar observaciones |
| Módulo evaluado | Panel supervisor |
| Actor o rol | Supervisor |
| Objetivo de la prueba | Verificar registrar nota en perfil del subordinado. |
| Prioridad | Alta |
| Precondiciones | Versión QA que disponga del módulo o dependencia y los registros indicados. |
| Datos de prueba concretos | Personal UAT, Apoyo UAT y nota Equipo verificado |
| Pasos numerados | 1. Abrir el perfil del subordinado<br>2. Registrar la observación y recargar<br>3. Comprobar que un empleado ajeno no ofrece esa acción al supervisor |
| Resultado esperado | La nota persiste para Personal UAT y el supervisor carece de acceso de edición sobre Apoyo UAT. |
| Resultado obtenido | La funcionalidad o dependencia de campo requerida no está disponible en esta versión. |
| Estado de la prueba | BLOQUEADO |
| Identificador de la evidencia | EV-023 |
| Observaciones | Inspección documental o de código, sin ejecución funcional. Validación de usuario final pendiente. Incidencias INC-006. |

### CP-024 Consultar estado de solicitudes

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-024 |
| Nombre del caso | Consultar estado de solicitudes |
| ID del requisito asociado | RF11 |
| ID del criterio de aceptación | CA-024 |
| Caso de uso asociado | RF11 · Consultar estado de solicitudes y progreso del servicio |
| Módulo evaluado | Portal cliente |
| Actor o rol | Cliente |
| Objetivo de la prueba | Verificar consultar estado de solicitudes. |
| Prioridad | Media |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | UAT-A, UAT-R y motivo Cuadrilla no disponible |
| Pasos numerados | 1. Entrar al portal con la cuenta de prueba<br>2. Abrir Mis solicitudes después de la decisión administrativa<br>3. Comparar estados y motivo |
| Resultado esperado | Se muestran Aprobada y Rechazada para las solicitudes propias y se presenta el motivo. |
| Resultado obtenido | Estados y motivo aparecen cuando el cliente vuelve a consultar. |
| Estado de la prueba | APROBADO |
| Identificador de la evidencia | EV-024 |
| Observaciones | Funcional automatizada HTTP y comprobaciones de integración Validación de usuario final pendiente. Incidencias INC-007. |

### CP-025 Ver cambios en tiempo real y progreso de la labor

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-025 |
| Nombre del caso | Ver cambios en tiempo real y progreso de la labor |
| ID del requisito asociado | RF11 |
| ID del criterio de aceptación | CA-025 |
| Caso de uso asociado | RF11 · Consultar estado de solicitudes y progreso del servicio |
| Módulo evaluado | Portal cliente |
| Actor o rol | Cliente y administrador |
| Objetivo de la prueba | Verificar ver cambios en tiempo real y progreso de la labor. |
| Prioridad | Media |
| Precondiciones | Versión QA que disponga del módulo o dependencia y los registros indicados. |
| Datos de prueba concretos | UAT-A, labor asociada y estado En Proceso |
| Pasos numerados | 1. Dejar abierto Mis solicitudes<br>2. En otra sesión actualizar la labor<br>3. Observar la vista cliente sin recarga manual y abrir detalle |
| Resultado esperado | El cliente observa el cambio sin recargar y consulta el progreso de la labor. Registrar tiempo observado, pues el requisito no fija latencia. |
| Resultado obtenido | La funcionalidad o dependencia de campo requerida no está disponible en esta versión. |
| Estado de la prueba | BLOQUEADO |
| Identificador de la evidencia | EV-025 |
| Observaciones | Inspección documental o de código, sin ejecución funcional. Validación de usuario final pendiente. Incidencias INC-007. |

### CP-026 Historial por cliente y filtros

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-026 |
| Nombre del caso | Historial por cliente y filtros |
| ID del requisito asociado | RF12 |
| ID del criterio de aceptación | CA-026 |
| Caso de uso asociado | RF12 · Consultar historial de servicios |
| Módulo evaluado | Historial |
| Actor o rol | Administrador y cliente |
| Objetivo de la prueba | Verificar historial por cliente y filtros. |
| Prioridad | Alta |
| Precondiciones | Versión QA que disponga del módulo o dependencia y los registros indicados. |
| Datos de prueba concretos | Finca Horizonte, Siembra completada D+8, Personal UAT, evento fuera del rango D+12 |
| Pasos numerados | 1. Abrir historial como cliente y como administrador del cliente<br>2. Seleccionar Siembra y el periodo D+7 a D+9<br>3. Revisar resultados, fechas, labores y personal |
| Resultado esperado | Figura el evento completado dentro del rango con sus datos y se excluye el evento de D+12. |
| Resultado obtenido | La funcionalidad o dependencia de campo requerida no está disponible en esta versión. |
| Estado de la prueba | BLOQUEADO |
| Identificador de la evidencia | EV-026 |
| Observaciones | Inspección documental o de código, sin ejecución funcional. Validación de usuario final pendiente. Incidencias INC-008. |

### CP-027 Aviso por nueva labor

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-027 |
| Nombre del caso | Aviso por nueva labor |
| ID del requisito asociado | RF13 |
| ID del criterio de aceptación | CA-027 |
| Caso de uso asociado | RF13 · Generar notificaciones |
| Módulo evaluado | Notificaciones |
| Actor o rol | Empleado |
| Objetivo de la prueba | Verificar aviso por nueva labor. |
| Prioridad | Alta |
| Precondiciones | Versión QA que disponga del módulo o dependencia y los registros indicados. |
| Datos de prueba concretos | UAT-A y empleado@dovi.test |
| Pasos numerados | 1. Asignar la labor como administrador<br>2. Abrir avisos del empleado<br>3. Marcar el aviso como leído y recargar |
| Resultado esperado | La alerta se entrega al empleado destinatario y el estado leído se conserva. |
| Resultado obtenido | La funcionalidad o dependencia de campo requerida no está disponible en esta versión. |
| Estado de la prueba | BLOQUEADO |
| Identificador de la evidencia | EV-027 |
| Observaciones | Inspección documental o de código, sin ejecución funcional. Validación de usuario final pendiente. Incidencias INC-009. |

### CP-028 Aviso por cambio de solicitud

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-028 |
| Nombre del caso | Aviso por cambio de solicitud |
| ID del requisito asociado | RF13 |
| ID del criterio de aceptación | CA-028 |
| Caso de uso asociado | RF13 · Generar notificaciones |
| Módulo evaluado | Notificaciones |
| Actor o rol | Cliente |
| Objetivo de la prueba | Verificar aviso por cambio de solicitud. |
| Prioridad | Alta |
| Precondiciones | Versión QA que disponga del módulo o dependencia y los registros indicados. |
| Datos de prueba concretos | UAT-R rechazada, cliente@dovi.test y otro@dovi.test |
| Pasos numerados | 1. Cambiar el estado desde administración<br>2. Abrir avisos como cliente propietario y como otro cliente<br>3. Marcar el aviso propio como leído |
| Resultado esperado | Solo el propietario recibe la alerta de cambio y puede marcarla como leída. |
| Resultado obtenido | La funcionalidad o dependencia de campo requerida no está disponible en esta versión. |
| Estado de la prueba | BLOQUEADO |
| Identificador de la evidencia | EV-028 |
| Observaciones | Inspección documental o de código, sin ejecución funcional. Validación de usuario final pendiente. Incidencias INC-009. |

### CP-029 Ver pendientes, labores del día y servicios activos

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-029 |
| Nombre del caso | Ver pendientes, labores del día y servicios activos |
| ID del requisito asociado | RF14 |
| ID del criterio de aceptación | CA-029 |
| Caso de uso asociado | RF14 · Ver panel resumen del administrador |
| Módulo evaluado | Panel y API |
| Actor o rol | Administrador |
| Objetivo de la prueba | Verificar ver pendientes, labores del día y servicios activos. |
| Prioridad | Media |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | Esquema con cuatro servicios activos, solicitudes sintéticas y conteo esperado de labores del día |
| Pasos numerados | 1. Abrir /admin<br>2. Anotar contadores y abrir el detalle de una solicitud pendiente<br>3. Comparar el resumen y la respuesta de /api/admin/dashboard con el catálogo activo |
| Resultado esperado | El resumen muestra las tres categorías documentadas y permite revisar el detalle de una solicitud. |
| Resultado obtenido | El resumen ofrece pendientes, laboresHoy, empleadosEnCampo y solicitudes. Carece de servicios activos. |
| Estado de la prueba | NO APROBADO |
| Identificador de la evidencia | EV-029 |
| Observaciones | Funcional automatizada HTTP y comprobaciones de integración Validación de usuario final pendiente. Incidencias INC-010. |

### CP-030 Consultar reportes por rango

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-030 |
| Nombre del caso | Consultar reportes por rango |
| ID del requisito asociado | RF15 |
| ID del criterio de aceptación | CA-030 |
| Caso de uso asociado | RF15 · Generar reportes de labores |
| Módulo evaluado | Reportes |
| Actor o rol | Administrador |
| Objetivo de la prueba | Verificar consultar reportes por rango. |
| Prioridad | Alta |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | Rango D+7 a D+9, labor completada D+8 y otra D+12 |
| Pasos numerados | 1. Abrir Reportes<br>2. Seleccionar el rango y consultar<br>3. Si existe exportación, abrir el archivo y comparar sus filas con el resultado |
| Resultado esperado | La consulta muestra solo la labor dentro del rango. Si se ofrece exportación, contiene el mismo conjunto. |
| Resultado obtenido | Reportes devolvió HTTP 200 y una vista provisional sin controles de fecha. |
| Estado de la prueba | NO APROBADO |
| Identificador de la evidencia | EV-030 |
| Observaciones | Funcional automatizada HTTP y comprobaciones de integración Validación de usuario final pendiente. Incidencias INC-011. |

### CP-031 Validar rango invertido

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-031 |
| Nombre del caso | Validar rango invertido |
| ID del requisito asociado | RF15 |
| ID del criterio de aceptación | CA-031 |
| Caso de uso asociado | RF15 · Generar reportes de labores |
| Módulo evaluado | Reportes |
| Actor o rol | Administrador |
| Objetivo de la prueba | Verificar validar rango invertido. |
| Prioridad | Alta |
| Precondiciones | Versión QA que disponga del módulo o dependencia y los registros indicados. |
| Datos de prueba concretos | Desde D+9, hasta D+7 |
| Pasos numerados | 1. Abrir Reportes<br>2. Enviar el rango invertido |
| Resultado esperado | Se muestra validación y se evita generar un reporte ambiguo. |
| Resultado obtenido | La funcionalidad o dependencia de campo requerida no está disponible en esta versión. |
| Estado de la prueba | BLOQUEADO |
| Identificador de la evidencia | EV-031 |
| Observaciones | Inspección documental o de código, sin ejecución funcional. Validación de usuario final pendiente. |

### CP-032 Almacenamiento seguro de contraseñas

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-032 |
| Nombre del caso | Almacenamiento seguro de contraseñas |
| ID del requisito asociado | Requerimientos No Funcionales, numeral 1 (sin ID en la fuente) |
| ID del criterio de aceptación | CA-032 |
| Caso de uso asociado | Sin caso de uso UML propio; asociado a RF02 |
| Módulo evaluado | Usuarios y PostgreSQL |
| Actor o rol | Desarrollador |
| Objetivo de la prueba | Verificar almacenamiento seguro de contraseñas. |
| Prioridad | Alta |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | Cuenta admin sintética y cuenta personal creada por formulario |
| Pasos numerados | 1. Consultar metadatos y formato de la clave almacenada con acceso QA<br>2. Verificar algoritmo y comparar en memoria<br>3. Registrar solo el resultado |
| Resultado esperado | BCrypt de coste verificado, sin valor original en la base y sin divulgar hashes. |
| Resultado obtenido | Cuenta sintética y cuenta creada mediante formulario tienen BCrypt de coste 12. Se omiten valores sensibles. |
| Estado de la prueba | APROBADO |
| Identificador de la evidencia | EV-032 |
| Observaciones | Automatizada técnica de PostgreSQL Validación de usuario final pendiente. |

### CP-033 HTTPS obligatorio

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-033 |
| Nombre del caso | HTTPS obligatorio |
| ID del requisito asociado | Requerimientos No Funcionales, numeral 2 (sin ID en la fuente) |
| ID del criterio de aceptación | CA-033 |
| Caso de uso asociado | Sin caso de uso UML propio; asociado a RF02 |
| Módulo evaluado | Despliegue |
| Actor o rol | Desarrollador |
| Objetivo de la prueba | Verificar hTTPS obligatorio. |
| Prioridad | Alta |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | Host de preproducción por diligenciar, HTTP y HTTPS |
| Pasos numerados | 1. Abrir ambos esquemas sin credenciales<br>2. Verificar que HTTP no entregue formularios y que HTTPS tenga certificado válido<br>3. Confirmar atributo Secure en sesión de producción |
| Resultado esperado | Toda vista y sesión operan bajo TLS, y HTTP redirige o se rechaza antes de recibir datos. |
| Resultado obtenido | Pendiente de ejecución y soporte específico. |
| Estado de la prueba | NO EJECUTADO |
| Identificador de la evidencia | EV-033 |
| Observaciones | Pendiente de ejecución. Validación de usuario final pendiente. |

### CP-034 Validación de entrada y CSRF

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-034 |
| Nombre del caso | Validación de entrada y CSRF |
| ID del requisito asociado | Requerimientos No Funcionales, numeral 3 (sin ID en la fuente) |
| ID del criterio de aceptación | CA-034 |
| Caso de uso asociado | Sin caso de uso UML propio; asociado a RF02 y RF04 |
| Módulo evaluado | Middleware y servicios |
| Actor o rol | Desarrollador |
| Objetivo de la prueba | Verificar validación de entrada y CSRF. |
| Prioridad | Alta |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | Nombre vacío, descripción dato UAT, POST sin token |
| Pasos numerados | 1. Abrir formulario nuevo de servicio<br>2. Enviar nombre obligatorio vacío<br>3. Ejecutar con el cliente QA una solicitud ordinaria sin token<br>4. Comprobar continuidad de sesión |
| Resultado esperado | El servicio inválido se rechaza con 400 y el POST sin token con 403. |
| Resultado obtenido | POST ordinario sin token obtuvo 403. Nombre obligatorio vacío devolvió 400 y la sesión siguió activa. |
| Estado de la prueba | APROBADO |
| Identificador de la evidencia | EV-034 |
| Observaciones | Funcional automatizada HTTP y comprobaciones de integración Validación de usuario final pendiente. |

### CP-035 Revisión defensiva de entradas y salida

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-035 |
| Nombre del caso | Revisión defensiva de entradas y salida |
| ID del requisito asociado | Requerimientos No Funcionales, numeral 3 (sin ID en la fuente) |
| ID del criterio de aceptación | CA-035 |
| Caso de uso asociado | Sin caso de uso UML propio; asociado a RF04 y RF05 |
| Módulo evaluado | Validadores y vistas |
| Actor o rol | Desarrollador |
| Objetivo de la prueba | Verificar revisión defensiva de entradas y salida. |
| Prioridad | Alta |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | Datos ordinarios con comillas y ampersand, errores de validación previamente generados |
| Pasos numerados | 1. Revisar que las escrituras pasan por validadores<br>2. Verificar parámetros enlazados en modelos y salida escapada en EJS<br>3. Guardar un nombre ordinario con ampersand y comprobar representación literal |
| Resultado esperado | Las entradas se validan en servidor, se parametrizan las consultas y el texto se muestra literalmente por la vista. |
| Resultado obtenido | Pendiente de ejecución y soporte específico. |
| Estado de la prueba | NO EJECUTADO |
| Identificador de la evidencia | EV-035 |
| Observaciones | Pendiente de ejecución. Validación de usuario final pendiente. |

### CP-036 Adaptación móvil y escritorio

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-036 |
| Nombre del caso | Adaptación móvil y escritorio |
| ID del requisito asociado | Requerimientos No Funcionales, numeral 4 (sin ID en la fuente) |
| ID del criterio de aceptación | CA-036 |
| Caso de uso asociado | Sin caso de uso UML propio; asociado a RF02, RF05 y RF09 |
| Módulo evaluado | Login, Administración, Portal cliente y Empleado |
| Actor o rol | Evaluador |
| Objetivo de la prueba | Verificar adaptación móvil y escritorio. |
| Prioridad | Media |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | 360×800, 390×844, 768×1024 y 1366×768 |
| Pasos numerados | 1. Repetir inicio de sesión, navegación y solicitud a cada tamaño<br>2. Abrir panel de empleado<br>3. Comprobar desplazamiento, acciones, campos y legibilidad |
| Resultado esperado | Los controles se pueden usar sin recorte ni desplazamiento horizontal de la página. Las tablas con contenedor propio conservan las acciones. |
| Resultado obtenido | Pendiente de ejecución y soporte específico. |
| Estado de la prueba | NO EJECUTADO |
| Identificador de la evidencia | EV-036 |
| Observaciones | Pendiente de ejecución. Validación de usuario final pendiente. |

### CP-037 Facilidad de uso en campo

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-037 |
| Nombre del caso | Facilidad de uso en campo |
| ID del requisito asociado | Requerimientos No Funcionales, numeral 5 (sin ID en la fuente) |
| ID del criterio de aceptación | CA-037 |
| Caso de uso asociado | Sin caso de uso UML propio; asociado a RF09 y RF10 |
| Módulo evaluado | Panel empleado |
| Actor o rol | Empleado y diseñador |
| Objetivo de la prueba | Verificar facilidad de uso en campo. |
| Prioridad | Media |
| Precondiciones | Versión QA que disponga del módulo o dependencia y los registros indicados. |
| Datos de prueba concretos | Tres evaluadores previstos, labor UAT-A, nota Lote norte revisado |
| Pasos numerados | 1. Pedir a cada evaluador que encuentre una labor, identifique la ubicación y actualice el estado sin ayuda<br>2. Registrar tiempo, errores y percepción |
| Resultado esperado | Cada evaluador completa las tres tareas sin asistencia. DOVI ratifica este criterio operativo antes de la sesión. |
| Resultado obtenido | La funcionalidad o dependencia de campo requerida no está disponible en esta versión. |
| Estado de la prueba | BLOQUEADO |
| Identificador de la evidencia | EV-037 |
| Observaciones | Inspección documental o de código, sin ejecución funcional. Validación de usuario final pendiente. |

### CP-038 Tiempo de lectura de solicitudes

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-038 |
| Nombre del caso | Tiempo de lectura de solicitudes |
| ID del requisito asociado | Requerimientos No Funcionales, numeral 6 (sin ID en la fuente) |
| ID del criterio de aceptación | CA-038 |
| Caso de uso asociado | Sin caso de uso UML propio; asociado a RF11 |
| Módulo evaluado | Portal cliente |
| Actor o rol | Desarrollador |
| Objetivo de la prueba | Verificar tiempo de lectura de solicitudes. |
| Prioridad | Media |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | Diez GET de /cliente/solicitudes con cuenta cliente y datos UAT |
| Pasos numerados | 1. Confirmar respuesta 200<br>2. Ejecutar diez lecturas consecutivas con Node y medir de inicio a fin de respuesta<br>3. Registrar máximo y perfil |
| Resultado esperado | Cada lectura estándar es menor o igual a 2.000 ms bajo el perfil registrado. |
| Resultado obtenido | Diez lecturas locales de solicitudes HTTP 200. Latencias en ms: 8, 8, 7, 8, 8, 7, 8, 7, 8, 7. |
| Estado de la prueba | APROBADO |
| Identificador de la evidencia | EV-038 |
| Observaciones | Funcional automatizada HTTP y comprobaciones de integración Validación de usuario final pendiente. |

### CP-039 Tiempo de lectura de labores

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-039 |
| Nombre del caso | Tiempo de lectura de labores |
| ID del requisito asociado | Requerimientos No Funcionales, numeral 6 (sin ID en la fuente) |
| ID del criterio de aceptación | CA-039 |
| Caso de uso asociado | Sin caso de uso UML propio; asociado a RF09 |
| Módulo evaluado | Panel empleado |
| Actor o rol | Desarrollador |
| Objetivo de la prueba | Verificar tiempo de lectura de labores. |
| Prioridad | Media |
| Precondiciones | Versión QA que disponga del módulo o dependencia y los registros indicados. |
| Datos de prueba concretos | Diez consultas autenticadas de labores, una labor UAT asignada |
| Pasos numerados | 1. Abrir el listado de labores<br>2. Medir diez lecturas con el perfil normal acordado<br>3. Registrar estados y latencias |
| Resultado esperado | Todas las lecturas de labores son HTTP 200 y no exceden 2.000 ms. |
| Resultado obtenido | La funcionalidad o dependencia de campo requerida no está disponible en esta versión. |
| Estado de la prueba | BLOQUEADO |
| Identificador de la evidencia | EV-039 |
| Observaciones | Inspección documental o de código, sin ejecución funcional. Validación de usuario final pendiente. |

### CP-040 Carga con conexión rural

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-040 |
| Nombre del caso | Carga con conexión rural |
| ID del requisito asociado | Requerimientos No Funcionales, numeral 7 (sin ID en la fuente) |
| ID del criterio de aceptación | CA-040 |
| Caso de uso asociado | Sin caso de uso UML propio; asociado a RF09 |
| Módulo evaluado | Panel empleado |
| Actor o rol | Diseñador y empleado |
| Objetivo de la prueba | Verificar carga con conexión rural. |
| Prioridad | Media |
| Precondiciones | Versión QA que disponga del módulo o dependencia y los registros indicados. |
| Datos de prueba concretos | Perfiles 3G rural y 4G rural, labor UAT-A, tres cargas en frío por perfil |
| Pasos numerados | 1. Acordar límites y publicar ancho de banda y latencia de cada perfil<br>2. Limpiar caché y cargar la vista tres veces por perfil<br>3. Registrar tiempos, volumen y posibilidad de uso |
| Resultado esperado | La vista cumple el presupuesto acordado con DOVI en ambos perfiles y permite abrir la labor. Umbral por diligenciar. |
| Resultado obtenido | La funcionalidad o dependencia de campo requerida no está disponible en esta versión. |
| Estado de la prueba | BLOQUEADO |
| Identificador de la evidencia | EV-040 |
| Observaciones | Inspección documental o de código, sin ejecución funcional. Validación de usuario final pendiente. |

### CP-041 Separación modular

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-041 |
| Nombre del caso | Separación modular |
| ID del requisito asociado | Requerimientos No Funcionales, numeral 8 (sin ID en la fuente) |
| ID del criterio de aceptación | CA-041 |
| Caso de uso asociado | Sin caso de uso UML propio |
| Módulo evaluado | Arquitectura |
| Actor o rol | Desarrollador |
| Objetivo de la prueba | Verificar separación modular. |
| Prioridad | Media |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | Flujo POST /cliente/solicitudes |
| Pasos numerados | 1. Rastrear ruta, guardas, controlador, modelo, SQL y vista<br>2. Repetir con catálogo<br>3. Registrar responsabilidades por capa |
| Resultado esperado | Las rutas coordinan, los modelos consultan datos y las vistas presentan resultados sin acceso directo a PostgreSQL. |
| Resultado obtenido | Pendiente de ejecución y soporte específico. |
| Estado de la prueba | NO EJECUTADO |
| Identificador de la evidencia | EV-041 |
| Observaciones | Pendiente de ejecución. Validación de usuario final pendiente. |

### CP-042 Convenciones y reutilización

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-042 |
| Nombre del caso | Convenciones y reutilización |
| ID del requisito asociado | Requerimientos No Funcionales, numeral 9 (sin ID en la fuente) |
| ID del criterio de aceptación | CA-042 |
| Caso de uso asociado | Sin caso de uso UML propio |
| Módulo evaluado | Código fuente |
| Actor o rol | Desarrollador |
| Objetivo de la prueba | Verificar convenciones y reutilización. |
| Prioridad | Media |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | Controladores de servicios, clientes, predios y usuarios |
| Pasos numerados | 1. Acordar convención y revisar nombres y formato<br>2. Comparar validación, manejo de duplicados y credenciales<br>3. Registrar duplicación relevante |
| Resultado esperado | Se documentan criterios homogéneos y la lógica repetida que debe centralizarse según DRY. |
| Resultado obtenido | Pendiente de ejecución y soporte específico. |
| Estado de la prueba | NO EJECUTADO |
| Identificador de la evidencia | EV-042 |
| Observaciones | Pendiente de ejecución. Validación de usuario final pendiente. Incidencias INC-013. |

### CP-043 Integridad referencial del predio

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-043 |
| Nombre del caso | Integridad referencial del predio |
| ID del requisito asociado | Requerimientos No Funcionales, numeral 10 (sin ID en la fuente) |
| ID del criterio de aceptación | CA-043 |
| Caso de uso asociado | Sin caso de uso UML propio; asociado a RF03 y RF05 |
| Módulo evaluado | PostgreSQL |
| Actor o rol | Desarrollador |
| Objetivo de la prueba | Verificar integridad referencial del predio. |
| Prioridad | Media |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | cliente@dovi.test, Finca Reserva, Siembra, D+7 |
| Pasos numerados | 1. En una transacción de QA intentar alta con cliente y finca de distinto propietario<br>2. Registrar SQLSTATE<br>3. Revertir la transacción |
| Resultado esperado | La FK compuesta rechaza la pareja con SQLSTATE 23503. |
| Resultado obtenido | PostgreSQL rechazó una pareja cliente/predio ajena por FK, SQLSTATE 23503. Transacción revertida. |
| Estado de la prueba | APROBADO |
| Identificador de la evidencia | EV-043 |
| Observaciones | Automatizada técnica de PostgreSQL Validación de usuario final pendiente. |

### CP-044 Revisar tercera forma normal

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-044 |
| Nombre del caso | Revisar tercera forma normal |
| ID del requisito asociado | Requerimientos No Funcionales, numeral 10 (sin ID en la fuente) |
| ID del criterio de aceptación | CA-044 |
| Caso de uso asociado | Sin caso de uso UML propio |
| Módulo evaluado | PostgreSQL |
| Actor o rol | Desarrollador |
| Objetivo de la prueba | Verificar revisar tercera forma normal. |
| Prioridad | Media |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | usuarios, fincas, servicios, solicitudes, labores y labor_empleado |
| Pasos numerados | 1. Enumerar claves candidatas y dependencias funcionales<br>2. Buscar dependencias parciales y transitivas<br>3. Confirmar el esquema con el analista |
| Resultado esperado | Las tablas funcionales cumplen 3FN para las dependencias de negocio ratificadas y las claves protegen las relaciones. |
| Resultado obtenido | Pendiente de ejecución y soporte específico. |
| Estado de la prueba | NO EJECUTADO |
| Identificador de la evidencia | EV-044 |
| Observaciones | Pendiente de ejecución. Validación de usuario final pendiente. |

### CP-045 Extensión modular futura

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-045 |
| Nombre del caso | Extensión modular futura |
| ID del requisito asociado | Requerimientos No Funcionales, numeral 11 (sin ID en la fuente) |
| ID del criterio de aceptación | CA-045 |
| Caso de uso asociado | Sin caso de uso UML propio |
| Módulo evaluado | Arquitectura |
| Actor o rol | Analista y desarrollador |
| Objetivo de la prueba | Verificar extensión modular futura. |
| Prioridad | Media |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | Módulo hipotético de inventario o facturación, sin desarrollo en este UAT |
| Pasos numerados | 1. Trazar puntos de registro de rutas, permisos, modelos y vistas<br>2. Describir cambios mínimos de integración<br>3. Revisar dependencias con el equipo |
| Resultado esperado | El diseño permite incorporar el módulo en componentes separados con cambios acotados de integración. |
| Resultado obtenido | Pendiente de ejecución y soporte específico. |
| Estado de la prueba | NO EJECUTADO |
| Identificador de la evidencia | EV-045 |
| Observaciones | Pendiente de ejecución. Validación de usuario final pendiente. |

### CP-046 Compatibilidad de navegadores

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-046 |
| Nombre del caso | Compatibilidad de navegadores |
| ID del requisito asociado | Requerimientos No Funcionales, numeral 12 (sin ID en la fuente) |
| ID del criterio de aceptación | CA-046 |
| Caso de uso asociado | Sin caso de uso UML propio; asociado a RF02 a RF06 |
| Módulo evaluado | Interfaz |
| Actor o rol | Evaluador |
| Objetivo de la prueba | Verificar compatibilidad de navegadores. |
| Prioridad | Media |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | Chrome, Firefox, Safari y Edge; versiones por registrar |
| Pasos numerados | 1. En cada navegador ejecutar acceso, catálogo, alta de solicitud y cierre de sesión<br>2. Anotar versión y dispositivo<br>3. Registrar diferencias visuales y de comportamiento |
| Resultado esperado | El flujo termina en los cuatro navegadores sin bloqueos ni pérdida de datos. |
| Resultado obtenido | Pendiente de ejecución y soporte específico. |
| Estado de la prueba | NO EJECUTADO |
| Identificador de la evidencia | EV-046 |
| Observaciones | Pendiente de ejecución. Validación de usuario final pendiente. |

### CP-047 Identidad corporativa

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-047 |
| Nombre del caso | Identidad corporativa |
| ID del requisito asociado | Requerimientos No Funcionales, numeral 13 (sin ID en la fuente) |
| ID del criterio de aceptación | CA-047 |
| Caso de uso asociado | Sin caso de uso UML propio |
| Módulo evaluado | Login, administrador y cliente |
| Actor o rol | Diseñador y representante DOVI |
| Objetivo de la prueba | Verificar identidad corporativa. |
| Prioridad | Media |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | Logo y paleta autorizados por DOVI; figuras 63 a 65 |
| Pasos numerados | 1. Abrir las tres interfaces<br>2. Comparar logo, nombre y paleta con los recursos autorizados<br>3. Registrar aprobación visual |
| Resultado esperado | Las tres interfaces presentan la identidad ratificada por DOVI. |
| Resultado obtenido | Pendiente de ejecución y soporte específico. |
| Estado de la prueba | NO EJECUTADO |
| Identificador de la evidencia | EV-047 |
| Observaciones | Pendiente de ejecución. Validación de usuario final pendiente. |

### CP-048 Confidencialidad de solicitudes

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-048 |
| Nombre del caso | Confidencialidad de solicitudes |
| ID del requisito asociado | Requerimientos No Funcionales, numeral 14 (sin ID en la fuente) |
| ID del criterio de aceptación | CA-048 |
| Caso de uso asociado | Sin caso de uso UML propio; asociado a RF02, RF05 y RF11 |
| Módulo evaluado | Portal cliente |
| Actor o rol | Cliente y cliente alterno |
| Objetivo de la prueba | Verificar confidencialidad de solicitudes. |
| Prioridad | Alta |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | cliente@dovi.test, otro@dovi.test, Finca Horizonte y tres solicitudes UAT |
| Pasos numerados | 1. Iniciar dos sesiones independientes<br>2. Crear las solicitudes con el propietario<br>3. Comparar Mis solicitudes en ambas cuentas |
| Resultado esperado | El propietario ve sus registros y la cuenta alterna no recibe registros ni detalles ajenos. |
| Resultado obtenido | Tres solicitudes pendientes persistieron. El cliente propio las consulta y la segunda cuenta no las recibe. |
| Estado de la prueba | APROBADO |
| Identificador de la evidencia | EV-048 |
| Observaciones | Funcional automatizada HTTP y comprobaciones de integración Validación de usuario final pendiente. |

### CP-049 Confidencialidad en las labores

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-049 |
| Nombre del caso | Confidencialidad en las labores |
| ID del requisito asociado | Requerimientos No Funcionales, numeral 14 (sin ID en la fuente) |
| ID del criterio de aceptación | CA-049 |
| Caso de uso asociado | Sin caso de uso UML propio; asociado a RF09 y RF10 |
| Módulo evaluado | Panel empleado y supervisor |
| Actor o rol | Empleado y supervisor |
| Objetivo de la prueba | Verificar confidencialidad en las labores. |
| Prioridad | Alta |
| Precondiciones | Versión QA que disponga del módulo o dependencia y los registros indicados. |
| Datos de prueba concretos | Personal UAT, Apoyo UAT y dos labores de equipos distintos |
| Pasos numerados | 1. Abrir ambas sesiones<br>2. Consultar las listas y perfiles disponibles<br>3. Comparar alcance por pertenencia a cada equipo |
| Resultado esperado | Cada empleado ve lo asignado y cada supervisor solo puede consultar o anotar perfiles bajo su mando. |
| Resultado obtenido | La funcionalidad o dependencia de campo requerida no está disponible en esta versión. |
| Estado de la prueba | BLOQUEADO |
| Identificador de la evidencia | EV-049 |
| Observaciones | Inspección documental o de código, sin ejecución funcional. Validación de usuario final pendiente. |

### CP-050 Registro de fallos del servidor

| Campo | Detalle |
| --- | --- |
| ID del caso de prueba | CP-050 |
| Nombre del caso | Registro de fallos del servidor |
| ID del requisito asociado | Requerimientos No Funcionales, numeral 15 (sin ID en la fuente) |
| ID del criterio de aceptación | CA-050 |
| Caso de uso asociado | Sin caso de uso UML propio |
| Módulo evaluado | Backend |
| Actor o rol | Desarrollador |
| Objetivo de la prueba | Verificar registro de fallos del servidor. |
| Prioridad | Media |
| Precondiciones | Instancia QA y datos sintéticos indicados. Iniciar sesión con el rol del caso cuando corresponda. |
| Datos de prueba concretos | Incidente inducido en una instancia QA desechable y hora registrada |
| Pasos numerados | 1. Cerrar el pool en una instancia desechable de QA para simular indisponibilidad<br>2. Solicitar /salud y revisar el registro<br>3. Reiniciar la instancia QA y conservar un extracto depurado |
| Resultado esperado | Se registra el fallo con datos suficientes para identificar momento y operación sin divulgar secretos. |
| Resultado obtenido | Ante indisponibilidad controlada de PostgreSQL, /salud devolvió HTTP 500 y la consola registró el error sin ruta de operación ni contexto de correlación. |
| Estado de la prueba | NO APROBADO |
| Identificador de la evidencia | EV-050 |
| Observaciones | Funcional automatizada HTTP y comprobaciones de integración. Validación de usuario final pendiente. Incidencias INC-012. |

## 12. Ejecución y resultados

El diseño cubre los 30 requisitos de la referencia en 50 casos. Se ejecutaron 24, con 18 aprobados y 6 no aprobados. Quedaron 9 sin ejecutar y 17 bloqueados. Ejecución 48,00 % y aprobación técnica sobre ejecutados 75,00 %.

| Estado | Regla |
| --- | --- |
| APROBADO | Resultado ejecutado coincide con el esperado. |
| NO APROBADO | Resultado ejecutado difiere del esperado. |
| NO EJECUTADO | No se realizó la ejecución del caso. |
| BLOQUEADO | Una dependencia funcional o documental impide ejecutar el caso. |

La inspección sustenta la clasificación de código y las brechas. Las pruebas funcionales disponibles se ejecutaron por HTTP contra la aplicación real. El hash y la restricción referencial se comprobaron con automatización técnica. La validación de DOVI queda pendiente aunque un caso tenga resultado técnico aprobado.

## 13. Indicadores de calidad

| Indicador | Valor | Fórmula |
| --- | --- | --- |
| Total de requisitos | 30 | 15 funcionales + 15 no funcionales. |
| Requisitos cubiertos | 30 | Requisitos únicos con un criterio y un caso como mínimo. |
| Cobertura de requisitos | 100,00 % | Cubiertos ÷ total × 100. |
| Requisitos con alguna prueba ejecutada | 16 | Requisitos únicos con al menos un caso ejecutado. |
| Total de casos | 50 | Número de IDs CP únicos. |
| Casos ejecutados | 24 | Aprobados + no aprobados. |
| APROBADO | 18 | Conteo por estado del registro consolidado. |
| NO APROBADO | 6 | Conteo por estado del registro consolidado. |
| NO EJECUTADO | 9 | Conteo por estado del registro consolidado. |
| BLOQUEADO | 17 | Conteo por estado del registro consolidado. |
| Porcentaje de ejecución | 48,00 % | Ejecutados ÷ total de casos × 100. |
| Aprobación sobre ejecutados | 75,00 % | Aprobados ÷ ejecutados × 100. |

Una prueba parcial de un requisito cuenta como ejecución de ese caso. La cobertura por diseño incluye los casos bloqueados y pendientes.

## 14. Evidencias

El intento de renderizado automatizado en Edge falló en el entorno restringido. Se dispone de un soporte real de pruebas HTTP y PostgreSQL. Las capturas visuales quedan pendientes. La [guía de evidencias](06_GUIA_EVIDENCIAS.md) registra módulo, actor, datos, acciones, momento y archivo por cada EV.

## 15. Registro de incidencias

| Incidencia | Severidad | Hallazgo | Casos vinculados | Base |
| --- | --- | --- | --- | --- |
| INC-001 | Media | Rol fijo en edición de usuarios | CP-002 | Prueba funcional automatizada |
| INC-002 | Media | Reagendamiento se muestra como aprobado | CP-015 | Prueba funcional automatizada |
| INC-003 | Alta | Programación de órdenes ausente | CP-016, CP-017 | Inspección de código o UML |
| INC-004 | Alta | Asignación de cuadrilla ausente | CP-018, CP-019 | Inspección de código o UML |
| INC-005 | Alta | Panel de campo provisional | CP-020 | Prueba funcional automatizada |
| INC-006 | Alta | Cambios de estado y observaciones pendientes | CP-022, CP-023 | Inspección de código o UML |
| INC-007 | Alta | Consulta sin progreso de servicio en tiempo real | CP-024, CP-025 | Inspección de código o UML |
| INC-008 | Alta | Historial de servicios prestados ausente | CP-026 | Inspección de código o UML |
| INC-009 | Alta | Avisos internos ausentes | CP-027, CP-028 | Inspección de código o UML |
| INC-010 | Media | Panel omite servicios activos | CP-029 | Prueba funcional automatizada |
| INC-011 | Alta | Reportes provisionales | CP-030 | Prueba funcional automatizada |
| INC-012 | Media | Registro de auditoría básico | CP-050 | Prueba funcional automatizada |
| INC-013 | Media | Duplicación de lógica de formularios y altas | CP-042 | Inspección de código o UML |
| INC-014 | Media | Discrepancia documental sobre alta de predio | CP-010 | Inspección de código o UML |

Crítica implica bloqueo general o afectación de información esencial. Alta impide una función importante. Media afecta parte de una función o una especificación. Baja se refiere a problemas menores, visuales o de usabilidad. El CSV de incidencias detalla causa, acción y estado.

## 16. Conclusiones

Autenticación, directorio, catálogo y alta de solicitudes son operativos dentro del alcance principal. Se reprodujeron diferencias en actualización del rol, estado al reagendar y servicios activos en el tablero. Reportes y panel de campo son provisionales. Los flujos de órdenes, asignación, estados de labores, supervisión, historial y avisos requieren desarrollo y revalidación.

## 17. Acta de aceptación

### Identificación

| Campo | Registro |
| --- | --- |
| Proyecto | Plataforma Web de Gestión DOVI S.A.S. |
| Empresa | DOVI S.A.S. |
| NIT y sede | ________________ |
| Versión | Git b3d4a2f, equivalente al árbol auditado inicialmente sobre 701e6f3 |
| Fecha técnica | 24 de noviembre de 2026 |
| Fecha y lugar de la reunión | ________________ |
| Representante y cargo | ________________ |
| Objetivo | Decidir si la versión evaluada satisface el alcance acordado mediante revisión de resultados y evidencias. |

### Resultados e incidencias pendientes

El diseño cubre los 30 requisitos de la referencia en 50 casos. Se ejecutaron 24, con 18 aprobados y 6 no aprobados. Quedaron 9 sin ejecutar y 17 bloqueados. Ejecución 48,00 % y aprobación técnica sobre ejecutados 75,00 %.

Se mantienen abiertas las incidencias INC-001 a INC-014. Las de severidad alta afectan programación, asignaciones, panel de campo, cambios de estado de labores, seguimiento, historial, avisos y reportes. Los detalles y las evidencias están en el registro consolidado.

### Conclusión y observaciones del cliente

Se recomienda aplazar la aceptación integral hasta resolver los hallazgos de severidad alta y ejecutar la validación final del cliente en la versión corregida.

Observaciones ____________________________________________________________________

### Compromisos de mejora

| Compromiso propuesto | Responsable | Plazo | Criterio de cierre |
| --- | --- | --- | --- |
| Completar programación, cuadrillas y labores de campo | ________ | ________ | Reejecutar RF07 a RF10. |
| Completar seguimiento, historial, avisos y reportes | ________ | ________ | Reejecutar RF11, RF12, RF13 y RF15. |
| Alinear edición de roles, predios, estado al reagendar y tablero | ________ | ________ | Ratificar decisiones y reejecutar casos vinculados. |
| Ejecutar compatibilidad, desempeño y sesión del cliente | ________ | ________ | Validar evidencias y cerrar acta. |

### Decisión de aceptación

- [ ] Sistema aceptado.
- [ ] Sistema aceptado con observaciones.
- [ ] Sistema no aceptado.

Condiciones y fecha de revisión ______________________________________________________

### Firmas

| Participante | Nombre | Cargo | Firma y fecha |
| --- | --- | --- | --- |
| Representante de DOVI S.A.S. | ________ | ________ | ________ |
| Analista | ________ | Analista | ________ |
| Diseñador | ________ | Diseñador | ________ |
| Desarrollador | ________ | Desarrollador | ________ |


## 18. Anexos

- [Auditoría del proyecto y contraste UML](01_AUDITORIA_PROYECTO.md)
- [Matriz detallada con texto original](03_MATRIZ_TRAZABILIDAD.csv)
- [Registro consolidado de casos](04_RESULTADOS_PRUEBAS.csv)
- [Registro de incidencias](05_REGISTRO_INCIDENCIAS.csv)
- [Guía y registro de evidencias](06_GUIA_EVIDENCIAS.md)
- [Acta editable](07_ACTA_ACEPTACION.md)
- [Autoevaluación provisional](08_EVALUACION_RUBRICA.md)
- [Soporte automatizado real](evidencias/ejecucion-http.json)

Para trasladar a Word, aplicar estilos de título e insertar la tabla de contenido de Word. Ajustar a orientación horizontal las matrices anchas. El Word de Ingeniería del Software se ubica en la carpeta superior del proyecto.
