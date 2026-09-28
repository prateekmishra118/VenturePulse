import { Router } from 'express';
import * as analysisController from '../controllers/analysis.controller';
import { ideaIdParamsSchema } from '../validators/idea.validators';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { createRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(requireAuth);

const aiActionLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  message: 'Too many requests this hour. Please try again later.'
});

// GET /api/analyses/:id
router.get('/:id', validate(ideaIdParamsSchema, 'params'), asyncHandler(analysisController.getAnalysis));

// POST /api/analyses/:id/improve
router.post(
  '/:id/improve',
  validate(ideaIdParamsSchema, 'params'),
  aiActionLimiter,
  asyncHandler(analysisController.improveIdea)
);

// POST /api/analyses/:id/mvp
router.post(
  '/:id/mvp',
  validate(ideaIdParamsSchema, 'params'),
  aiActionLimiter,
  asyncHandler(analysisController.generateMvp)
);

// POST /api/analyses/:id/experiments
router.post(
  '/:id/experiments',
  validate(ideaIdParamsSchema, 'params'),
  aiActionLimiter,
  asyncHandler(analysisController.generateExperiments)
);

// POST /api/analyses/:id/report — no AI call, so no AI rate limit needed
router.post('/:id/report', validate(ideaIdParamsSchema, 'params'), asyncHandler(analysisController.generateReport));

export default router;
