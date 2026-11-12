import { test, expect } from '@jest/globals';
import { me } from '../../../src/controllers/autenticacion.controlador.js';
test('TODO 9: me devuelve el objeto público del usuario autenticado', async () => {
 const usuario={id:'507f1f77bcf86cd799439011',nombre:'Ana',correo:'ana@example.com',rol:'507f1f77bcf86cd799439012',estado:true};
 let result; await me({usuario},{json:value => {result=value;},status:()=>{throw new Error('TODO 9 pendiente');}});
 expect(result).toEqual(usuario); expect(result).not.toHaveProperty('contrasena');
});
