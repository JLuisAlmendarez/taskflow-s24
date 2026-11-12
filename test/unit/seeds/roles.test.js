import { jest, test, expect } from '@jest/globals';
import { Rol } from '../../../src/entities/rol.entidad.js';
import { crearRolesIniciales } from '../../../src/seeds/roles.seed.js';
test('seed usa upsert y no modifica roles existentes al repetirlo', async () => {
 const persistidos=new Map();
 const spy=jest.spyOn(Rol,'updateOne').mockImplementation(async (filtro,update,opciones) => {
   expect(opciones.upsert).toBe(true);expect(Object.keys(update)).toEqual(['$setOnInsert']);
   if(!persistidos.has(filtro.nombre)) persistidos.set(filtro.nombre,update.$setOnInsert);
 });
 try { await crearRolesIniciales();await crearRolesIniciales();
 expect([...persistidos.keys()]).toEqual(['Administrador','Cliente']);expect(spy).toHaveBeenCalledTimes(4);
 } finally {spy.mockRestore();}
});
