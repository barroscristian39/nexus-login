import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './src/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir arquivos estáticos do frontend buildado (em produção)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Servir o index.html para rotas que não são API (suporte para SPA React)
app.get('*', (req, res) => {
  // Se já foi servida uma resposta (ex: /api/status), não serve index.html
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'Endpoint não encontrado' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

const port = Number(process.env.PORT || process.env.API_PORT || 4000);

app.listen(port, () => {
  console.log(`[NEXUS] Servidor rodando em porta ${port}`);
  console.log(`[NEXUS] Frontend: http://localhost:${port}`);
  console.log(`[NEXUS] API: http://localhost:${port}/api`);
  console.log(`[NEXUS] Environment: ${process.env.NODE_ENV || 'development'}`);
});
