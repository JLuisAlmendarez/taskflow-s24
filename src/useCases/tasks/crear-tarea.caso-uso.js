import * as tareas from '../../repositories/tarea.repositorio.js';
import { validarDatos } from './tarea.validaciones.js';
export async function ejecutar(datos, propietario) { return tareas.crear({ ...validarDatos(datos), propietario }); }
