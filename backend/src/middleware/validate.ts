import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { ApiError } from './errorHandler';

type RequestPart = 'body' | 'query' | 'params';

/**
 * Validates `req[part]` against a Zod schema. On success, replaces
 * `req[part]` with the parsed (and therefore typed + defaulted) value.
 * On failure, throws ApiError(400) with a field-level `errors` array —
 * matching ApiErrorResponse — instead of a raw ZodError.
 *
 * Usage:
 *   router.post('/', validate(createIdeaSchema), asyncHandler(createIdea));
 */
export function validate(schema: ZodType, part: RequestPart = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || part,
        message: issue.message
      }));
      throw new ApiError(400, 'Validation failed.', errors);
    }

    // req.body/query/params are typed as their original Express shape;
    // this intentionally replaces them with the parsed, validated value.
    (req as Record<RequestPart, unknown>)[part] = result.data;
    next();
  };
}
