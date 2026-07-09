import { db } from '../config/db.js';

const PAGE_SIZE = 100;

export async function searchMovies({ title, year, page }) {
  const currentPage = page && Number(page) > 0 ? Number(page) : 1;
  const offset = (currentPage - 1) * PAGE_SIZE;

  const baseQuery = db('basics').where('primaryTitle', 'like', `%${title}%`);
  if (year) baseQuery.andWhere('startYear', String(year));

  const countResult = await baseQuery.clone().count({ total: '*' }).first();
  const total = Number(countResult?.total || 0);

  const rows = await baseQuery
    .clone()
    .select({ Title: 'primaryTitle', Year: 'startYear', imdbID: 'tconst', Type: 'titleType' })
    .orderBy('tconst', 'asc')
    .limit(PAGE_SIZE)
    .offset(offset);

  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const from = total === 0 ? 0 : offset;
  const to = total === 0 ? 0 : Math.min(offset + rows.length, total);

  return {
    data: rows,
    pagination: {
      total,
      lastPage,
      perPage: PAGE_SIZE,
      currentPage,
      from,
      to,
    },
  };
}

export async function getMovieByImdbId(imdbID) {
  const basics = await db('basics').where({ tconst: imdbID }).first();
  if (!basics) return null;

  const [rating, crew, principals] = await Promise.all([
    db('ratings').where({ tconst: imdbID }).first(),
    db('crew').where({ tconst: imdbID }).first(),
    db('principals')
      .join('names', 'principals.nconst', 'names.nconst')
      .where('principals.tconst', imdbID)
      .whereIn('principals.category', ['actor', 'actress'])
      .orderBy('principals.ordering', 'asc')
      .select('names.primaryName'),
  ]);

  const resolveNames = async (csv) => {
    if (!csv) return '';
    const nconsts = csv.split(',').map((s) => s.trim()).filter(Boolean);
    if (!nconsts.length) return '';
    const rows = await db('names').whereIn('nconst', nconsts).select('nconst', 'primaryName');
    const map = new Map(rows.map((r) => [r.nconst, r.primaryName]));
    return nconsts.map((n) => map.get(n)).filter(Boolean).join(',');
  };

  const [directors, writers] = await Promise.all([
    resolveNames(crew?.directors),
    resolveNames(crew?.writers),
  ]);

  return {
    Title: basics.primaryTitle,
    Year: basics.startYear,
    Runtime: basics.runtimeMinutes ? `${basics.runtimeMinutes} min` : '',
    Genre: basics.genres || '',
    Director: directors,
    Writer: writers,
    Actors: principals.map((p) => p.primaryName).join(','),
    Ratings: rating
      ? [{ Source: 'Internet Movie Database', Value: `${rating.averageRating}/10` }]
      : [],
  };
}