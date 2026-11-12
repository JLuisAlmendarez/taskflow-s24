import { Tarea } from '../entities/tarea.entidad.js';
function aObjeto(doc) {
  if (!doc) return null;
  const value = doc.toObject();
  value.id = String(value._id); value.propietario = String(value.propietario);
  delete value._id; delete value.__v; return value;
}
// TODO 6: consultas con propietario, DTO y validadores.
/**
 * Lista las tareas que cumplen el filtro; el caso de uso siempre incluye propietario.
 * @param {{propietario: string, estado?: string}} filtro Filtro construido en el servidor.
 * @returns {Promise<Object[]>} Tareas como objetos simples, de la más antigua a la más reciente.
 */
export async function listar(filtro) {
  const docs = await Tarea.find(filtro);
  return docs.map(aObjeto).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}
/**
 * Busca una tarea por _id y propietario: una tarea ajena se comporta como inexistente.
 * @param {string} id Id de la tarea.
 * @param {string} propietario Id del usuario autenticado.
 * @returns {Promise<Object|null>}
 */
export async function buscarPorId(id, propietario) { return aObjeto(await Tarea.findOne({ _id: id, propietario })); }
/**
 * Crea una tarea; propietario lo asigna el caso de uso con el id del usuario autenticado.
 * @param {Object} datos Datos validados más propietario.
 * @returns {Promise<Object>}
 */
export async function crear(datos) { return aObjeto(await Tarea.create(datos)); }
/**
 * Actualiza sólo una tarea propia con $set, devuelve el documento final y vuelve a validar el esquema.
 * @param {string} id Id de la tarea.
 * @param {string} propietario Id del usuario autenticado.
 * @param {Object} datos Campos validados.
 * @returns {Promise<Object|null>}
 */
export async function actualizar(id, propietario, datos) {
  return aObjeto(await Tarea.findOneAndUpdate({ _id: id, propietario }, { $set: datos },
    { returnDocument: 'after', runValidators: true }));
}
/**
 * Elimina sólo una tarea propia.
 * @param {string} id Id de la tarea.
 * @param {string} propietario Id del usuario autenticado.
 * @returns {Promise<Object|null>} La tarea eliminada o null.
 */
export async function eliminar(id, propietario) { return aObjeto(await Tarea.findOneAndDelete({ _id: id, propietario })); }
