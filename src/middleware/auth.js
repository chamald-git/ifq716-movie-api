import jwt from 'jsonwebtoken';
import { HttpError } from '../utils/httpError.js';
import { config } from '../config/env.js';

export function verifyBearer(req, res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return next(new HttpError(401, "Authorization header ('Bearer token') not found"));
  }
  const token = header.slice(7).trim();
  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new HttpError(401, 'JWT token has expired'));
      }
      return next(new HttpError(401, 'Invalid JWT token'));
    }
    req.user = decoded;
    next();
  });
}