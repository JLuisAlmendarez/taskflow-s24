# TaskFlow S24 · Despliegue en Render

## Antes del despliegue

Completa TODO 1–7 y ejecuta npm run test:core. Con una API local iniciada y BD de práctica, comprueba npm run smoke. Las cuentas de GitHub, Render y Atlas deben estar preparadas antes de clase.

1. Publica en GitHub el contenido de la carpeta con package.json: src/, public/, test/, jest.config.js, arquitectura.md, CONTRATO_API.md, README.md, package-lock.json y .env.example. Excluye .env, node_modules y evidencias con secretos. Un secreto filtrado debe rotarse aunque después se borre del archivo.
2. Render: **New > Web Service**, conecta repositorio y rama. Selecciona **Root Directory** si package.json está en una subcarpeta. Usa Node 24 y revisa el plan y su costo en tu panel.
3. **Build Command:** npm ci. **Start Command:** npm start. **Health Check Path:** /health. Las pruebas Jest se ejecutan localmente antes de subir; no son un requisito del arranque en Render.
4. Environment: **MONGO_DB_URI**, **JWT_SECRET**, **CORS_ORIGIN**, **NODE_ENV=production** y, si lo requiere el selector de runtime, **NODE_VERSION=24**. La variable de conexión se llama MONGO_DB_URI. Genera un JWT_SECRET nuevo para el despliegue. Render proporciona PORT; el servidor escucha en 0.0.0.0.
5. Usa una BD Atlas nueva de práctica, por ejemplo taskflow_s24_bcrypt. Su usuario de BD necesita readWrite sobre esa BD para datos, roles e índices. Autoriza en Atlas Network Access los rangos de **Connect > Outbound** del Web Service. Conserva tu IP local si la necesitas. Evita abrir 0.0.0.0/0 como configuración permanente.
6. El arranque valida entorno, conecta BD, prepara índices únicos de usuarios y roles, ejecuta el seed idempotente y abre el puerto. Ante un fallo no se abre el puerto. Verifica permisos, URI, credenciales escapadas y conectividad si falla.
7. Abre la URL real `https://TU-SERVICIO.onrender.com/`: muestra la página pública y consulta /health. /health debe devolver 200 y status ok.
8. Cambia baseUrl en **test/requests.http** a esa URL. Registra dos cuentas, haz login y prueba /api/v1/tasks y /api/v1/auth/me con Bearer. Comprueba acceso cruzado, registro rechazando rol y logout. La URL mostrada aquí es un ejemplo, no un servicio ya desplegado.
9. Redespliega y comprueba que los roles no se duplican y las tareas permanecen en Atlas. Documenta URL, commit y resultados sin secretos.

## Diagnóstico

| Síntoma | Revisión |
|---|---|
| Falta conexión | Nombre MONGO_DB_URI, BD, credenciales y rangos de salida |
| Seed o índices fallan | Permisos readWrite, datos duplicados y colección roles |
| Build falla con bcrypt | Node compatible, lockfile, instalación nativa y logs del build |
| No abre puerto | start, PORT y host 0.0.0.0; verificar que BD y seed terminaron |
| /api/tasks devuelve 404 | Usar /api/v1/tasks |
| Registro devuelve 400 | Campos nombre/correo/contrasena, mínimo 15 caracteres y máximo 72 bytes |
| Login devuelve 401 con datos anteriores | Registrar cuentas de práctica nuevas; no convertir hashes anteriores |
| Tarea no aparece | Revisar propietario y contrato de campos en español |
| Navegador bloquea respuesta | CORS_ORIGIN exacto: protocolo, host y puerto, sin rutas |
| /health devuelve 503 | Conexión a BD no disponible |
| 429 al probar | Límite por IP y ventana; en una red escolar puede compartirse la IP |

trust proxy=1 se activa al detectar Render; revisarlo al cambiar de infraestructura. El rate limiter usa memoria por proceso. En varias instancias se necesita un store compartido. Los logs Morgan omiten body, query y Authorization.

Fuentes oficiales consultadas el 11 de noviembre de 2026:
- https://render.com/docs/deploy-node-express-app
- https://render.com/docs/configure-environment-variables
- https://render.com/docs/outbound-ip-addresses
- https://www.mongodb.com/docs/atlas/security/ip-access-list/
