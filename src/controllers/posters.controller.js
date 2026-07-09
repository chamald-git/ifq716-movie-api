import { HttpError } from '../utils/httpError.js';
import { readPoster, writePoster, relativePathFor } from '../services/posters.service.js';

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
const IMDB_ID_PATTERN = /^tt\d+$/;

function validateImdbID(id) {
  if (!id || !IMDB_ID_PATTERN.test(id)) {
    throw new HttpError(400, 'You must supply an imdbID!');
  }
}

export async function download(req, res, next) {
  try {
    const imdbID = req.params.imdbID;
    validateImdbID(imdbID);
    const email = req.user.email;

    let buffer;
    try {
      buffer = await readPoster(imdbID, email);
    } catch {
      throw new HttpError(
        500,
        `ENOENT: no such file or directory, open '${relativePathFor(imdbID, email)}'`
      );
    }

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', buffer.length);
    res.end(buffer);
  } catch (err) {
    next(err);
  }
}

export async function upload(req, res, next) {
  try {
    const imdbID = req.params.imdbId;
    validateImdbID(imdbID);
    const email = req.user.email;

    const body = req.body;
    const contentType = (req.headers['content-type'] || '').toLowerCase();
    const looksLikePng =
      contentType.includes('image/png') &&
      Buffer.isBuffer(body) &&
      body.length >= 4 &&
      body.subarray(0, 4).equals(PNG_SIGNATURE);

    if (!looksLikePng) {
      throw new HttpError(400, 'You must supply an imdbID!');
    }

    try {
      await writePoster(imdbID, email, body);
    } catch {
      throw new HttpError(
        500,
        `ENOENT: no such file or directory, open '${relativePathFor(imdbID, email)}'`
      );
    }

    res.json({ error: false, message: 'Poster Uploaded Successfully' });
  } catch (err) {
    next(err);
  }
}