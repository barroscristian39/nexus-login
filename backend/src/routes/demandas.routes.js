import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { created, fail, ok } from '../utils/response.js';

const router = Router();

const schema = z.object({
  empresaId: z.string(),
  projetoId: z.string().nullable().optional(),
  titulo: z.string().min(2),
  descricao: z.string().min(2),
  responsavelId: z.string().nullable().optional(),
  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA']).optional(),
  status: z.enum(['ABERTA', 'EM_ANDAMENTO', 'EM_REVISAO', 'CONCLUIDA', 'ATRASADA', 'BLOQUEADA']).optional(),
  progresso: z.number().int().min(0).max(100).optional(),
  vencimento: z.string().datetime().nullable().optional(),
});

async function criarNotificacaoStatusDemanda(demanda) {
  if (!demanda.responsavelId) return;
  await prisma.notificacao.create({
    data: {
      usuarioId: demanda.responsavelId,
      tipo: 'Demanda',
      titulo: `Demanda ${demanda.titulo} atualizada`,
      descricao: `Status alterado para ${demanda.status}.`,
      link: '/demandas',
    },
  });
}

router.get('/', async (req, res) => {
  const data = await prisma.demanda.findMany({
    include: { empresa: true, projeto: true, responsavel: true },
    orderBy: { createdAt: 'desc' },
  });
  return ok(res, data);
});

router.get('/:id', async (req, res) => {
  const data = await prisma.demanda.findUnique({ where: { id: req.params.id }, include: { evidencias: true, comentarios: true } });
  if (!data) return fail(res, 404, 'Demanda não encontrada.');
  return ok(res, data);
});

router.post('/', async (req, res) => {
  console.log('[POST /demandas] Iniciando...');
  console.log('[POST /demandas] Body:', req.body);
  
  const parsed = schema.safeParse(req.body);
  console.log('[POST /demandas] Validação Zod:', parsed.success);
  
  if (!parsed.success) {
    console.log('[POST /demandas] Erro de validação:', parsed.error.flatten());
    return fail(res, 400, 'Payload inválido.', parsed.error.flatten());
  }

  try {
    console.log('[POST /demandas] Criando demanda no banco...');
    const data = await prisma.demanda.create({
      data: {
        ...parsed.data,
        prioridade: parsed.data.prioridade || 'MEDIA',
        status: parsed.data.status || 'ABERTA',
        progresso: parsed.data.progresso ?? 0,
        vencimento: parsed.data.vencimento ? new Date(parsed.data.vencimento) : null,
      },
    });

    console.log('[POST /demandas] Demanda criada:', data.id);
    await criarNotificacaoStatusDemanda(data);
    console.log('[POST /demandas] Notificação criada');
    return created(res, data);
  } catch (err) {
    console.error('[POST /demandas] Error:', err.message);
    if (err.code === 'P2003') {
      return fail(res, 400, 'Empresa não encontrada. O empresaId informado é inválido.');
    }
    throw err;
  }
});

router.put('/:id', async (req, res) => {
  try {
    const parsed = schema.partial().safeParse(req.body);
    if (!parsed.success) return fail(res, 400, 'Payload inválido.', parsed.error.flatten());

    const data = await prisma.demanda.update({
      where: { id: req.params.id },
      data: {
        ...parsed.data,
        vencimento: parsed.data.vencimento ? new Date(parsed.data.vencimento) : undefined,
      },
    });

    if (parsed.data.status) await criarNotificacaoStatusDemanda(data);
    return ok(res, data, 'Demanda atualizada com sucesso.');
  } catch (error) {
    console.error('[DEMANDAS PUT ERROR]', error);
    if (error.code === 'P2025') {
      return fail(res, 404, 'Demanda não encontrada.');
    }
    throw error;
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const parsed = z.object({ status: z.enum(['ABERTA', 'EM_ANDAMENTO', 'EM_REVISAO', 'CONCLUIDA', 'ATRASADA', 'BLOQUEADA']) }).safeParse(req.body);
    if (!parsed.success) return fail(res, 400, 'Status inválido.');

    const data = await prisma.demanda.update({
      where: { id: req.params.id },
      data: { status: parsed.data.status },
    });

    await criarNotificacaoStatusDemanda(data);
    return ok(res, data, 'Status da demanda atualizado.');
  } catch (error) {
    console.error('[DEMANDAS PATCH STATUS ERROR]', error);
    if (error.code === 'P2025') {
      return fail(res, 404, 'Demanda não encontrada.');
    }
    throw error;
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const data = await prisma.demanda.delete({ where: { id: req.params.id } });
    return ok(res, data, 'Demanda excluída.');
  } catch (error) {
    console.error('[DEMANDAS DELETE ERROR]', error);
    if (error.code === 'P2025') {
      return fail(res, 404, 'Demanda não encontrada.');
    }
    throw error;
  }
});;

export default router;
