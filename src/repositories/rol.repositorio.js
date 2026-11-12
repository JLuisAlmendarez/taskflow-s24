import { Rol } from '../entities/rol.entidad.js';
function aObjeto(doc) { return doc ? { id: String(doc._id), nombre: doc.nombre, estado: doc.estado } : null; }
export async function buscarPorNombre(nombre) { return aObjeto(await Rol.findOne({ nombre })); }
export async function buscarPorId(id) { return aObjeto(await Rol.findById(id)); }
