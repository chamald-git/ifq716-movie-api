import knex from 'knex';
import knexConfig from './knexfile.js';
import { config } from './env.js';

const environment = config.env === 'production' ? 'production' : 'development';

export const db = knex(knexConfig[environment]);

export async function pingDb() {
  const result = await db.raw('SELECT 1 + 1 AS answer');
  return result[0][0].answer;
}