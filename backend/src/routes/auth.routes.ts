import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { registerSchema, loginSchema } from '../validators/auth.validators';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { createRateLimiter } from '../middleware/rateLimiter';

const router = Router();

const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: 'Too many auth attempts from this IP. Please try again later.'
});

// POST /api/auth/register
router.post('/register', authLimiter, validate(registerSchema), asyncHandler(authController.register));

// POST /api/auth/login
router.post('/login', authLimiter, validate(loginSchema), asyncHandler(authController.login));

// GET /api/auth/me
router.get('/me', requireAuth, asyncHandler(authController.me));

export default router;
