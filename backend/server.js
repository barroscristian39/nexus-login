import 'dotenv/config';
import app from './src/app.js';

const port = Number(process.env.API_PORT || 4000);

app.listen(port, () => {
  console.log(`[NEXUS API] Rodando em http://localhost:${port}`);
});
