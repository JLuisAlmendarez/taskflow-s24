import mongoose from 'mongoose';
import { httpError } from './http.error.js';
export function checkId(id) {
  if (!mongoose.isObjectIdOrHexString(id)) throw httpError(400, 'ID inválido');
}
