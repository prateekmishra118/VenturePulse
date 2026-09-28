import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import { requestLogger } from './middleware/requestLogger';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import apiRouter from './routes';

/**
 * Builds and returns the configured Express application.
 *
 * Kept separate from server.ts so the app can be imported directly by
 * tests (e.g. with Supertest) without actually binding to a port.
 */
export function createApp(): Express {
  const app = express();

  // ---- Security & parsing middleware ----
  app.use(helmet());
  app.use(
    cors({
      origin: config.clientUrl,
      credentials: true
    })
  );
  // Request size limits: reject oversized bodies rather than letting
  // huge payloads reach controllers/AI calls.
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  app.use(requestLogger());

  // ---- API routes ----
  app.use('/api', apiLimiter, apiRouter);

  // ---- 404 handler for unmatched API routes (always JSON, never HTML) ----
  app.use('/api', notFoundHandler);

  // ---- Global error handler (must be registered last) ----
  app.use(errorHandler);

  return app;
}
