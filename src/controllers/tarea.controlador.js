import { ejecutar as listarTareas } from '../useCases/tasks/listar-tareas.caso-uso.js';
import { ejecutar as obtenerTarea } from '../useCases/tasks/obtener-tarea-por-id.caso-uso.js';
import { ejecutar as crearTarea } from '../useCases/tasks/crear-tarea.caso-uso.js';
import { ejecutar as actualizarTarea } from '../useCases/tasks/actualizar-tarea.caso-uso.js';
import { ejecutar as eliminarTarea } from '../useCases/tasks/eliminar-tarea.caso-uso.js';
export async function listar(req, res) { res.json(await listarTareas(req.query, req.usuario.id)); }
export async function obtener(req, res) { res.json(await obtenerTarea(req.params.id, req.usuario.id)); }
export async function crear(req, res) { res.status(201).json(await crearTarea(req.body, req.usuario.id)); }
export async function actualizar(req, res) { res.json(await actualizarTarea(req.params.id, req.body, req.usuario.id)); }
export async function eliminar(req, res) { await eliminarTarea(req.params.id, req.usuario.id); res.status(204).end(); }
