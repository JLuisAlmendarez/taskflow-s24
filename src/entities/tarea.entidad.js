import mongoose from 'mongoose';
const tareaSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true, maxlength: 120 },
  descripcion: { type: String, default: '', maxlength: 1000 },
  estado: { type: String, enum: ['pendiente', 'en_progreso', 'completada'], default: 'pendiente' },
  prioridad: { type: String, enum: ['baja', 'media', 'alta'], default: 'media' },
  propietario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, index: true }
}, { timestamps: true, collection: 'tareas' });
export const Tarea = mongoose.model('Tarea', tareaSchema);
