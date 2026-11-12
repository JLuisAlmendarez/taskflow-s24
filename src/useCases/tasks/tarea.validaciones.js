import { httpError } from '../../utils/http.error.js';
const campos = ['titulo', 'descripcion', 'estado', 'prioridad'];
export function validarDatos(body, parcial = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw httpError(400, 'Se requiere objeto JSON');
  const keys = Object.keys(body);
  if (keys.some(key => !campos.includes(key))) throw httpError(400, 'Campo no permitido');
  if (keys.some(key => typeof body[key] !== 'string')) throw httpError(400, 'Los campos deben ser texto');
  if (parcial && !keys.length) throw httpError(400, 'Actualización vacía');
  if (!parcial && !body.titulo?.trim()) throw httpError(400, 'Título requerido');
  if (body.estado !== undefined && !['pendiente', 'en_progreso', 'completada'].includes(body.estado)) throw httpError(400, 'Estado inválido');
  if (body.prioridad !== undefined && !['baja', 'media', 'alta'].includes(body.prioridad)) throw httpError(400, 'Prioridad inválida');
  return Object.fromEntries(keys.map(key => [key, body[key]]));
}
export function encontrado(tarea) { if (!tarea) throw httpError(404, 'Tarea no encontrada'); return tarea; }
