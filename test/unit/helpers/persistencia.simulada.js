import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { Usuario } from '../../../src/entities/usuario.entidad.js';
import { Rol } from '../../../src/entities/rol.entidad.js';
import { Tarea } from '../../../src/entities/tarea.entidad.js';
// Simula sólo la persistencia. Usuario.create y sus hooks de Mongoose sí se ejecutan.
export function simularPersistencia() {
  const usuarios = [], tareas = [];
  const cliente = { _id: new mongoose.Types.ObjectId(), nombre: 'Cliente', estado: true };
  const roles = [cliente];
  const coincide = (doc, query) => Object.entries(query).every(([k,v]) => String(doc[k]) === String(v));
  jest.spyOn(Usuario.collection, 'insertOne').mockImplementation(async doc => {
    if (usuarios.some(x => x.correo === doc.correo)) throw Object.assign(new Error('duplicado'), { code: 11000 });
    usuarios.push({ ...doc }); return { acknowledged: true, insertedId: doc._id };
  });
  jest.spyOn(Usuario, 'findOne').mockImplementation(query => {
    const buscar = () => { const data = usuarios.find(x => coincide(x, query)); return data ? Usuario.hydrate(data) : null; };
    return { select: async () => buscar(), then: (resolve, reject) => Promise.resolve(buscar()).then(resolve, reject) };
  });
  jest.spyOn(Usuario, 'findById').mockImplementation(async id => {
    const data = usuarios.find(x => String(x._id) === String(id)); return data ? Usuario.hydrate(data) : null;
  });
  jest.spyOn(Rol, 'findOne').mockImplementation(async query => roles.find(x => coincide(x, query)) || null);
  jest.spyOn(Rol, 'findById').mockImplementation(async id => roles.find(x => String(x._id) === String(id)) || null);
  const doc = value => value ? Tarea.hydrate(value) : null;
  jest.spyOn(Tarea.collection, 'insertOne').mockImplementation(async value => { tareas.push({ ...value }); return { acknowledged: true, insertedId: value._id }; });
  jest.spyOn(Tarea, 'find').mockImplementation(async query => tareas.filter(x => coincide(x, query)).map(doc));
  jest.spyOn(Tarea, 'findOne').mockImplementation(async query => doc(tareas.find(x => coincide(x, query))));
  jest.spyOn(Tarea, 'findOneAndUpdate').mockImplementation(async (query, update) => {
    const value = tareas.find(x => coincide(x, query)); if (value) Object.assign(value, update.$set); return doc(value);
  });
  jest.spyOn(Tarea, 'findOneAndDelete').mockImplementation(async query => {
    const index = tareas.findIndex(x => coincide(x, query)); return index < 0 ? null : doc(tareas.splice(index, 1)[0]);
  });
  return { usuarios, tareas, roles };
}
