import { Router } from 'express';
import authRoutes from './auth.routes.js';
import empresasRoutes from './empresas.routes.js';
import usuariosRoutes from './usuarios.routes.js';
import projetosRoutes from './projetos.routes.js';
import demandasRoutes from './demandas.routes.js';
import evidenciasRoutes from './evidencias.routes.js';
import comentariosRoutes from './comentarios.routes.js';
import notificacoesRoutes from './notificacoes.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import tecnicosRoutes from './tecnicos.routes.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/health', async (req, res) => {
  res.status(200).json({ success: true, message: 'API Nexus online' });
});

router.use('/auth', authRoutes);

router.use(authenticate);
router.use('/dashboard', dashboardRoutes);
router.use('/empresas', empresasRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/projetos', projetosRoutes);
router.use('/demandas', demandasRoutes);
router.use('/evidencias', evidenciasRoutes);
router.use('/comentarios', comentariosRoutes);
router.use('/notificacoes', notificacoesRoutes);
router.use('/tecnicos', tecnicosRoutes);

export default router;
