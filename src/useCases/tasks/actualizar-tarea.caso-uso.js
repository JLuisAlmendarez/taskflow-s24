import * as tareas from '../../repositories/tarea.repositorio.js';
import { checkId } from '../../utils/check.id.js';
import { encontrado, validarDatos } from './tarea.validaciones.js';
export async function ejecutar(id, datos, propietario) { checkId(id); return encontrado(await tareas.actualizar(id, propietario, validarDatos(datos, true))); }
