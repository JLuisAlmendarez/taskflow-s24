export function validarEntorno() {
  if (!process.env.MONGO_DB_URI) throw new Error('Falta MONGO_DB_URI');
  if (!process.env.JWT_SECRET || Buffer.byteLength(process.env.JWT_SECRET) < 32)
    throw new Error('JWT_SECRET requiere al menos 32 bytes aleatorios');
}
