import * as usuarios from '../../repositories/usuario.repositorio.js';
import * as roles from '../../repositories/rol.repositorio.js';
import { httpError } from '../../utils/http.error.js';
/** @type {string} Rol que recibe toda cuenta creada por el registro público. */
const ROL_INICIAL = 'Cliente';
/**
 * Registra un usuario con el rol Cliente. El rol se busca en el servidor y el hash
 * lo genera el hook pre('save') de la entidad; este caso de uso no calcula hashes.
 * @param {{nombre: string, correo: string, contrasena: string}} datos Datos validados del registro.
 * @returns {Promise<{id: string, nombre: string, correo: string, rol: string, estado: boolean}>} Usuario público, sin contrasena.
 * @throws {Error} 409 si el correo ya existe; 500 si el rol inicial no está disponible.
 */
export async function ejecutar({ nombre, correo, contrasena }) {
  // TODO 3: completar el caso de uso.
  if (await usuarios.buscarPorCorreo(correo)) throw httpError(409, 'No se pudo registrar con esos datos');
  const rol = await roles.buscarPorNombre(ROL_INICIAL);
  if (!rol?.estado) throw httpError(500, 'Rol inicial no disponible');
  return usuarios.crear({ nombre, correo, contrasena, rol: rol.id });
}
