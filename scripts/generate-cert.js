import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const selfsigned = require('selfsigned');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CERT_DIR = path.resolve(__dirname, '../certs');
const KEY_PATH = path.join(CERT_DIR, 'dev-key.pem');
const CERT_PATH = path.join(CERT_DIR, 'dev-cert.pem');

async function main() {
  await fs.mkdir(CERT_DIR, { recursive: true });

  const attrs = [{ name: 'commonName', value: 'localhost' }];
  const pems = await selfsigned.generate(attrs, {
    days: 365,
    keySize: 2048,
    algorithm: 'sha256',
  });

  if (!pems || !pems.cert || !pems.private) {
    throw new Error('generate did not return { cert, private }. Got: ' + JSON.stringify(pems).slice(0, 200));
  }

  await fs.writeFile(KEY_PATH, pems.private);
  await fs.writeFile(CERT_PATH, pems.cert);
  console.log(`Wrote ${KEY_PATH}`);
  console.log(`Wrote ${CERT_PATH}`);
}

main().catch((err) => {
  console.error('Cert generation failed:', err);
  process.exit(1);
});