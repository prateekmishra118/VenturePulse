import { Router } from 'express';
import { getHealth } from '../controllers/health.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// GET /api/health
router.get('/', asyncHandler(getHealth));

export default router;
