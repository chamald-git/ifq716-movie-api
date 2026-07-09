import { HttpError } from '../utils/httpError.js';

export function allowQuery(allowedKeys) {
  const allowed = new Set(allowedKeys);
  return function (req, res, next) {
    for (const key of Object.keys(req.query)) {
      if (!allowed.has(key)) {
        const message = allowedKeys.length === 0
          ? `Invalid query parameters: ${key}. Query parameters are not permitted.`
          : 'Invalid query parameters. Only year, title and page are permitted.';
        return next(new HttpError(400, message));
      }
    }
    next();
  };
}