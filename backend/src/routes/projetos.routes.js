import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { created, fail, ok } from '../utils/response.js';

const router = Router();

const schema = z.object({
  empresaId: z.string(),
  nome: z.string().min(2),
  descricao: z.string().min(2),
  responsavelId: z.string().nullable().optional(),
  status: z.enum(['PLANEJAMENTO', 'EM_ANDAMENTO', 'EM_REVISAO', 'CONCLUIDO', 'ATRASADO', 'BLOQUEADO']).optional(),
  progresso: z.number().int().min(0).max(100).optional(),
  dataInicio: z.string().datetime().nullable().optional(),
  dataPrevista: z.string().datetime().nullable().optional(),
});

async function criarNotificacaoStatusProjeto(projeto) {
  if (!projeto.responsavelId) return;
  await prisma.notificacao.create({
    data: {
      usuarioId: projeto.responsavelId,
      tipo: 'Projeto',
      titulo: `Projeto ${projeto.nome} atualizado`,
      descricao: `Status alterado para ${projeto.status}.`,
      link: '/projetos',
    },
  });
}

router.get('/', async (req, res) => {
  try {
    const data = await prisma.projeto.findMany({ include: { empresa: true, responsavel: true }, orderBy: { createdAt: 'desc' } });
    return ok(res, data);
  } catch (error) {
    console.error('[PROJETOS GET ERROR]', error);
    throw error;
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await prisma.projeto.findUnique({ where: { id: req.params.id }, include: { demandas: true, evidencias: true, comentarios: true } });
    if (!data) return fail(res, 404, 'Projeto não encontrado.');
    return ok(res, data);
  } catch (error) {
    console.error('[PROJETOS GET BY ID ERROR]', error);
    throw error;
  }
});

router.post('/', async (req, res) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return fail(res, 400, 'Payload inválido.', parsed.error.flatten());
    const data = await prisma.projeto.create({
      data: {
        ...parsed.data,
        dataInicio: parsed.data.dataInicio ? new Date(parsed.data.dataInicio) : null,
        dataPrevista: parsed.data.dataPrevista ? new Date(parsed.data.dataPrevista) : null,
        status: parsed.data.status || 'PLANEJAMENTO',
        progresso: parsed.data.progresso ?? 0,
      },
    });
    await criarNotificacaoStatusProjeto(data);
    return created(res, data);
  } catch (error) {
    console.error('[PROJETOS POST ERROR]', error);
    throw error;
  }
});

router.put('/:id', async (req, res) => {
  try {
    const parsed = schema.partial().safeParse(req.body);
    if (!parsed.success) return fail(res, 400, 'Payload inválido.', parsed.error.flatten());

    const data = await prisma.projeto.update({
      where: { id: req.params.id },
      data: {
        ...parsed.data,
        dataInicio: parsed.data.dataInicio ? new Date(parsed.data.dataInicio) : undefined,
        dataPrevista: parsed.data.dataPrevista ? new Date(parsed.data.dataPrevista) : undefined,
      },
    });

    if (parsed.data.status) await criarNotificacaoStatusProjeto(data);
    return ok(res, data, 'Projeto atualizado com sucesso.');
  } catch (error) {
    console.error('[PROJETOS PUT ERROR]', error);
    if (error.code === 'P2025') {
      return fail(res, 404, 'Projeto não encontrado.');
    }
    throw error;
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const parsed = z.object({ status: z.enum(['PLANEJAMENTO', 'EM_ANDAMENTO', 'EM_REVISAO', 'CONCLUIDO', 'ATRASADO', 'BLOQUEADO']) }).safeParse(req.body);
    if (!parsed.success) return fail(res, 400, 'Status inválido.');

    const data = await prisma.projeto.update({ where: { id: req.params.id }, data: { status: parsed.data.status } });
    await criarNotificacaoStatusProjeto(data);
    return ok(res, data, 'Status do projeto atualizado.');
  } catch (error) {
    console.error('[PROJETOS PATCH STATUS ERROR]', error);
    if (error.code === 'P2025') {
      return fail(res, 404, 'Projeto não encontrado.');
    }
    throw error;
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const data = await prisma.projeto.delete({ where: { id: req.params.id } });
    return ok(res, data, 'Projeto excluído.');
  } catch (error) {
    console.error('[PROJETOS DELETE ERROR]', error);
    if (error.code === 'P2025') {
      return fail(res, 404, 'Projeto não encontrado.');
    }
    throw error;
  }
});

export default router;
