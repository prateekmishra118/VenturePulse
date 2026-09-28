import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import ideaRoutes from './idea.routes';
import analysisRoutes from './analysis.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/ideas', ideaRoutes);
router.use('/analyses', analysisRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
