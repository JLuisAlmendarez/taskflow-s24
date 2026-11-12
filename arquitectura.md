# Arquitectura de TaskFlow

Este documento explica para qué sirve cada componente y cómo colaboran entre sí.

## Idea principal

TaskFlow está organizado por capas. Una capa agrupa archivos con una responsabilidad similar. Separar responsabilidades evita que un solo archivo reciba solicitudes, valide datos, aplique reglas y consulte la base de datos al mismo tiempo.

```text
Cliente
  |
  v
Rutas -> Middlewares -> Controladores -> Casos de uso -> Repositorios -> MongoDB
                            |
                            v
                        Respuesta HTTP
```

## Archivos de inicio

### `src/server.js`

Es el punto de entrada del programa. Realiza tres acciones en orden:

1. Conecta la aplicación con MongoDB.
2. Crea los roles iniciales si todavía no existen.
3. Inicia el servidor HTTP en el puerto configurado.

Si la conexión falla, el servidor no inicia y muestra un mensaje de error.

### `src/app.js`

Crea y configura la aplicación Express. Registra:

- `helmet`, que agrega encabezados HTTP de seguridad.
- `cors`, que controla qué origen puede consumir la API desde un navegador.
- `morgan`, que muestra cada solicitud en la consola.
- `express.json()`, que convierte cuerpos JSON en objetos de JavaScript.
- archivos públicos, rutas de la API, respuesta `404` y manejador de errores.

`app.js` configura la aplicación, pero no abre el puerto. Esta separación permite probar Express sin iniciar un servidor real.

## Rutas: `src/routes/`

Las rutas son la puerta de entrada a la API. Indican qué controlador debe ejecutarse para cada combinación de método HTTP y URL.

- `tarea.rutas.js`: registra las operaciones para listar, consultar, crear, actualizar y eliminar tareas.
- `autenticacion.rutas.js`: registra las operaciones de registro, inicio y cierre de sesión.

Las rutas no contienen reglas del negocio ni consultas directas a MongoDB.

## Middlewares: `src/middlewares/`

Un middleware se ejecuta durante el recorrido de una solicitud. Puede revisar datos, detener la solicitud o pasar el control al siguiente componente.

- `autenticacion.validador.js`: define reglas para correo, contraseña y datos de registro.
- `tarea.validador.js`: contiene validaciones HTTP relacionadas con tareas.
- `validar.solicitud.js`: reúne los errores producidos por `express-validator` y responde cuando la entrada no es válida.
- `manejador.errores.js`: convierte errores de la aplicación o Mongoose en respuestas HTTP consistentes.

## Controladores: `src/controllers/`

Los controladores adaptan HTTP al resto de la aplicación:

1. Leen parámetros, consultas o cuerpo de la solicitud.
2. Llaman al caso de uso correspondiente.
3. Devuelven datos y código de estado HTTP.
4. Envían errores al manejador central.

- `tarea.controlador.js`: atiende las cinco operaciones principales de tareas.
- `autenticacion.controlador.js`: atiende registro, inicio y cierre de sesión.

El controlador sabe de HTTP, pero no sabe cómo se guarda un documento en MongoDB.

## Casos de uso: `src/useCases/`

Los casos de uso representan acciones que el sistema permite realizar. Cada archivo expone una función `ejecutar`.

### Tareas: `src/useCases/tasks/`

- `listar-tareas.caso-uso.js`: obtiene tareas y aplica filtros permitidos.
- `obtener-tarea-por-id.caso-uso.js`: busca una tarea concreta.
- `crear-tarea.caso-uso.js`: valida y crea una tarea.
- `actualizar-tarea.caso-uso.js`: valida y modifica una tarea existente.
- `eliminar-tarea.caso-uso.js`: elimina una tarea existente.
- `tarea.validaciones.js`: comparte reglas del negocio entre casos de uso.

### Autenticación: `src/useCases/auth/`

- `registrar-usuario.caso-uso.js`: comprueba duplicados, busca el rol inicial y crea el usuario.
- `iniciar-sesion.caso-uso.js`: compara las credenciales recibidas con el usuario guardado.
- `cerrar-sesion.caso-uso.js`: devuelve el resultado educativo del cierre de sesión.

## Repositorios: `src/repositories/`

Los repositorios aíslan el acceso a los datos. Los casos de uso piden operaciones como “buscar por id” o “crear”; no necesitan conocer los métodos específicos de Mongoose.

- `tarea.repositorio.js`: ejecuta operaciones CRUD sobre tareas.
- `usuario.repositorio.js`: busca usuarios por correo y crea usuarios.
- `rol.repositorio.js`: busca los roles usados durante el registro.

También convierten documentos de Mongoose en objetos sencillos para el resto de la aplicación.

## Entidades: `src/entities/`

Las entidades son esquemas de Mongoose. Definen campos, tipos, valores predeterminados y restricciones antes de guardar documentos.

- `tarea.entidad.js`: título, descripción, estado, prioridad y propietario de una tarea.
- `usuario.entidad.js`: nombre, correo, contraseña, rol y estado del usuario.
- `rol.entidad.js`: nombre, descripción y estado de un rol.

## Configuración, datos iniciales y utilidades

### `src/config/database.js`

Lee `MONGO_DB_URI` y abre la conexión con MongoDB mediante Mongoose.

### `src/seeds/roles.seed.js`

Crea los roles `Administrador` y `Cliente` al iniciar la aplicación. Usa una operación idempotente: puede ejecutarse varias veces sin duplicar roles.

### `src/utils/`

- `http.error.js`: representa errores con código HTTP y mensaje.
- `check.id.js`: comprueba identificadores antes de consultar MongoDB.

## Interfaz pública: `public/`

- `public/views/index.html`: página servida en la ruta principal.
- `public/assets/`: JavaScript y demás recursos usados por la página.

Esta interfaz es independiente de las capas de la API y consume sus rutas mediante HTTP.

## Pruebas: `test/`

- Archivos `.http`: permiten enviar solicitudes manuales mientras el servidor está activo.
- `test/unit/`: verifica componentes aislados con Jest.
- `test/unit/helpers/`: contiene herramientas compartidas por las pruebas.

La estructura de pruebas sigue las mismas áreas del código: rutas, controladores, middlewares, casos de uso, repositorios, entidades y datos iniciales.

## Ejemplo: crear una tarea

1. El cliente envía `POST /api/v1/tasks` con datos JSON.
2. `tarea.rutas.js` selecciona el controlador `crear`.
3. `tarea.controlador.js` entrega los datos al caso de uso.
4. `crear-tarea.caso-uso.js` valida la entrada.
5. `tarea.repositorio.js` solicita a Mongoose guardar el documento.
6. MongoDB devuelve la tarea creada.
7. El controlador responde con estado `201` y la tarea en JSON.

## Cómo decidir dónde agregar código

- Nueva URL: `routes`.
- Lectura o respuesta HTTP: `controllers`.
- Regla o acción del sistema: `useCases`.
- Consulta o escritura en MongoDB: `repositories`.
- Campo o restricción de un documento: `entities`.
- Validación previa compartida: `middlewares`.
- Función pequeña reutilizable: `utils`.
