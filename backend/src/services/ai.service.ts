import type { ZodType, z } from 'zod';
import { callChatCompletion } from '../ai/aiClient';
import { ApiError } from '../middleware/errorHandler';

/**
 * Calls the AI with the given prompt, parses the response as JSON, and
 * validates it against `schema`. If parsing or validation fails, retries
 * once with an extra instruction pointing out the problem — this is the
 * "retry when appropriate" behavior required by the spec. If it fails
 * again, throws a clear ApiError instead of ever passing unvalidated
 * data further into the app.
 */
export async function callAiWithSchema<T extends ZodType>(
  system: string,
  user: string,
  schema: T
): Promise<z.infer<T>> {
  const attempt = async (extraInstruction?: string): Promise<z.infer<T>> => {
    const messages: Array<{ role: 'system' | 'user'; content: string }> = [
      { role: 'system' as const, content: system },
      { role: 'user' as const, content: extraInstruction ? `${user}\n\n${extraInstruction}` : user }
    ];

    const raw = await callChatCompletion(messages);

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new InvalidAiJsonError('AI response was not valid JSON.');
    }

    const result = schema.safeParse(parsed);
    if (!result.success) {
      const issues = result.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`).join('; ');
      throw new InvalidAiJsonError(`AI response did not match the expected schema: ${issues}`);
    }

    return result.data;
  };

  try {
    return await attempt();
  } catch (err) {
    if (!(err instanceof InvalidAiJsonError)) {
      throw err; // network/provider errors from aiClient are not retried here
    }

    console.warn('AI response failed validation, retrying once:', err.message);

    try {
      return await attempt(
        `Your previous response was invalid: ${err.message}. Respond again with ONLY a single valid JSON object matching the required schema exactly.`
      );
    } catch (retryErr) {
      console.error('AI response failed validation on retry:', retryErr);
      throw new ApiError(502, 'The AI returned an unusable response after a retry. Please try again.');
    }
  }
}

class InvalidAiJsonError extends Error {}
