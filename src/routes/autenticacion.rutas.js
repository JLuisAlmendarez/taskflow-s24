import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import * as controlador from '../controllers/autenticacion.controlador.js';
import { validarRegistro, validarLogin } from '../middlewares/autenticacion.validador.js';
import { autenticarJwt } from '../middlewares/autenticar.jwt.js';
const router = Router();
const limite = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8',
  legacyHeaders: false, message: { mensaje: 'Demasiados intentos. Intenta más tarde.' } });
router.post('/register', limite, validarRegistro, controlador.registrar);
router.post('/login', limite, validarLogin, controlador.iniciar);
router.post('/logout', autenticarJwt, controlador.cerrar);
router.get('/me', autenticarJwt, controlador.me);
export default router;
