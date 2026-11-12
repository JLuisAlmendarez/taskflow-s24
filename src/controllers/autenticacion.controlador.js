import { ejecutar as registrarUsuario } from '../useCases/auth/registrar-usuario.caso-uso.js';
import { ejecutar as iniciarSesion } from '../useCases/auth/iniciar-sesion.caso-uso.js';
import { ejecutar as cerrarSesion } from '../useCases/auth/cerrar-sesion.caso-uso.js';
export async function registrar(req, res) { res.status(201).json(await registrarUsuario(req.body)); }
export async function iniciar(req, res) { res.json(await iniciarSesion(req.body)); }
export async function cerrar(req, res) { res.json(await cerrarSesion()); }
/**
 * GET /api/v1/auth/me: identidad del usuario autenticado, tomada de req.usuario (nunca del body).
 * @param {import('express').Request} req Solicitud con req.usuario establecido por autenticarJwt.
 * @param {import('express').Response} res Respuesta.
 * @returns {Promise<void>}
 */
export async function me(req, res) {
  // TODO 9: devolver el objeto público req.usuario.
  const { id, nombre, correo, rol, estado } = req.usuario;
  res.json({ id, nombre, correo, rol, estado });
}
