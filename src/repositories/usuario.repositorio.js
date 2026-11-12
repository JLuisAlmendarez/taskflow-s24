import { Usuario } from '../entities/usuario.entidad.js';
function aObjeto(doc, credenciales = false) {
  if (!doc) return null;
  const value = doc.toObject();
  const result = { id: String(value._id), nombre: value.nombre, correo: value.correo,
    rol: String(value.rol), estado: value.estado };
  if (credenciales) result.contrasena = value.contrasena; // Sólo para login, nunca para HTTP.
  return result;
}
export async function buscarPorCorreo(correo) { return aObjeto(await Usuario.findOne({ correo })); }
export async function buscarCredenciales(correo) {
  return aObjeto(await Usuario.findOne({ correo }).select('+contrasena'), true);
}
export async function buscarPorId(id) { return aObjeto(await Usuario.findById(id)); }
export async function crear(datos) {
  // Model.create ejecuta pre('save'); el caso de uso no calcula ningún hash.
  return aObjeto(await Usuario.create(datos));
}
