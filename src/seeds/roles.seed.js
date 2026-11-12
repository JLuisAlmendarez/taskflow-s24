import { Rol } from '../entities/rol.entidad.js';
export async function crearRolesIniciales() {
  for (const [nombre, descripcion] of [
    ['Administrador', 'Rol reservado para gestión explícita'],
    ['Cliente', 'Usuario que administra sus propias tareas']
  ]) {
    await Rol.updateOne({ nombre }, { $setOnInsert: { nombre, descripcion, estado: true } },
      { upsert: true, runValidators: true });
  }
}
