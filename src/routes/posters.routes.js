import express, { Router } from 'express';
import { allowQuery } from '../middleware/allowQuery.js';
import { verifyBearer } from '../middleware/auth.js';
import { download, upload } from '../controllers/posters.controller.js';

const router = Router();

router.get('/:imdbID', verifyBearer, allowQuery([]), download);

router.post(
  '/add/:imdbId',
  verifyBearer,
  allowQuery([]),
  express.raw({ type: 'image/png', limit: '10mb' }),
  upload
);

export default router;