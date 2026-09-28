import type { JwtPayload } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      /** Populated by middleware/auth.ts after a valid Bearer token. */
      user?: JwtPayload;
    }
  }
}

export {};
