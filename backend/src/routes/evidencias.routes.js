import { Router } from 'express';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { prisma } from '../prisma.js';
import { created, fail, ok } from '../utils/response.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

// Criar pasta de uploads se não existir
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configurar storage do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}-${randomStr}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/png', 'image/jpeg', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'));
    }
  }
});

const router = Router();

const schema = z.object({
  empresaId: z.string().nullable().optional(),
  demandaId: z.string().nullable().optional(),
  projetoId: z.string().nullable().optional(),
  nomeArquivo: z.string().min(2),
  tipoArquivo: z.string().min(2),
  responsavelId: z.string().nullable().optional(),
  status: z.enum(['PENDENTE', 'VALIDA', 'ATRASADA', 'REJEITADA']).optional(),
  dataEnvio: z.string().datetime().optional(),
  observacoes: z.string().nullable().optional(),
  urlArquivo: z.string().url().nullable().optional(),
});

router.get('/', async (req, res) => {
  const data = await prisma.evidencia.findMany({
    include: { empresa: true, demanda: true, projeto: true, responsavel: true },
    orderBy: { createdAt: 'desc' },
  });
  return ok(res, data);
});

router.get('/:id', async (req, res) => {
  const data = await prisma.evidencia.findUnique({ where: { id: req.params.id } });
  if (!data) return fail(res, 404, 'Evidência não encontrada.');
  return ok(res, data);
});

router.post('/', upload.single('arquivo'), async (req, res) => {
  try {
    console.log('[EVIDENCIAS POST] Body:', req.body);
    console.log('[EVIDENCIAS POST] File:', req.file?.filename);
    console.log('[EVIDENCIAS POST] User:', req.user);

    // Extrair empresaId do usuário se não for fornecido
    const empresaId = req.body.empresaId || req.user?.empresaId || null;
    
    const bodyData = {
      empresaId,
      demandaId: req.body.demandaId || null,
      projetoId: req.body.projetoId || null,
      nomeArquivo: req.body.nomeArquivo || req.file?.originalname || 'arquivo',
      tipoArquivo: req.body.tipoArquivo || req.file?.mimetype || 'application/octet-stream',
      responsavelId: req.body.responsavelId || null,
      status: req.body.status || 'PENDENTE',
      observacoes: req.body.observacoes || null,
    };

    const parsed = schema.safeParse(bodyData);
    if (!parsed.success) {
      console.log('[EVIDENCIAS POST ERROR]', parsed.error.flatten());
      return fail(res, 400, 'Payload inválido.', parsed.error.flatten());
    }

    let urlArquivo = null;
    if (req.file) {
      urlArquivo = `/uploads/${req.file.filename}`;
    }

    const data = await prisma.evidencia.create({
      data: {
        ...parsed.data,
        empresaId: empresaId || undefined,
        urlArquivo: urlArquivo,
        dataEnvio: new Date(),
      },
    });

    console.log('[EVIDENCIAS POST SUCCESS]', data.id);
    return created(res, data);
  } catch (err) {
    console.error('[EVIDENCIAS POST CATCH]', err);
    if (err.message === 'Tipo de arquivo não permitido') {
      return fail(res, 400, 'Tipo de arquivo não permitido. Use: PDF, DOCX, XLSX, PNG ou JPG');
    }
    throw err;
  }
});

router.put('/:id', async (req, res) => {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Payload inválido.', parsed.error.flatten());

  const data = await prisma.evidencia.update({
    where: { id: req.params.id },
    data: {
      ...parsed.data,
      dataEnvio: parsed.data.dataEnvio ? new Date(parsed.data.dataEnvio) : undefined,
    },
  });

  return ok(res, data, 'Evidência atualizada com sucesso.');
});

router.patch('/:id/status', async (req, res) => {
  const parsed = z.object({ status: z.enum(['PENDENTE', 'VALIDA', 'ATRASADA', 'REJEITADA']) }).safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Status inválido.');
  const data = await prisma.evidencia.update({ where: { id: req.params.id }, data: { status: parsed.data.status } });
  return ok(res, data, 'Status da evidência atualizado.');
});

router.delete('/:id', async (req, res) => {
  const data = await prisma.evidencia.delete({ where: { id: req.params.id } });
  return ok(res, data, 'Evidência excluída.');
});

export default router;
