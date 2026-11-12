import 'dotenv/config';
import app from './app.js';
import { validarEntorno } from './config/env.js';
import { conectarBaseDeDatos } from './config/database.js';
import { crearRolesIniciales } from './seeds/roles.seed.js';
import { Usuario } from './entities/usuario.entidad.js';
import { Rol } from './entities/rol.entidad.js';
import mongoose from 'mongoose';
try {
  validarEntorno();
  await conectarBaseDeDatos();
  await Promise.all([Usuario.init(), Rol.init()]);
  await crearRolesIniciales();
  app.listen(process.env.PORT || 3000, '0.0.0.0', () => console.log('TaskFlow listo. BD y roles preparados.'));
} catch {
  console.error('No se pudo iniciar. Revisa entorno, BD, índices y roles.');
  await mongoose.disconnect();
  process.exitCode = 1;
}
