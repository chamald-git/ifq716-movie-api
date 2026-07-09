import { HttpError } from '../utils/httpError.js';
import { isValidYear } from '../utils/validators.js';
import { searchMovies, getMovieByImdbId } from '../services/movies.service.js';

export async function search(req, res, next) {
  try {
    const { title, year, page } = req.query;
    if (typeof title !== 'string' || !title.trim()) {
      throw new HttpError(400, 'Invalid query parameters. Only year, title and page are permitted.');
    }
    if (year !== undefined && !isValidYear(year)) {
      throw new HttpError(400, 'Invalid year format. Format must be yyyy.');
    }
    const result = await searchMovies({ title: title.trim(), year, page });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getData(req, res, next) {
  try {
    const { imdbID } = req.params;
    const movie = await getMovieByImdbId(imdbID);
    if (!movie) {
      throw new HttpError(404, 'No movie with the given ID was found.');
    }
    res.json(movie);
  } catch (err) {
    next(err);
  }
}