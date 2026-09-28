import { rateLimit, type Options } from 'express-rate-limit';
import { sendError } from '../utils/apiResponse';

/**
 * General-purpose limiter applied to all /api/* routes. Generous enough
 * not to bother normal usage, but stops naive abuse/scripted hammering.
 */
export const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 300,
  message: 'Too many requests from this IP. Please try again later.'
});

interface RateLimiterOptions {
  windowMs: number;
  limit: number;
  message: string;
}

export function createRateLimiter(options: RateLimiterOptions): ReturnType<typeof rateLimit> {
  const config: Partial<Options> = {
    windowMs: options.windowMs,
    limit: options.limit,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      sendError(res, options.message, 429);
    }
  };

  return rateLimit(config);
}
