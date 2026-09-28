import type { NextFunction, Request, Response } from 'express';
import { config } from '../config/env';
import { sendError } from '../utils/apiResponse';

/**
 * Throw this from anywhere in the app (controllers, services, validators)
 * to produce a specific, intentional HTTP error. Anything else that gets
 * thrown (a bug, a driver error, etc.) is treated as an unexpected 500 by
 * the error handler below.
 *
 * Example:
 *   throw new ApiError(404, 'Startup idea not found.');
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors?: Array<{ field: string; message: string }>;

  constructor(statusCode: number, message: string, errors?: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace?.(this, ApiError);
  }
}

/**
 * Catches requests to unmatched /api/* routes and returns JSON (never
 * the default Express HTML 404 page). Must be mounted after all real
 * routes and before errorHandler.
 */
export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, `API route not found: ${req.method} ${req.originalUrl}`, 404);
}

/**
 * Single place where every thrown/rejected error in the app ends up.
 * Must be registered LAST, after all routes and other middleware.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    sendError(res, err.message, err.statusCode, err.errors);
    return;
  }

  // Some built-in Express/body-parser errors (e.g. "request entity too
  // large" from express.json()) carry a valid HTTP status on the error
  // object itself. Honor it instead of treating every non-ApiError as an
  // unexpected 500.
  const status = getKnownHttpStatus(err);
  if (status) {
    sendError(res, err instanceof Error ? err.message : 'Request error.', status);
    return;
  }

  // Anything else is genuinely unexpected — log the real error
  // server-side, but never leak internals (stack traces, driver messages)
  // to the client.
  console.error('Unhandled error:', err);

  const message = config.isProduction
    ? 'An unexpected server error occurred.'
    : err instanceof Error
      ? err.message
      : 'An unexpected server error occurred.';

  sendError(res, message, 500);
}

/**
 * Several npm middleware packages (body-parser included) throw plain
 * Error objects with a `.status` or `.statusCode` property rather than a
 * custom error class. Recognize those in the 4xx range only — a stray
 * `.status` on an unrelated error should never accidentally mask a bug
 * as a client error.
 */
function getKnownHttpStatus(err: unknown): number | undefined {
  if (typeof err !== 'object' || err === null) return undefined;

  const candidate =
    ('status' in err && typeof (err as { status?: unknown }).status === 'number'
      ? (err as { status: number }).status
      : undefined) ??
    ('statusCode' in err && typeof (err as { statusCode?: unknown }).statusCode === 'number'
      ? (err as { statusCode: number }).statusCode
      : undefined);

  if (candidate && candidate >= 400 && candidate < 500) {
    return candidate;
  }

  return undefined;
}
