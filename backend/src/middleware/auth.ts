import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';
import { ApiError } from './errorHandler';

/**
 * Requires a valid `Authorization: Bearer <token>` header. Attaches
 * `req.user = { userId, email }` on success.
 *
 * Every route that reads/writes a specific user's data (ideas, analyses,
 * dashboard, ...) must use this — and every service function called from
 * such a route must filter its Prisma query by `req.user.userId` so one
 * user can never see or touch another's data.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.header('authorization') || req.header('Authorization');

  if (!header || !header.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication required. Include an Authorization: Bearer <token> header.');
  }

  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    throw new ApiError(401, 'Authentication required. Include an Authorization: Bearer <token> header.');
  }

  req.user = verifyToken(token);
  next();
}
