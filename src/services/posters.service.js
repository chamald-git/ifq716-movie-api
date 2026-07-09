import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTER_DIR = path.resolve(__dirname, '../../res/posters');

function fileNameFor(imdbID, email) {
  return `${imdbID}_${email}.png`;
}

export function relativePathFor(imdbID, email) {
  return `res/posters/${fileNameFor(imdbID, email)}`;
}

export async function readPoster(imdbID, email) {
  const file = path.join(POSTER_DIR, fileNameFor(imdbID, email));
  return fs.readFile(file);
}

export async function writePoster(imdbID, email, buffer) {
  await fs.mkdir(POSTER_DIR, { recursive: true });
  const file = path.join(POSTER_DIR, fileNameFor(imdbID, email));
  await fs.writeFile(file, buffer);
}