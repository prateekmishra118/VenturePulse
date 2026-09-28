import { Router } from 'express';
import * as ideaController from '../controllers/idea.controller';
import * as analysisController from '../controllers/analysis.controller';
import { createIdeaSchema, ideaIdParamsSchema } from '../validators/idea.validators';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { createRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(requireAuth);

const analyzeLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  message: 'Too many analysis requests this hour. Please try again later.'
});

// POST /api/ideas
router.post('/', validate(createIdeaSchema), asyncHandler(ideaController.createIdea));

// GET /api/ideas
router.get('/', asyncHandler(ideaController.listIdeas));

// GET /api/ideas/:id
router.get('/:id', validate(ideaIdParamsSchema, 'params'), asyncHandler(ideaController.getIdea));

// DELETE /api/ideas/:id
router.delete('/:id', validate(ideaIdParamsSchema, 'params'), asyncHandler(ideaController.deleteIdea));

// POST /api/ideas/:id/analyze
router.post(
  '/:id/analyze',
  validate(ideaIdParamsSchema, 'params'),
  analyzeLimiter,
  asyncHandler(analysisController.analyzeIdea)
);

export default router;
