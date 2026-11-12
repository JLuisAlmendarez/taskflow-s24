import * as tareas from '../../repositories/tarea.repositorio.js';
import { checkId } from '../../utils/check.id.js';
import { encontrado, validarDatos } from './tarea.validaciones.js';
export async function ejecutar(id, propietario) { checkId(id); return encontrado(await tareas.buscarPorId(id, propietario)); }
