# Auditoría de la Plataforma Web de Gestión DOVI S.A.S.

## 1. Referencia y versión

Fuente principal: *Desarrollo de una plataforma web para la gestión y prestación de servicios agrícolas en la empresa DOVI S.A.S.*, documento Word ubicado en la carpeta superior del proyecto. Se revisaron los apartados «Requerimientos Funcionales», «Requerimientos No Funcionales», «Arquitectura de software» y los diagramas y vistas incrustados. Las figuras de casos de uso identifican RF01 a RF15. El listado de 15 no funcionales carece de identificadores visibles, por lo que se cita cada uno por su orden dentro del apartado. «NF1» a «NF15» son referencias locales de fila, no identificadores atribuidos a la fuente. Los números de imagen corresponden a los nombres de los archivos incrustados en el Word. SHA-256 de la fuente `4265ed4af79848c8a85b010eca0c6ce69ecfe3d92cd02f1e68618cb62a0e3229`.

Versión revisada: árbol de trabajo del 24 de noviembre de 2026, base Git `701e6f3`, más modificaciones locales preexistentes en `db/reset.sql`, `db/schema.sql`, `src/controllers/admin.controller.js`, `src/models/solicitud.model.js`, `src/routes/admin.js`, `src/validators/solicitud.validator.js` y `src/views/pages/admin/solicitud.ejs`. Los siete cambios quedaron incorporados en b3d4a2f durante la revisión. La ejecución final usó ese commit y un esquema creado desde cero.

## 2. Arquitectura, inventario y dependencias

| Área | Piezas revisadas y responsabilidad |
| --- | --- |
| Raíz | `package.json`, `package-lock.json`, `README.md`, `.gitignore` y presencia de configuración local. Los valores de `.env` quedaron fuera de la inspección. |
| Arranque | `src/server.js` carga configuración y abre el servidor. `src/app.js` sirve estáticos, monta EJS, Helmet, middleware global y enrutadores. `GET /salud` realiza una lectura de PostgreSQL. |
| Rutas | `auth.js` monta login, logout y cambio de clave. `admin.js` monta tablero, API de resumen, decisiones sobre solicitudes, clientes, predios, servicios, usuarios y reportes. `paneles.js` monta catálogo, alta y consulta de solicitudes de cliente, y el panel provisional de empleado. |
| Controladores | `auth` verifica identidad y sesión. `admin` coordina tablero y decisiones. `usuarios`, `clientes`, `predios` y `servicios` gestionan sus formularios. `portal-cliente` consulta catálogo, predios y solicitudes propias. |
| Modelos | `usuario`, `cliente`, `finca`, `servicio`, `solicitud` y `dashboard` agrupan acceso SQL. Los modelos escriben mediante parámetros, consultan claves y aplican restricciones relevantes. |
| Configuración y apoyo | `config/` concentra rol, estados, conexión y sesión. `middlewares/` aplica autenticación, vigencia de cuenta, CSRF, mensajes flash y menú administrativo. `validators/` valida autenticación, usuario, cliente, predio, servicio y solicitud. `services/claves.js` genera claves temporales y `utils/entrada.js` normaliza entradas. |
| Vistas y recursos | EJS para autenticación, panel y trámites administrativos, portal de cliente y panel provisional. `public/css/` contiene las hojas de estilos por interfaz. `public/js/` gestiona menú, confirmaciones, formulario de usuarios y actualización del tablero. `public/img/` contiene identidad y fondos. |
| Persistencia | `db/schema.sql` define usuarios, supervisor_empleado, fincas, servicios, solicitudes, solicitud_historial, labores, labor_empleado y session. `db/reset.sql` es de reinicio y quedó fuera de la ejecución. `src/scripts/` contiene semillas para administración, demostración y pruebas. |
| Dependencias resueltas | Node.js v24.21.0 en pruebas, Express 5.3.0, EJS 7.0.2, PostgreSQL 18 local, pg 8.23.1, bcryptjs 3.0.3, express-session 1.19.0, connect-pg-simple 10.0.0, express-validator 7.3.2, express-rate-limit 8.7.3, Helmet 8.3.0, dotenv 18.0.9 y Nodemon 3.1.14 en desarrollo. |

