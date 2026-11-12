import * as tareas from '../../repositories/tarea.repositorio.js';
import { httpError } from '../../utils/http.error.js';
export async function ejecutar(consulta, propietario) {
  if (Object.keys(consulta).some(key => key !== 'estado')) throw httpError(400, 'Filtro no permitido');
  if (consulta.estado !== undefined && !['pendiente', 'en_progreso', 'completada'].includes(consulta.estado)) throw httpError(400, 'Estado inválido');
  return tareas.listar({ propietario, ...(consulta.estado ? { estado: consulta.estado } : {}) });
}
