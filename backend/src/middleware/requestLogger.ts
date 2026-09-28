import morgan from 'morgan';
import type { RequestHandler } from 'express';
import { config } from '../config/env';

/**
 * Human-readable request logs in development ("GET /api/health 200 3ms"),
 * and a leaner combined-style log in production suitable for log
 * aggregation. Skipped entirely in tests to keep test output clean.
 */
export function requestLogger(): RequestHandler {
  if (config.nodeEnv === 'test') {
    return (_req, _res, next) => next();
  }

  return morgan(config.isProduction ? 'combined' : 'dev');
}
