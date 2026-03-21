import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') && req.body) {
    const bodyStr = JSON.stringify(req.body);
    if (bodyStr) {
      console.log('  Body:', bodyStr.substring(0, 100));
    }
  }
  next();
});

app.use(cors({
  origin: ['https://nexus-login-teal.vercel.app', 'http://localhost:5173', 'http://localhost:4000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', routes);

app.use(errorHandler);

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error('[APP ERROR]', err);
  res.status(500).json({ success: false, message: 'Server error' });
});

export default app;
