import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { created, fail, ok } from '../utils/response.js';

const router = Router();

const schema = z.object({
  usuarioId: z.string(),
  tipo: z.string().min(2),
  titulo: z.string().min(2),
  descricao: z.string().min(2),
  lida: z.boolean().optional(),
  link: z.string().nullable().optional(),
});

router.get('/', async (req, res) => {
  const where = {};
  if (req.query.usuarioId) where.usuarioId = String(req.query.usuarioId);
  if (req.query.lida !== undefined) where.lida = req.query.lida === 'true';

  const data = await prisma.notificacao.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return ok(res, data);
});

router.get('/:id', async (req, res) => {
  const data = await prisma.notificacao.findUnique({ where: { id: req.params.id } });
  if (!data) return fail(res, 404, 'Notificação não encontrada.');
  return ok(res, data);
});

router.post('/', async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Payload inválido.', parsed.error.flatten());
  const data = await prisma.notificacao.create({ data: { ...parsed.data, lida: parsed.data.lida ?? false } });
  return created(res, data);
});

router.patch('/:id/lida', async (req, res) => {
  const parsed = z.object({ lida: z.boolean() }).safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Campo lida inválido.');
  const data = await prisma.notificacao.update({ where: { id: req.params.id }, data: { lida: parsed.data.lida } });
  return ok(res, data, 'Notificação atualizada.');
});

router.put('/:id', async (req, res) => {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Payload inválido.', parsed.error.flatten());
  const data = await prisma.notificacao.update({ where: { id: req.params.id }, data: parsed.data });
  return ok(res, data, 'Notificação atualizada.');
});

router.delete('/:id', async (req, res) => {
  const data = await prisma.notificacao.delete({ where: { id: req.params.id } });
  return ok(res, data, 'Notificação excluída.');
});

export default router;
