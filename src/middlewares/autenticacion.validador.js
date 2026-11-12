import { body } from 'express-validator';
import { limitarCampos, validarSolicitud } from './validar.solicitud.js';
const credenciales = [
  body('correo').isString().bail().trim().isLength({ max: 254 }).isEmail().toLowerCase(),
  body('contrasena').isString().bail().isLength({ min: 15 }).bail()
    .custom(valor => Buffer.byteLength(valor, 'utf8') <= 72)
];
export const validarRegistro = [limitarCampos(['nombre', 'correo', 'contrasena']),
  body('nombre').isString().bail().trim().isLength({ min: 1, max: 80 }), ...credenciales, validarSolicitud];
export const validarLogin = [limitarCampos(['correo', 'contrasena']), ...credenciales, validarSolicitud];
