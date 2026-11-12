import { validationResult } from 'express-validator';
export function validarSolicitud(req, res, next) {
  if (!validationResult(req).isEmpty()) return res.status(400).json({ mensaje: 'Datos de entrada inválidos' });
  next();
}
export function limitarCampos(campos) {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body) || Object.keys(req.body).some(key => !campos.includes(key)))
      return res.status(400).json({ mensaje: 'Objeto JSON o campos no permitidos' });
    next();
  };
}
