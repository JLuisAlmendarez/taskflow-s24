import { jest, test, expect } from '@jest/globals';
import { Tarea } from '../../../src/entities/tarea.entidad.js';
import { ejecutar as obtener } from '../../../src/useCases/tasks/obtener-tarea-por-id.caso-uso.js';
import { ejecutar as actualizar } from '../../../src/useCases/tasks/actualizar-tarea.caso-uso.js';
import { ejecutar as eliminar } from '../../../src/useCases/tasks/eliminar-tarea.caso-uso.js';
import { ejecutar as crear } from '../../../src/useCases/tasks/crear-tarea.caso-uso.js';
import { ejecutar as listar } from '../../../src/useCases/tasks/listar-tareas.caso-uso.js';
const id='507f1f77bcf86cd799439011', propietario='507f1f77bcf86cd799439012';
test('cada operación individual filtra id y propietario y responde 404 sin recurso', async () => {
 for(const [metodo,call] of [['findOne',()=>obtener(id,propietario)],['findOneAndUpdate',()=>actualizar(id,{titulo:'Nueva'},propietario)],['findOneAndDelete',()=>eliminar(id,propietario)]]) {
   const spy=jest.spyOn(Tarea,metodo).mockResolvedValue(null);
   await expect(call()).rejects.toMatchObject({status:404});expect(spy.mock.calls[0][0]).toEqual({_id:id,propietario});spy.mockRestore();
 }
});
test('rechaza campos de propietario, id mal formado y filtros no permitidos', async () => {
 await expect(crear({titulo:'Nueva',propietario:id},propietario)).rejects.toMatchObject({status:400});
 await expect(obtener('abc',propietario)).rejects.toMatchObject({status:400});
 await expect(listar({propietario:id},propietario)).rejects.toMatchObject({status:400});
});
