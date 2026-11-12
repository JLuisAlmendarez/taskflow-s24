// Integración REAL. Requiere una API en ejecución conectada a una BD de práctica.
// Crea dos usuarios y elimina la tarea creada. Conserva los usuarios de prueba.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
const base=process.env.BASE_URL || 'http://localhost:3000';
const run=randomUUID(); const contrasena='Frase de prueba larga para TaskFlow';
async function call(method,path,body,token) {
 const r=await fetch(base+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});
 const text=await r.text();return {status:r.status,data:text?JSON.parse(text):null};
}
const tokens=[];
for(const name of ['ana','bruno']) {
 const correo=`${name}.${run}@example.com`;
 assert.equal((await call('POST','/api/v1/auth/register',{nombre:name,correo,contrasena})).status,201);
 const login=await call('POST','/api/v1/auth/login',{correo,contrasena});assert.equal(login.status,200);
 assert.equal(login.data.usuario.contrasena,undefined);tokens.push(login.data.accessToken);
}
const [a,b]=tokens;
assert.equal((await call('GET','/api/v1/tasks')).status,401);
assert.equal((await call('GET','/api/v1/tasks',undefined,'invalido')).status,401);
let id;
try {
 const create=await call('POST','/api/v1/tasks',{titulo:`Smoke ${run}`},a);assert.equal(create.status,201);id=create.data.id;
 assert.ok((await call('GET','/api/v1/tasks',undefined,a)).data.some(x=>x.id===id));
 assert.ok(!(await call('GET','/api/v1/tasks',undefined,b)).data.some(x=>x.id===id));
 for(const method of ['GET','PATCH','DELETE']) assert.equal((await call(method,`/api/v1/tasks/${id}`,method==='PATCH'?{titulo:'Ajena'}:undefined,b)).status,404);
 assert.equal((await call('PATCH',`/api/v1/tasks/${id}`,{propietario:'507f1f77bcf86cd799439011'},a)).status,400);
 assert.equal((await call('PATCH',`/api/v1/tasks/${id}`,{estado:'completada'},a)).status,200);
 console.log('Integración real correcta: dos usuarios, JWT y aislamiento.');
} finally { if(id) await call('DELETE',`/api/v1/tasks/${id}`,undefined,a); }
