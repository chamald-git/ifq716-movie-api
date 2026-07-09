import { HttpError } from '../utils/httpError.js';

export function notFoundHandler(req, res, next) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ error: true, message: err.message });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ error: true, message: 'Internal server error' });
}