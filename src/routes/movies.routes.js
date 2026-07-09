import { Router } from 'express';
import { allowQuery } from '../middleware/allowQuery.js';
import { search, getData } from '../controllers/movies.controller.js';

const router = Router();

router.get('/search', allowQuery(['title', 'year', 'page']), search);
router.get('/data/:imdbID', allowQuery([]), getData);

export default router;