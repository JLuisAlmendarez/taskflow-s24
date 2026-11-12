import mongoose from 'mongoose';
export async function conectarBaseDeDatos() {
  if (!process.env.MONGO_DB_URI) throw new Error('Falta MONGO_DB_URI');
  await mongoose.connect(process.env.MONGO_DB_URI, { serverSelectionTimeoutMS: 8000 });
}
