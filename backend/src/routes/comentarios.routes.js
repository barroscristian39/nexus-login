import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { created, fail, ok } from '../utils/response.js';

const router = Router();

const schema = z.object({
  usuarioId: z.string(),
  projetoId: z.string().nullable().optional(),
  demandaId: z.string().nullable().optional(),
  texto: z.string().min(1),
});

router.get('/', async (req, res) => {
  const where = {};
  if (req.query.projetoId) where.projetoId = String(req.query.projetoId);
  if (req.query.demandaId) where.demandaId = String(req.query.demandaId);

  const data = await prisma.comentario.findMany({
    where,
    include: { usuario: true },
    orderBy: { createdAt: 'desc' },
  });

  return ok(res, data);
});

router.get('/:id', async (req, res) => {
  const data = await prisma.comentario.findUnique({ where: { id: req.params.id }, include: { usuario: true } });
  if (!data) return fail(res, 404, 'Comentário não encontrado.');
  return ok(res, data);
});

router.post('/', async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Payload inválido.', parsed.error.flatten());
  const data = await prisma.comentario.create({ data: parsed.data });
  return created(res, data);
});

router.put('/:id', async (req, res) => {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Payload inválido.', parsed.error.flatten());
  const data = await prisma.comentario.update({ where: { id: req.params.id }, data: parsed.data });
  return ok(res, data, 'Comentário atualizado com sucesso.');
});

router.delete('/:id', async (req, res) => {
  const data = await prisma.comentario.delete({ where: { id: req.params.id } });
  return ok(res, data, 'Comentário excluído.');
});

export default router;
