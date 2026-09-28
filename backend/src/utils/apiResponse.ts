import type { Response } from 'express';

/**
 * Sends a standardized { success: true, message, data } response.
 * Use this from every controller instead of calling res.json() directly,
 * so the response shape never drifts across routes.
 */
export function sendSuccess<T>(res: Response, data: T, message = 'OK', statusCode = 200): void {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

/**
 * Sends a standardized { success: false, message } response.
 * Prefer throwing ApiError from middleware/errorHandler.ts and letting the
 * global error handler call this, rather than calling it directly from
 * controllers — that keeps error formatting in one place.
 */
export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  errors?: Array<{ field: string; message: string }>
): void {
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {})
  });
}
