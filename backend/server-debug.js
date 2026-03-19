import 'dotenv/config';
import app from './src/app.js';

const port = Number(process.env.API_PORT || 4000);

console.log('[STARTUP] Starting server...');
console.log('[STARTUP] Port:', port);
console.log('[STARTUP] NODE_ENV:', process.env.NODE_ENV);
console.log('[STARTUP] DATABASE_URL exists:', !!process.env.DATABASE_URL);

const server = app.listen(port, () => {
  console.log(`[NEXUS API] Rodando em http://localhost:${port}`);
});

server.on('error', (err) => {
  console.error('[SERVER ERROR]', err);
  process.exit(1);
});

process.on('error', (err) => {
  console.error('[PROCESS ERROR]', err);
  process.exit(1);
});
