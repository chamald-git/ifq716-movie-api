import express from 'express';
import cors from 'cors';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { pingDb } from './config/db.js';
import userRoutes from './routes/users.routes.js';
import movieRoutes from './routes/movies.routes.js';
import posterRoutes from './routes/posters.routes.js';   // ⬅ NEW

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.get('/health/db', async (req, res, next) => {
  try {
    const answer = await pingDb();
    res.json({ ok: true, db: 'connected', answer });
  } catch (err) {
    next(err);
  }
});

app.use('/user', userRoutes);
app.use('/movies', movieRoutes);
app.use('/posters', posterRoutes);   

app.use(notFoundHandler);
app.use(errorHandler);

export default app;