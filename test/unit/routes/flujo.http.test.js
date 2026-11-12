import { jest, test, expect } from '@jest/globals';
import { randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { simularPersistencia } from '../helpers/persistencia.simulada.js';
process.env.JWT_SECRET = randomBytes(32).toString('hex');
process.env.NODE_ENV = 'test';
const { default: app } = await import('../../../src/app.js');
test('HTTP completo: hooks reales, login, JWT, permisos, estado y cierre (persistencia simulada)', async () => {
 const data = simularPersistencia();
 const server = app.listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening', resolve));
 const url = `http://127.0.0.1:${server.address().port}`;
 async function request(method, path, body, token) {
   const response = await fetch(url + path, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
     ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
   const text = await response.text(); return { status: response.status, body: text ? JSON.parse(text) : null };
 }
 try {
 const contrasena = 'Frase de prueba para TaskFlow';
 for (const nombre of ['ana', 'bruno']) {
   const r = await request('POST', '/api/v1/auth/register', { nombre, correo: `${nombre}@example.com`, contrasena });
   expect(r.status).toBe(201); expect(r.body).not.toHaveProperty('contrasena'); expect(r.body.rol).toBe(String(data.roles[0]._id));
 }
 expect(data.usuarios.every(x => x.contrasena.startsWith('$2b$12$'))).toBe(true);
 expect((await request('POST','/api/v1/auth/register',{nombre:'Ana',correo:'ana@example.com',contrasena})).status).toBe(409);
 expect((await request('POST','/api/v1/auth/register',{nombre:'Admin',correo:'admin@example.com',contrasena,rol:'Administrador'})).status).toBe(400);
 expect((await request('POST','/api/v1/auth/register',{nombre:'Larga',correo:'larga@example.com',contrasena:'á'.repeat(37)})).status).toBe(400);
 expect((await request('POST','/api/v1/auth/login',{correo:{$ne:null},contrasena})).status).toBe(400);
 expect((await request('POST','/api/v1/auth/login',{correo:'ana@example.com',contrasena:'Frase incorrecta de prueba'})).status).toBe(401);
 const a=(await request('POST','/api/v1/auth/login',{correo:'ana@example.com',contrasena})).body;
 const b=(await request('POST','/api/v1/auth/login',{correo:'bruno@example.com',contrasena})).body;
 expect(a.accessToken).toBeDefined(); expect(a.usuario).not.toHaveProperty('contrasena');
 expect((await request('GET','/api/v1/tasks')).status).toBe(401);
 expect((await request('GET','/api/v1/auth/me')).status).toBe(401);
 expect((await request('GET','/api/v1/tasks',undefined,'token-invalido')).status).toBe(401);
 const expirado=jwt.sign({},process.env.JWT_SECRET,{subject:a.usuario.id,issuer:'taskflow-api',audience:'taskflow-client',expiresIn:-1});
 expect((await request('GET','/api/v1/tasks',undefined,expirado)).status).toBe(401);
 const partes=a.accessToken.split('.');partes[1]=Buffer.from('{"sub":"otro"}').toString('base64url');
 expect((await request('GET','/api/v1/tasks',undefined,partes.join('.'))).status).toBe(401);
 const creada=await request('POST','/api/v1/tasks',{titulo:'Mi tarea'},a.accessToken);expect(creada.status).toBe(201);
 const id=creada.body.id;
 expect((await request('GET','/api/v1/tasks',undefined,a.accessToken)).body).toHaveLength(1);
 expect((await request('GET','/api/v1/tasks',undefined,b.accessToken)).body).toEqual([]);
 for(const metodo of ['GET','PATCH','DELETE']) expect((await request(metodo,`/api/v1/tasks/${id}`,metodo==='PATCH'?{titulo:'Ajena'}:undefined,b.accessToken)).status).toBe(404);
 expect((await request('PATCH',`/api/v1/tasks/${id}`,{propietario:b.usuario.id},a.accessToken)).status).toBe(400);
 expect((await request('PATCH',`/api/v1/tasks/${id}`,{estado:'invalido'},a.accessToken)).status).toBe(400);
 expect((await request('PATCH',`/api/v1/tasks/${id}`,{estado:'completada'},a.accessToken)).status).toBe(200);
 expect((await request('GET','/api/v1/tasks/abc',undefined,a.accessToken)).status).toBe(400);
 expect((await request('POST','/api/v1/auth/logout',undefined,a.accessToken)).status).toBe(200);
 // Logout educativo: no revoca el token del servidor.
 expect((await request('GET','/api/v1/tasks',undefined,a.accessToken)).status).toBe(200);
 data.usuarios[0].estado=false;
 expect((await request('GET','/api/v1/tasks',undefined,a.accessToken)).status).toBe(401);
 expect((await request('POST','/api/v1/auth/login',{correo:'ana@example.com',contrasena})).status).toBe(401);
 data.usuarios[0].estado=true;data.roles[0].estado=false;
 expect((await request('GET','/api/v1/tasks',undefined,a.accessToken)).status).toBe(401);
 data.roles[0].estado=true;
 expect((await request('DELETE',`/api/v1/tasks/${id}`,undefined,a.accessToken)).status).toBe(204);
 expect((await request('GET',`/api/v1/tasks/${id}`,undefined,a.accessToken)).status).toBe(404);
 } finally { await new Promise(resolve => server.close(resolve)); jest.restoreAllMocks(); }
});
