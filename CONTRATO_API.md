# Contrato API · TaskFlow S24

Se adoptan nombres de archivos y capas del documento arquitectura.md. Para uniformar los ejemplos también se utilizan campos en español. Este contrato debe emplearse en el frontend y REST Client.

| Anterior | Actual |
|---|---|
| /api/tasks | /api/v1/tasks |
| /api/auth/* | /api/v1/auth/* |
| MONGODB_URI | MONGO_DB_URI |
| name / email / password | nombre / correo / contrasena |
| title / description | titulo / descripcion |
| status / priority / ownerId | estado / prioridad / propietario |
| pending / in_progress / done | pendiente / en_progreso / completada |
| low / medium / high | baja / media / alta |
| tasks / users (colecciones) | tareas / usuarios, más roles |

| Método | Ruta | Acceso y resultado |
|---|---|---|
| GET | / | Público; página mínima de la API |
| GET | /health | 200 con BD conectada; 503 sin conexión |
| POST | /api/v1/auth/register | Público validado, rol Cliente; 201 |
| POST | /api/v1/auth/login | Público validado; 200 y JWT |
| POST | /api/v1/auth/logout | JWT válido; 200 con indicación de borrar token |
| GET | /api/v1/auth/me | JWT válido; objeto público del usuario |
| GET / POST | /api/v1/tasks | JWT válido; sólo propias / nueva tarea |
| GET / PATCH / DELETE | /api/v1/tasks/:id | JWT y propietario; 200 / 200 / 204 |

Registro: `{ "nombre": "Ana", "correo": "ana@example.com", "contrasena": "Mi frase larga para TaskFlow 2026" }`.

Crear tarea: `{ "titulo": "Preparar entrega final" }`. Actualizar: `{ "estado": "completada" }`.

La respuesta de login contiene accessToken, tokenType, expiresIn y usuario. usuario contiene id, nombre, correo, rol y estado; nunca contrasena. Los errores contienen mensaje. propietario y rol no se aceptan como privilegios proporcionados por el cliente.

## Datos de versiones anteriores

Esta actualización no migra datos automáticamente. Los hashes previos no se convierten a bcrypt y las colecciones o campos antiguos no se reutilizan silenciosamente. Usar una BD de práctica nueva y registrar cuentas ficticias. Una migración real exigiría un procedimiento separado para usuarios, propietarios, roles y credenciales; no se borran las colecciones anteriores.
