import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { prisma } from '../prisma.js';
import { created, fail, ok } from '../utils/response.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Configurar multer para upload de fotos
const uploadsDir = path.join(__dirname, '../../uploads/fotos');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas'), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

const schema = z.object({
  empresaId: z.string().nullable().optional(),
  usuarioPaiId: z.string().nullable().optional(),
  nome: z.string().min(2),
  email: z.string().email(),
  telefone: z.string().nullable().optional(),
  senha: z.string().min(6).optional(),
  perfil: z.enum(['MASTER', 'ADMIN_EMPRESA', 'GESTOR', 'SUPERVISOR', 'OPERADOR', 'VISUALIZADOR']),
  tipoUsuario: z.enum(['MASTER', 'PRINCIPAL', 'SUBUSUARIO']),
  status: z.enum(['ATIVO', 'INATIVO', 'PENDENTE', 'BLOQUEADO', 'ARQUIVADO']).optional(),
  setor: z.string().nullable().optional(),
});

router.get('/', async (req, res) => {
  try {
    const data = await prisma.usuario.findMany({
      include: { empresa: true, usuarioPai: true },
      orderBy: { createdAt: 'desc' },
    });
    return ok(res, data);
  } catch (error) {
    console.error('[USUARIOS GET ERROR]', error);
    throw error;
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await prisma.usuario.findUnique({ where: { id: req.params.id }, include: { empresa: true, subusuarios: true } });
    if (!data) return fail(res, 404, 'Usuário não encontrado.');
    return ok(res, data);
  } catch (error) {
    console.error('[USUARIOS GET BY ID ERROR]', error);
    throw error;
  }
});

router.post('/', async (req, res) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return fail(res, 400, 'Payload inválido.', parsed.error.flatten());

    if (parsed.data.tipoUsuario === 'SUBUSUARIO' && !parsed.data.usuarioPaiId && !parsed.data.empresaId) {
      return fail(res, 400, 'Subusuário deve estar vinculado a usuário principal ou empresa.');
    }

    const senhaHash = await bcrypt.hash(parsed.data.senha || '123456', 10);

    const data = await prisma.usuario.create({
      data: {
        empresaId: parsed.data.empresaId,
        usuarioPaiId: parsed.data.usuarioPaiId,
        nome: parsed.data.nome,
        email: parsed.data.email,
        telefone: parsed.data.telefone,
        senhaHash,
        perfil: parsed.data.perfil,
        tipoUsuario: parsed.data.tipoUsuario,
        status: parsed.data.status || 'ATIVO',
        setor: parsed.data.setor,
      },
    });

    return created(res, data);
  } catch (error) {
    console.error('[USUARIOS POST ERROR]', error);
    if (error.code === 'P2002') {
      return fail(res, 409, 'Este email já está cadastrado.');
    }
    throw error;
  }
});

router.put('/:id', async (req, res) => {
  try {
    const parsed = schema.partial().safeParse(req.body);
    if (!parsed.success) return fail(res, 400, 'Payload inválido.', parsed.error.flatten());

    const dataToUpdate = { ...parsed.data };
    delete dataToUpdate.senha;

    if (parsed.data.senha) {
      dataToUpdate.senhaHash = await bcrypt.hash(parsed.data.senha, 10);
    }

    const data = await prisma.usuario.update({
      where: { id: req.params.id },
      data: dataToUpdate,
    });

    return ok(res, data, 'Usuário atualizado com sucesso.');
  } catch (error) {
    console.error('[USUARIOS PUT ERROR]', error);
    if (error.code === 'P2002') {
      return fail(res, 409, 'Este email já está cadastrado.');
    }
    if (error.code === 'P2025') {
      return fail(res, 404, 'Usuário não encontrado.');
    }
    throw error;
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const parsed = z.object({ status: z.enum(['ATIVO', 'INATIVO', 'PENDENTE', 'BLOQUEADO', 'ARQUIVADO']) }).safeParse(req.body);
    if (!parsed.success) return fail(res, 400, 'Status inválido.');

    const data = await prisma.usuario.update({
      where: { id: req.params.id },
      data: { status: parsed.data.status },
    });

    return ok(res, data, 'Status do usuário atualizado.');
  } catch (error) {
    console.error('[USUARIOS PATCH STATUS ERROR]', error);
    if (error.code === 'P2025') {
      return fail(res, 404, 'Usuário não encontrado.');
    }
    throw error;
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const data = await prisma.usuario.update({
      where: { id: req.params.id },
      data: { status: 'INATIVO' },
    });

    return ok(res, data, 'Usuário desativado logicamente.');
  } catch (error) {
    console.error('[USUARIOS DELETE ERROR]', error);
    if (error.code === 'P2025') {
      return fail(res, 404, 'Usuário não encontrado.');
    }
    throw error;
  }
});

router.post('/:id/foto', upload.single('foto'), async (req, res) => {
  try {
    if (!req.file) {
      return fail(res, 400, 'Arquivo de imagem é obrigatório.');
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: req.params.id },
    });

    if (!usuario) {
      if (req.file) fs.unlinkSync(req.file.path);
      return fail(res, 404, 'Usuário não encontrado.');
    }

    // Deletar foto anterior se existir
    if (usuario.fotoPerfil) {
      const oldPath = path.join(__dirname, '../../uploads', usuario.fotoPerfil);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const fotoPerfil = `fotos/${req.file.filename}`;

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: req.params.id },
      data: { fotoPerfil },
    });

    return ok(res, usuarioAtualizado, 'Foto de perfil atualizada com sucesso.');
  } catch (error) {
    console.error('[FOTO PERFIL ERROR]', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return fail(res, 500, 'Erro ao fazer upload da foto.');
  }
});

export default router;
