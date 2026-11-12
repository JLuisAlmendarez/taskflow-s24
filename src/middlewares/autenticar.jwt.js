import mongoose from 'mongoose';
import { verifyToken } from '../utils/token.js';
import * as usuarios from '../repositories/usuario.repositorio.js';
import * as roles from '../repositories/rol.repositorio.js';
/**
 * Responde 401 con un mensaje genérico.
 * @param {import('express').Response} res Respuesta.
 * @returns {import('express').Response}
 */
const noAutorizado = res => res.status(401).json({ mensaje: 'Autenticación requerida o token inválido' });
/**
 * Extrae el token de un encabezado `Authorization: Bearer <token>`.
 * @param {import('express').Request} req Solicitud.
 * @returns {string|null}
 */
function extraerToken(req) {
  const [esquema, token, ...resto] = (req.get('authorization') ?? '').split(' ');
  return esquema === 'Bearer' && token && resto.length === 0 ? token : null;
}
/**
 * Autentica cada solicitud protegida: verifica firma, algoritmo, emisor, audiencia y caducidad del JWT,
 * comprueba sub y exp, y exige que el usuario y su rol sigan activos. Deja el objeto público en req.usuario.
 * Los errores de base de datos pasan al manejador central.
 * @param {import('express').Request} req Solicitud.
 * @param {import('express').Response} res Respuesta.
 * @param {import('express').NextFunction} next Siguiente middleware.
 * @returns {Promise<void>}
 */
export async function autenticarJwt(req, res, next) {
  // TODO 5: verificar identidad antes de continuar. Nunca abrir acceso anónimo.
  const token = extraerToken(req);
  if (!token) return noAutorizado(res);
  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return noAutorizado(res);
  }
  if (!mongoose.isObjectIdOrHexString(payload.sub) || typeof payload.exp !== 'number') return noAutorizado(res);
  try {
    const usuario = await usuarios.buscarPorId(payload.sub);
    if (!usuario?.estado) return noAutorizado(res);
    const rol = await roles.buscarPorId(usuario.rol);
    if (!rol?.estado) return noAutorizado(res);
    req.usuario = usuario;
    next();
  } catch (error) {
    next(error);
  }
}
