import { config } from './env.js';

export default {
  development: {
    client: 'mysql2',
    connection: {
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
    },
    pool: { min: 0, max: 10 },
  },
  production: {
    client: 'mysql2',
    connection: process.env.DATABASE_URL,
    pool: { min: 0, max: 10 },
  },
};