import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { created, fail, ok } from '../utils/response.js';

const router = Router();

const schemaTecnico = z.object({
  usuarioId: z.string(),
  especialidade: z.string().nullable().optional(),
  certificacoes: z.string().nullable().optional(),
  disponivel: z.boolean().optional(),
});

// GET - Listar todos os técnicos
router.get('/', async (req, res) => {
  try {
    const data = await prisma.tecnicoResponsavel.findMany({
      include: { usuario: true },
      orderBy: { createdAt: 'desc' },
    });
    return ok(res, data);
  } catch (err) {
    console.error('[TECNICOS GET ERROR]', err);
    throw err;
  }
});

// GET - Listar técnicos disponíveis
router.get('/disponivel/lista', async (req, res) => {
  try {
    const data = await prisma.tecnicoResponsavel.findMany({
      where: { disponivel: true },
      include: { usuario: true },
      orderBy: { usuario: { nome: 'asc' } },
    });
    return ok(res, data);
  } catch (err) {
    console.error('[TECNICOS DISPONIVEL GET ERROR]', err);
    throw err;
  }
});

// GET - Buscar técnico por ID
router.get('/:id', async (req, res) => {
  try {
    const data = await prisma.tecnicoResponsavel.findUnique({
      where: { id: req.params.id },
      include: { usuario: true },
    });
    if (!data) return fail(res, 404, 'Técnico não encontrado.');
    return ok(res, data);
  } catch (err) {
    console.error('[TECNICO GET BY ID ERROR]', err);
    throw err;
  }
});

// POST - Registrar novo técnico
router.post('/', async (req, res) => {
  try {
    console.log('[TECNICO POST] Body:', req.body);
    
    const parsed = schemaTecnico.safeParse(req.body);
    if (!parsed.success) {
      console.log('[TECNICO POST ERROR] Validação falhou:', parsed.error.flatten());
      return fail(res, 400, 'Payload inválido.', parsed.error.flatten());
    }

    // Verificar se usuário existe
    const usuarioExiste = await prisma.usuario.findUnique({
      where: { id: parsed.data.usuarioId },
    });
    if (!usuarioExiste) {
      return fail(res, 404, 'Usuário não encontrado.');
    }

    // Verificar se já é técnico
    const jaTecnico = await prisma.tecnicoResponsavel.findUnique({
      where: { usuarioId: parsed.data.usuarioId },
    });
    if (jaTecnico) {
      return fail(res, 400, 'Este usuário já está registrado como técnico.');
    }

    const data = await prisma.tecnicoResponsavel.create({
      data: {
        ...parsed.data,
      },
      include: { usuario: true },
    });

    console.log('[TECNICO POST SUCCESS]', data.id);
    return created(res, data);
  } catch (err) {
    console.error('[TECNICO POST CATCH ERROR]', err);
    throw err;
  }
});

// PUT - Atualizar técnico
router.put('/:id', async (req, res) => {
  try {
    console.log('[TECNICO PUT] ID:', req.params.id, 'Body:', req.body);
    
    const parsed = schemaTecnico.partial().safeParse(req.body);
    if (!parsed.success) {
      return fail(res, 400, 'Payload inválido.', parsed.error.flatten());
    }

    const data = await prisma.tecnicoResponsavel.update({
      where: { id: req.params.id },
      data: parsed.data,
      include: { usuario: true },
    });

    console.log('[TECNICO PUT SUCCESS]', data.id);
    return ok(res, data, 'Técnico atualizado com sucesso.');
  } catch (err) {
    console.error('[TECNICO PUT ERROR]', err);
    if (err.code === 'P2025') {
      return fail(res, 404, 'Técnico não encontrado.');
    }
    throw err;
  }
});

// DELETE - Removar técnico
router.delete('/:id', async (req, res) => {
  try {
    console.log('[TECNICO DELETE] ID:', req.params.id);
    
    const data = await prisma.tecnicoResponsavel.delete({
      where: { id: req.params.id },
      include: { usuario: true },
    });

    console.log('[TECNICO DELETE SUCCESS]', data.id);
    return ok(res, data, 'Técnico removido com sucesso.');
  } catch (err) {
    console.error('[TECNICO DELETE ERROR]', err);
    if (err.code === 'P2025') {
      return fail(res, 404, 'Técnico não encontrado.');
    }
    throw err;
  }
});

// PATCH - Alterar disponibilidade
router.patch('/:id/disponibilidade', async (req, res) => {
  try {
    const schema = z.object({ disponivel: z.boolean() });
    const parsed = schema.safeParse(req.body);
    
    if (!parsed.success) {
      return fail(res, 400, 'Disponibilidade inválida.');
    }

    const data = await prisma.tecnicoResponsavel.update({
      where: { id: req.params.id },
      data: { disponivel: parsed.data.disponivel },
      include: { usuario: true },
    });

    return ok(res, data, 'Disponibilidade atualizada.');
  } catch (err) {
    console.error('[TECNICO DISPONIBILIDADE ERROR]', err);
    if (err.code === 'P2025') {
      return fail(res, 404, 'Técnico não encontrado.');
    }
    throw err;
  }
});

// PATCH - Atualizar contador de demandas
router.patch('/:id/demandas', async (req, res) => {
  try {
    const schema = z.object({ demandas: z.number().int().min(0) });
    const parsed = schema.safeParse(req.body);
    
    if (!parsed.success) {
      return fail(res, 400, 'Número de demandas inválido.');
    }

    const data = await prisma.tecnicoResponsavel.update({
      where: { id: req.params.id },
      data: { demandas: parsed.data.demandas },
      include: { usuario: true },
    });

    return ok(res, data, 'Demandas atualizado.');
  } catch (err) {
    console.error('[TECNICO DEMANDAS ERROR]', err);
    if (err.code === 'P2025') {
      return fail(res, 404, 'Técnico não encontrado.');
    }
    throw err;
  }
});

export default router;