## 3. Identidad, permisos e integridad

- Administrador accede al tablero, API y gestión. Cliente consulta catálogo y solicitudes propias, y solicita para predios propios activos. Empleado y supervisor llegan a `/empleado`; supervisor se representa como empleado con bandera y asociación de subordinados. La supervisión operativa carece de interfaz y controlador.
- La sesión se regenera al autenticar, se almacena en PostgreSQL y se vuelve a validar contra el estado de la cuenta. Cookie HTTP-only, SameSite=Lax, Secure en producción y duración de ocho horas. Las escrituras ordinarias requieren CSRF. Login limita diez fallos por 15 minutos y normaliza el correo. BCrypt de coste 12 se usa al crear y cambiar contraseñas. El cambio inicial puede ser obligatorio.
- El servidor aplica reglas de campos, identificadores, correo, área y fechas. La FK compuesta vincula la solicitud con la finca del mismo cliente. Correo único, índices de nombres sin distinguir mayúsculas y estados con restricciones sostienen la integridad. La resolución de solicitudes bloquea una pendiente y actualiza estado e historial en una sola sentencia. Los atributos de negocio de tablas existentes requieren revisión formal de 3FN.
- El código entrega HTTP local mediante Express. La obligación HTTPS depende del despliegue y del proxy. Helmet y cookie Secure son controles presentes, con TLS de preproducción pendiente de verificar. El registro de errores actual usa consola y mensaje del error, sin un mecanismo de auditoría estructurado identificado.

## 4. Contraste con UML y diseño

| Figuras del Word | Contraste |
| --- | --- |
| 1–15, casos de uso | Se conservan los identificadores originales en la matriz. RF01 fija el rol durante la edición. RF04 y RF05 tienen flujos operativos. RF06 cambia fecha e historial pero persiste Aprobada. RF07–RF10, RF12, RF13 y RF15 carecen de flujos completos. RF11 y RF14 tienen subflujos disponibles. |
| 16–28, secuencias | MVC, validación y persistencia están presentes para autenticación, usuarios, catálogo y solicitudes, con diferencias en rutas físicas como `/login` y el retorno de decisión al detalle. No existen las cadenas operativas para órdenes de trabajo, asignación, notificación, historial consolidado y progreso. |
| 29, objetos | Cliente, finca, servicio y solicitud se corresponden con los objetos del ejemplo. Labor y sus empleados pueden representarse en SQL, pero falta acceso operativo por la plataforma. |
| 30, componentes | Se implementan Express MVC, EJS, CSS, JS y PostgreSQL. El gráfico contempla programación, seguimiento y componentes externos. Correo de notificación y almacenamiento externo de imágenes se registran como diferencias de diseño. El RF13 obliga el aviso interno. |
| 31, clases | El objeto de dominio se traduce en módulos funcionales, no clases JS. Usuarios, fincas, servicios y solicitudes tienen modelo. Las operaciones de campo previstas en las clases Labor y Empleado carecen de un flujo de aplicación. |
| 32, despliegue | Los nodos navegador, aplicación y PostgreSQL se reproducen localmente. HTTPS/TLS, navegadores de destino y logging desplegado quedan sujetos a verificación en preproducción. |
| 33–47, actividades | Los flujos principales de administración de clientes, catálogo, login y solicitud existen. Para RF06 la actividad de reagendar rotula Reagendada. La transición observada es Aprobada; el historial conserva la acción. |
| 48–60, colaboración | Se conserva la colaboración vista–controlador–modelo para operaciones existentes. La figura 59 atribuye alta de finca al cliente, mientras RF03 y su caso de uso la atribuyen al administrador. El servidor monta solo la ruta administrativa. La fila correspondiente queda pendiente de decisión del analista y DOVI sobre cuál especificación rige. |
| 61–62, ER y diccionario | El núcleo relacional coincide. Se agregan bandera de supervisor, clave temporal, nota administrativa, relación de supervisor, historial de decisiones y sesión. El FK compuesto de solicitudes y finca refuerza pertenencia. |
| 63–65, vistas | Se encuentra la identidad DOVI en login, portal y administración. El diseño de cliente muestra progreso y cuadrilla que el portal actual no presenta. El tablero ofrece empleados en campo, como la maqueta, y omite el indicador de servicios activos exigido por RF14. |

