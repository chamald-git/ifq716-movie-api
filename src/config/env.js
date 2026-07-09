import dotenv from 'dotenv';

dotenv.config({ quiet: true });

function required(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        'Copy .env.example to .env and fill it in.'
    );
  }
  return value.trim();
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,

  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: required('DB_USER'),
    password: required('DB_PASSWORD'),
    database: required('DB_NAME'),
  },

  jwt: {
    secret: required('JWT_SECRET'),
    expiresInSeconds: Number(process.env.JWT_EXPIRES_IN) || 86400,
  },
};