import { jest, test, expect, afterEach } from '@jest/globals';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { Usuario } from '../../../src/entities/usuario.entidad.js';
afterEach(() => jest.restoreAllMocks());
function usuario(contrasena = 'Una frase larga para TaskFlow') {
  return new Usuario({ nombre: 'Ana', correo: 'ana@example.com', contrasena, rol: new mongoose.Types.ObjectId() });
}
function simularEscritura() {
  jest.spyOn(Usuario.collection, 'insertOne').mockResolvedValue({ acknowledged: true });
  jest.spyOn(Usuario.collection, 'updateOne').mockResolvedValue({ acknowledged: true, matchedCount: 1, modifiedCount: 1 });
}
test('Model.create dispara el hook real y persiste un hash bcrypt', async () => {
  simularEscritura();
  const datos = usuario().toObject();
  const doc = await Usuario.create(datos);
  const guardado = Usuario.collection.insertOne.mock.calls[0][0];
  expect(guardado.contrasena).toMatch(/^\$2[aby]\$12\$/);
  expect(guardado.contrasena).not.toBe(datos.contrasena);
  expect(await bcrypt.compare(datos.contrasena, doc.contrasena)).toBe(true);
  expect(doc.toJSON()).not.toHaveProperty('contrasena');
});
test('cada documento genera salt diferente; contraseña errónea falla', async () => {
  simularEscritura(); const a = usuario(), b = usuario(); await a.save(); await b.save();
  expect(a.contrasena).not.toBe(b.contrasena);
  expect(await bcrypt.compare('Una contraseña incorrecta', a.contrasena)).toBe(false);
});
test('guardar otro campo conserva el hash y cambiar contraseña con save lo renueva', async () => {
  simularEscritura(); const doc = usuario(); await doc.save(); const hash = doc.contrasena;
  doc.nombre = 'Ana María'; await doc.save(); expect(doc.contrasena).toBe(hash);
  doc.contrasena = 'Una frase nueva para el segundo guardado'; await doc.save();
  expect(doc.contrasena).not.toBe(hash);
  expect(await bcrypt.compare('Una frase nueva para el segundo guardado', doc.contrasena)).toBe(true);
});
test('rechaza más de 72 bytes antes del hook, incluidos caracteres multibyte', async () => {
  simularEscritura();
  await expect(usuario('á'.repeat(37)).save()).rejects.toMatchObject({ name: 'ValidationError' });
  expect(Usuario.collection.insertOne).not.toHaveBeenCalled();
  await expect(usuario('á'.repeat(36)).save()).resolves.toBeDefined();
});
