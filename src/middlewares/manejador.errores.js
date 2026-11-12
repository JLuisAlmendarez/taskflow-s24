export function manejarErrores(err, req, res, next) {
  if (err.code === 11000) return res.status(409).json({ mensaje: 'No se pudo registrar con esos datos' });
  if (['ValidationError', 'CastError'].includes(err.name) || err.type === 'entity.parse.failed')
    return res.status(400).json({ mensaje: 'Datos inválidos' });
  if (err.type === 'entity.too.large') return res.status(413).json({ mensaje: 'JSON demasiado grande' });
  const status = err.status >= 400 && err.status < 500 ? err.status : 500;
  if (status === 500) console.error('Error interno:', err.name);
  res.status(status).json({ mensaje: status === 500 ? 'Error interno' : err.message });
}
