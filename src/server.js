import http from 'node:http';
import https from 'node:https';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import app from './app.js';
import { config } from './config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CERT_DIR = path.resolve(__dirname, '../certs');

async function loadDevCerts() {
  const [key, cert] = await Promise.all([
    fs.readFile(path.join(CERT_DIR, 'dev-key.pem')),
    fs.readFile(path.join(CERT_DIR, 'dev-cert.pem')),
  ]);
  return { key, cert };
}

async function start() {
  if (config.env === 'production') {
    http.createServer(app).listen(config.port, () => {
      console.log(`Movie Information API (production) listening on port ${config.port}`);
    });
    return;
  }

  try {
    const credentials = await loadDevCerts();
    https.createServer(credentials, app).listen(config.port, () => {
      console.log(`Movie Information API (dev, HTTPS) listening on https://localhost:${config.port}`);
    });
  } catch (err) {
    console.error(
      `Could not load HTTPS certs from ${CERT_DIR}. ` +
        'Run "npm run cert" once to generate them, then restart. Falling back to HTTP.'
    );
    http.createServer(app).listen(config.port, () => {
      console.log(`Movie Information API (dev, HTTP fallback) listening on http://localhost:${config.port}`);
    });
  }
}

start();
