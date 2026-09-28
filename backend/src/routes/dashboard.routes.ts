import { Router } from 'express';
import { getDashboard } from '../controllers/dashboard.controller';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// GET /api/dashboard
router.get('/', requireAuth, asyncHandler(getDashboard));

export default router;
