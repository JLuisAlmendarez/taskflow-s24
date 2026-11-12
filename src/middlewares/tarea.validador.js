import { body, param } from 'express-validator';
import { limitarCampos, validarSolicitud } from './validar.solicitud.js';
const campos = ['titulo', 'descripcion', 'estado', 'prioridad'];
export const validarIdTarea = [param('id').isMongoId(), validarSolicitud];
const texto = campos.map(campo => body(campo).optional().isString());
export const validarCreacion = [limitarCampos(campos), ...texto,
  body('titulo').isString().bail().trim().notEmpty(), validarSolicitud];
export const validarActualizacion = [limitarCampos(campos), ...texto, validarSolicitud];
