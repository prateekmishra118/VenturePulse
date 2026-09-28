import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { ApiError } from '../middleware/errorHandler';

export interface JwtPayload {
  userId: string;
  email: string;
}

const TOKEN_EXPIRY = '7d';

/**
 * Signs a JWT for the given user. Throws a clear 500 ApiError (rather
 * than a raw jsonwebtoken error) if JWT_SECRET isn't configured — this
 * only happens if someone tries to log in/register before setting up
 * the .env, which config/env.ts already warns about at boot.
 */
export function signToken(payload: JwtPayload): string {
  if (!config.jwtSecret) {
    throw new ApiError(500, 'Server is not configured for authentication (JWT_SECRET is missing).');
  }
  return jwt.sign(payload, config.jwtSecret, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verifies a JWT and returns its payload. Throws ApiError(401) for any
 * failure (expired, malformed, wrong signature) — callers never need to
 * distinguish the reason, the client just needs to log in again.
 */
export function verifyToken(token: string): JwtPayload {
  if (!config.jwtSecret) {
    throw new ApiError(500, 'Server is not configured for authentication (JWT_SECRET is missing).');
  }
  try {
    return jwt.verify(token, config.jwtSecret) as JwtPayload;
  } catch {
    throw new ApiError(401, 'Invalid or expired session. Please log in again.');
  }
}
