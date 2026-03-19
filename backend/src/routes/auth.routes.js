import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { fail, ok } from '../utils/response.js';
import { signToken } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'nexus-dev-secret';

const loginSchema = z.object({
  email: z.string().min(3),
  senha: z.string().min(6),
});

router.post('/login', async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return fail(res, 400, 'Payload inválido.', parsed.error.flatten());
    }

    const { email, senha } = parsed.data;

    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: email.includes('@')
          ? [{ email }]
          : [{ email: { startsWith: `${email}@` } }, { nome: { contains: email, mode: 'insensitive' } }],
      },
      include: { empresa: true },
    });

    if (!usuario) {
      return fail(res, 401, 'Credenciais inválidas.');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
      return fail(res, 401, 'Credenciais inválidas.');
    }

    if (usuario.status !== 'ATIVO') {
      return fail(res, 403, 'Usuário inativo ou bloqueado.');
    }

    if (usuario.empresa && usuario.empresa.status !== 'ATIVO') {
      return fail(res, 403, 'Empresa desativada. Acesso bloqueado.');
    }

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoAcesso: new Date() },
    });

    const token = signToken({
      id: usuario.id,
      perfil: usuario.perfil,
      empresaId: usuario.empresaId,
      tipoUsuario: usuario.tipoUsuario,
    });

    return ok(res, {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
        empresaId: usuario.empresaId,
        tipoUsuario: usuario.tipoUsuario,
      },
    }, 'Login realizado com sucesso.');
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    return fail(res, 500, 'Erro ao processar login. Tente novamente.');
  }
});

router.get('/me', async (req, res) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return fail(res, 401, 'Token ausente.');
  }

  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const usuario = await prisma.usuario.findUnique({
      where: { id: payload.id },
      include: { empresa: true },
    });

    if (!usuario) return fail(res, 404, 'Usuário não encontrado.');
    return ok(res, usuario);
  } catch {
    return fail(res, 401, 'Token inválido.');
  }
});

export default router;
