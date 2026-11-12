import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'node:url';
import tareaRutas from './routes/tarea.rutas.js';
import autenticacionRutas from './routes/autenticacion.rutas.js';
import { manejarErrores } from './middlewares/manejador.errores.js';
const app = express();
if (process.env.RENDER === 'true') app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || false,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
// Log sólo método, ruta sin query ni ids, status y tiempo. Sin body ni Authorization.
morgan.token('ruta-segura', req => req.path.replace(/[a-f0-9]{24}/gi, ':id'));
app.use(morgan(':method :ruta-segura :status :response-time ms', { skip: () => process.env.NODE_ENV === 'test' }));
app.use(express.json({ limit: '20kb' }));
app.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
app.use('/assets', express.static(fileURLToPath(new URL('../public/assets/', import.meta.url))));
app.get('/', (req, res) => res.sendFile(fileURLToPath(new URL('../public/views/index.html', import.meta.url))));
app.get('/health', (req, res) => {
  const listo = mongoose.connection.readyState === 1;
  res.status(listo ? 200 : 503).json({ status: listo ? 'ok' : 'unavailable' });
});
app.use('/api/v1/auth', autenticacionRutas);
app.use('/api/v1/tasks', tareaRutas);
app.use((req, res) => res.status(404).json({ mensaje: 'Ruta no encontrada' }));
app.use(manejarErrores);
export default app;
