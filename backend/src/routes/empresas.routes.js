import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { created, fail, ok } from '../utils/response.js';

const router = Router();

const schema = z.object({
  nome: z.string().min(2),
  cnpj: z.string().min(8),
  email: z.string().email(),
  telefone: z.string().min(8),
  responsavel: z.string().min(2),
  plano: z.string().min(2),
  status: z.enum(['ATIVO', 'INATIVO', 'PENDENTE', 'BLOQUEADO', 'ARQUIVADO']).optional(),
});

router.get('/', async (req, res) => {
  try {
    const data = await prisma.empresa.findMany({ orderBy: { createdAt: 'desc' } });
    return ok(res, data);
  } catch (error) {
    console.error('[EMPRESAS GET ERROR]', error);
    throw error;
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await prisma.empresa.findUnique({ where: { id: req.params.id } });
    if (!data) return fail(res, 404, 'Empresa não encontrada.');
    return ok(res, data);
  } catch (error) {
    console.error('[EMPRESAS GET BY ID ERROR]', error);
    throw error;
  }
});

router.post('/', async (req, res) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return fail(res, 400, 'Payload inválido.', parsed.error.flatten());
    const data = await prisma.empresa.create({ data: parsed.data });
    return created(res, data);
  } catch (error) {
    console.error('[EMPRESAS POST ERROR]', error);
    if (error.code === 'P2002') {
      return fail(res, 409, 'Este CNPJ já está cadastrado.');
    }
    throw error;
  }
});

router.put('/:id', async (req, res) => {
  try {
    const parsed = schema.partial().safeParse(req.body);
    if (!parsed.success) return fail(res, 400, 'Payload inválido.', parsed.error.flatten());
    const data = await prisma.empresa.update({ where: { id: req.params.id }, data: parsed.data });
    return ok(res, data, 'Empresa atualizada com sucesso.');
  } catch (error) {
    console.error('[EMPRESAS PUT ERROR]', error);
    if (error.code === 'P2025') {
      return fail(res, 404, 'Empresa não encontrada.');
    }
    if (error.code === 'P2002') {
      return fail(res, 409, 'Este CNPJ já está cadastrado.');
    }
    throw error;
  }
});

router.patch('/:id/status', async (req, res) => {
  const parsed = z.object({ status: z.enum(['ATIVO', 'INATIVO', 'PENDENTE', 'BLOQUEADO', 'ARQUIVADO']) }).safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Status inválido.');

  const data = await prisma.empresa.update({
    where: { id: req.params.id },
    data: { status: parsed.data.status },
  });

  if (parsed.data.status !== 'ATIVO') {
    await prisma.usuario.updateMany({
      where: { empresaId: req.params.id },
      data: { status: 'BLOQUEADO' },
    });
  }

  return ok(res, data, 'Status da empresa atualizado.');
});

router.delete('/:id', async (req, res) => {
  const data = await prisma.empresa.update({
    where: { id: req.params.id },
    data: { status: 'INATIVO' },
  });
  await prisma.usuario.updateMany({ where: { empresaId: req.params.id }, data: { status: 'BLOQUEADO' } });
  return ok(res, data, 'Empresa desativada logicamente.');
});

export default router;
