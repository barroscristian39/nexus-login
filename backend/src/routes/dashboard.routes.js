import { Router } from 'express';
import { prisma } from '../prisma.js';
import { ok, fail } from '../utils/response.js';

const router = Router();

// Função auxiliar para calcular semanas dos últimos 30 dias
function getWeeksFrom30Days() {
  const today = new Date();
  const weeks = [];
  
  // Voltar até 30 dias
  for (let i = 4; i >= 0; i--) {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - (i * 7));
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    weeks.push({
      label: `S${5 - i}`,
      start: weekStart,
      end: weekEnd,
    });
  }
  
  return weeks;
}

/**
 * GET /dashboard/resumo
 * Retorna todos os dados do dashboard para a empresa do usuário logado
 * Se for MASTER, retorna dados de todas as empresas
 */
router.get('/resumo', async (req, res) => {
  try {
    const usuarioId = req.user?.id;
    const perfil = req.user?.perfil;
    const empresaIdDoToken = req.user?.empresaId;

    let empresaId;

    // Se for MASTER, buscar primeira empresa ou usar null
    if (perfil === 'MASTER') {
      // Master pode ver dados agregados de todas as empresas
      // Neste caso, vamos retornar dados sem filtro de empresa
      empresaId = null;
    } else {
      // Usuário comum - só acessa dados da sua empresa
      const empresa = await prisma.empresa.findFirst({
        where: {
          usuarios: {
            some: { id: usuarioId }
          }
        }
      });

      if (!empresa) {
        return fail(res, 403, 'Empresa não encontrada para este usuário.');
      }

      empresaId = empresa.id;
    }

    // ===============================
    // 1. CARDS KPI
    // ===============================
    const demandasAbertas = await prisma.demanda.count({
      where: {
        ...(empresaId ? { empresaId } : {}),
        status: 'ABERTA'
      }
    });

    const emExecucao = await prisma.demanda.count({
      where: {
        ...(empresaId ? { empresaId } : {}),
        status: 'EM_ANDAMENTO'
      }
    });

    const evidenciasPendentes = await prisma.evidencia.count({
      where: {
        ...(empresaId ? { empresaId } : {}),
        status: 'PENDENTE'
      }
    });

    const bloqueadasAtrasadas = await prisma.demanda.count({
      where: {
        ...(empresaId ? { empresaId } : {}),
        status: {
          in: ['BLOQUEADA', 'ATRASADA']
        }
      }
    });

    const kpis = {
      demandasAbertas,
      emExecucao,
      evidenciasPendentes,
      bloqueadasAtrasadas
    };

    // ===============================
    // 2. FLUXO DE DEMANDAS (últimos 30 dias)
    // ===============================
    const weeks = getWeeksFrom30Days();
    const fluxoDemandas = [];

    for (const week of weeks) {
      const abertas = await prisma.demanda.count({
        where: {
          ...(empresaId ? { empresaId } : {}),
          status: 'ABERTA',
          createdAt: {
            gte: week.start,
            lte: week.end
          }
        }
      });

      const concluidas = await prisma.demanda.count({
        where: {
          ...(empresaId ? { empresaId } : {}),
          status: 'CONCLUIDA',
          updatedAt: {
            gte: week.start,
            lte: week.end
          }
        }
      });

      fluxoDemandas.push({
        semana: week.label,
        abertas,
        concluidas
      });
    }

    // ===============================
    // 3. STATUS DAS DEMANDAS
    // ===============================
    const statuses = ['ABERTA', 'EM_ANDAMENTO', 'EM_REVISAO', 'BLOQUEADA', 'CONCLUIDA'];
    const statusDemandas = [];

    for (const status of statuses) {
      const count = await prisma.demanda.count({
        where: {
          ...(empresaId ? { empresaId } : {}),
          status
        }
      });

      // Mapear status para nomes legíveis
      const statusMap = {
        'ABERTA': 'Aberta',
        'EM_ANDAMENTO': 'Em andamento',
        'EM_REVISAO': 'Em revisão',
        'BLOQUEADA': 'Bloqueada',
        'CONCLUIDA': 'Concluída'
      };

      statusDemandas.push({
        name: statusMap[status],
        value: count
      });
    }

    // ===============================
    // 4. PROGRESSO DOS PROJETOS
    // ===============================
    const projetos = await prisma.projeto.findMany({
      where: {
        ...(empresaId ? { empresaId } : {})
      },
      select: {
        id: true,
        nome: true,
        progresso: true,
        status: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const progressoProjetos = projetos.map(p => ({
      nome: p.nome,
      progresso: p.progresso || 0,
      meta: 100
    }));

    // ===============================
    // 5. DEMANDAS POR ÁREA
    // ===============================
    const demandasPorArea = await prisma.demanda.groupBy({
      by: ['', ], // Precisamos usar raw query pois Demanda não tem campo área
      where: { ...(empresaId ? { empresaId } : {}) },
      _count: true
    }).catch(() => null);

    // Alternativa: pegar responsáveis agrupados por setor
    const demandasComSetor = await prisma.demanda.findMany({
      where: { ...(empresaId ? { empresaId } : {}) },
      include: {
        responsavel: {
          select: { setor: true }
        }
      }
    });

    const setorMap = {};
    demandasComSetor.forEach(demanda => {
      const setor = demanda.responsavel?.setor || 'Sem Setor';
      setorMap[setor] = (setorMap[setor] || 0) + 1;
    });

    const demandasPorAreaFormatted = Object.entries(setorMap).map(([name, value]) => ({
      name,
      value
    }));

    // ===============================
    // RETORNO
    // ===============================
    return ok(res, {
      kpis,
      fluxoDemandas,
      statusDemandas,
      progressoProjetos,
      demandasPorArea: demandasPorAreaFormatted
    });

  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return fail(res, 500, 'Erro ao carregar dashboard.');
  }
});

export default router;
