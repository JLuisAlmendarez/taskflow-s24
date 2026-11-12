import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true, maxlength: 80 },
  correo: { type: String, required: true, lowercase: true, trim: true, unique: true },
  contrasena: { type: String, required: true, select: false,
    validate: { validator: valor => typeof valor === 'string' && valor.length >= 15 && Buffer.byteLength(valor, 'utf8') <= 72,
      message: 'Contraseña: mínimo 15 caracteres y máximo 72 bytes UTF-8' } },
  rol: { type: mongoose.Schema.Types.ObjectId, ref: 'Rol', required: true },
  estado: { type: Boolean, default: true }
}, { timestamps: true, collection: 'usuarios', toJSON: { transform(doc, value) {
  delete value.contrasena; return value;
} } });
// Definir el hook antes de compilar el modelo. Una función normal conserva this.
/** @type {number} Costo de bcrypt: 2^12 rondas de derivación. */
const COSTO_BCRYPT = 12;
/**
 * Hook pre('save'): genera el hash bcrypt de contrasena sólo cuando ese campo cambió.
 * Mongoose ya validó longitud y bytes antes de llegar aquí.
 * @this {import('mongoose').Document} Documento de usuario que se va a guardar.
 * @returns {Promise<void>}
 */
usuarioSchema.pre('save', async function () {
  // TODO 2: comprobar isModified y generar hash bcrypt con costo 12.
  if (!this.isModified('contrasena')) return;
  this.contrasena = await bcrypt.hash(this.contrasena, COSTO_BCRYPT);
});
// No se ofrece actualización de credenciales por query: no dispara pre('save').
export const Usuario = mongoose.model('Usuario', usuarioSchema);