## 5. Clasificación funcional

- Implementados en el alcance principal: RF02 autenticación y acceso por rol, RF03 directorio y predios administrados, RF04 catálogo y RF05 solicitud de servicio. RF03 conserva una discrepancia documental por resolver sobre el autoservicio.
- Parciales: RF01 gestión de cuentas y vínculo de supervisor con rol fijo en edición, RF06 revisión y decisiones con divergencia de reagendamiento, RF11 consulta al volver a cargar sin progreso operativo ni actualización automática, y RF14 tablero sin servicios activos.
- Sin flujo operativo: RF07 programación, RF08 asignación, RF09 labores propias y supervisión, RF10 cambios y observaciones operativas, RF12 historial de servicios prestados, RF13 notificaciones internas y RF15 reportes por fechas. La presencia de tablas o vistas provisionales se consigna como avance técnico.
- Complementos sin requisito autónomo en la referencia: cambio inicial y restablecimiento administrativo de claves, gestión del estado de predios, comprobación de salud, historial de decisiones y contador de empleados en campo. La asignación de supervisores sí aparece en RF01. Facturación e inventario figuran como ejemplos de extensibilidad futura.

## 6. Trazabilidad y límites

La matriz incluye el texto original y un caso por cada criterio. La columna Estado de implementación procede de inspección y contraste. Los estados de ejecución provienen del registro de pruebas. Los no funcionales sin umbral de la fuente conservan la referencia original y explicitan los parámetros que DOVI debe acordar. La revisión no certifica una instalación desplegada, una migración de una base previa, cobertura integral OWASP ni la aceptación del usuario final.

## 7. Estado por requisito no funcional

| Referencia en el Word | Estado | Base del hallazgo |
| --- | --- | --- |
| Numeral 1 (sin ID original) | Implementado | bcryptjs en controladores de autenticación, clientes y usuarios. |
| Numeral 2 (sin ID original) | Parcial | src/server.js abre HTTP. src/config/session.js requiere cookie segura en producción. TLS externo pendiente. |
| Numeral 3 (sin ID original) | Parcial | Validadores, CSRF, SQL parametrizado y EJS. Cobertura integral de riesgos pendiente. |
| Numeral 4 (sin ID original) | Parcial | CSS y viewport en vistas operativas. Panel de campo provisional y verificación visual pendiente. |
| Numeral 5 (sin ID original) | No implementado | Panel empleado provisional. |
| Numeral 6 (sin ID original) | Parcial | Lecturas locales de solicitudes verificadas. Lectura de labores ausente y perfil real pendiente. |
| Numeral 7 (sin ID original) | No implementado | Sin interfaz funcional de labores que medir. |
| Numeral 8 (sin ID original) | Implementado | Capas MVC, estáticos y acceso SQL a través de modelos. |
| Numeral 9 (sin ID original) | Parcial | Estructura homogénea con repetición de manejo de credenciales y errores entre controladores. |
| Numeral 10 (sin ID original) | Parcial | PK, FK y tablas de unión observadas. Verificación formal de 3FN pendiente. |
| Numeral 11 (sin ID original) | Parcial | Enrutadores y módulos separados. Extensibilidad sin reescritura pendiente de demostración. |
| Numeral 12 (sin ID original) | Parcial | HTML y CSS web. Compatibilidad en cuatro navegadores pendiente. |
| Numeral 13 (sin ID original) | Parcial | Logo, nombre y colores observables. Paleta oficial por ratificar con DOVI. |
| Numeral 14 (sin ID original) | Parcial | Permisos y filtrado para solicitudes en uso. Ámbito de labores y supervisión pendiente. |
| Numeral 15 (sin ID original) | Parcial | Consola de errores en src/app.js. Auditoría estructurada pendiente. |

