import mongoose from 'mongoose';
const rolSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  descripcion: { type: String, default: '' },
  estado: { type: Boolean, default: true }
}, { timestamps: true, collection: 'roles' });
export const Rol = mongoose.model('Rol', rolSchema);
