import bcrypt from 'bcrypt';
import * as usuarios from '../../repositories/usuario.repositorio.js';
import * as roles from '../../repositories/rol.repositorio.js';
import { signToken } from '../../utils/token.js';
import { httpError } from '../../utils/http.error.js';
/** @type {number} Vigencia del accessToken en segundos (15 minutos, igual que signToken). */
const EXPIRA_EN = 15 * 60;
/** @type {Promise<string>|undefined} Hash de referencia para comparar cuando el correo no existe. */
let hashReferencia;
/**
 * Devuelve un hash bcrypt fijo para que un correo inexistente tarde lo mismo que una contraseña incorrecta.
 * @returns {Promise<string>}
 */
function obtenerHashReferencia() {
  hashReferencia ??= bcrypt.hash('referencia-sin-cuenta-taskflow', 12);
  return hashReferencia;
}
/**
 * Inicia sesión: compara la contraseña con bcrypt.compare, exige usuario y rol activos
 * y firma un JWT de 15 minutos. Cualquier fallo de credenciales responde el mismo 401.
 * @param {{correo: string, contrasena: string}} credenciales Credenciales validadas.
 * @returns {Promise<{accessToken: string, tokenType: string, expiresIn: number, usuario: Object}>}
 * @throws {Error} 401 con credenciales incorrectas, usuario inactivo o rol inactivo.
 */
export async function ejecutar({ correo, contrasena }) {
  // TODO 4: completar el caso de uso.
  const usuario = await usuarios.buscarCredenciales(correo);
  const coincide = await bcrypt.compare(contrasena, usuario?.contrasena ?? await obtenerHashReferencia());
  if (!usuario || !coincide || !usuario.estado) throw httpError(401, 'Credenciales inválidas');
  const rol = await roles.buscarPorId(usuario.rol);
  if (!rol?.estado) throw httpError(401, 'Credenciales inválidas');
  const { contrasena: _hash, ...publico } = usuario;
  return { accessToken: signToken(usuario.id), tokenType: 'Bearer', expiresIn: EXPIRA_EN, usuario: publico };
}
