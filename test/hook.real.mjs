/**
 * Demostración REAL del hook pre('save') contra la BD de práctica (no forma parte de Jest).
 * Carga un usuario, cambia sólo su nombre con save() y comprueba que el hash bcrypt no cambia.
 * Nunca recibe ni imprime la contraseña de entrada; sólo muestra el hash persistido.
 * Uso: node test/hook.real.mjs <correo> "<nuevo nombre>"
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { Usuario } from '../src/entities/usuario.entidad.js';

const [correo, nuevoNombre] = process.argv.slice(2);
if (!correo || !nuevoNombre) {
  console.error('Uso: node test/hook.real.mjs <correo> "<nuevo nombre>"');
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_DB_URI, { serverSelectionTimeoutMS: 8000 });
try {
  const usuario = await Usuario.findOne({ correo }).select('+contrasena');
  if (!usuario) throw new Error(`No existe un usuario con correo ${correo}`);

  const hashAntes = usuario.contrasena;
  console.log(`Usuario:              ${usuario.correo}`);
  console.log(`Nombre antes:         ${usuario.nombre}`);
  console.log(`Hash antes:           ${hashAntes}`);

  usuario.nombre = nuevoNombre;
  console.log(`isModified(nombre):   ${usuario.isModified('nombre')}`);
  console.log(`isModified(contrasena): ${usuario.isModified('contrasena')}`);
  await usuario.save();

  const recargado = await Usuario.findOne({ correo }).select('+contrasena');
  console.log(`Nombre después:       ${recargado.nombre}`);
  console.log(`Hash después:         ${recargado.contrasena}`);
  console.log(`Hash conservado:      ${recargado.contrasena === hashAntes}`);
} finally {
  await mongoose.disconnect();
}
