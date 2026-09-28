import { config } from '../config/env';
import { ApiError } from '../middleware/errorHandler';

interface ChatMessage {
  role: 'system' | 'user';
  content: string;
}

interface CallOptions {
  temperature?: number;
}

const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);
const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [2000, 5000];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calls the configured OpenAI-compatible chat completions endpoint and
 * returns the raw text content of the response. Works with OpenAI,
 * Gemini's OpenAI-compatible endpoint, Groq, OpenRouter, etc.
 *
 * Temporary provider problems (429, 5xx, network blips) are retried up
 * to 3 times with a short delay. Permanent problems (bad key, wrong
 * model) fail immediately, since retrying can't fix them.
 *
 * This is the ONLY place in the codebase that talks to the AI provider.
 */
export async function callChatCompletion(messages: ChatMessage[], options: CallOptions = {}): Promise<string> {
  if (!config.openAiApiKey) {
    throw new ApiError(503, 'AI features are not configured on this server (OPENAI_API_KEY is missing).');
  }

  const url = `${config.openAiBaseUrl}/chat/completions`;
  const requestBody = JSON.stringify({
    model: config.openAiModel,
    messages,
    temperature: options.temperature ?? 0.4,
    response_format: { type: 'json_object' }
  });

  let response: Response | undefined;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.openAiApiKey}`
        },
        body: requestBody
      });
    } catch {
      if (attempt === MAX_ATTEMPTS) {
        throw new ApiError(503, 'Could not reach the AI provider. Please try again shortly.');
      }
      await sleep(RETRY_DELAYS_MS[attempt - 1]);
      continue;
    }

    if (response.ok) break;

    // Transient provider problems (overloaded, rate limited, server error):
    // wait and try again instead of failing the whole analysis.
    if (RETRYABLE_STATUSES.has(response.status) && attempt < MAX_ATTEMPTS) {
      console.warn(`AI provider returned ${response.status}; retrying (attempt ${attempt}/${MAX_ATTEMPTS})...`);
      await sleep(RETRY_DELAYS_MS[attempt - 1]);
      continue;
    }

    break;
  }

  if (!response) {
    throw new ApiError(503, 'Could not reach the AI provider. Please try again shortly.');
  }

  if (!response.ok) {
    // Log the provider's own error body server-side so the real cause
    // (bad model name, invalid key, no quota) is visible in the terminal.
    const providerBody = await response.text().catch(() => '');
    console.error(
      `AI provider error ${response.status} from ${url} (model: ${config.openAiModel}):`,
      providerBody.slice(0, 800)
    );

    if (response.status === 401 || response.status === 403) {
      throw new ApiError(502, 'The AI provider rejected the API key. Check OPENAI_API_KEY.');
    }
    if (response.status === 404) {
      throw new ApiError(502, 'The AI provider could not find that endpoint or model. Check OPENAI_BASE_URL and OPENAI_MODEL.');
    }
    if (response.status === 429) {
      throw new ApiError(503, 'The AI provider is rate-limiting or out of quota. Wait a moment, or check your plan/billing.');
    }
    if (response.status === 503) {
      throw new ApiError(503, 'The AI provider is temporarily overloaded. Please try again in a minute.');
    }
    throw new ApiError(502, `AI provider returned an error (status ${response.status}).`);
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new ApiError(502, 'AI provider returned a response that was not valid JSON.');
  }

  const content = extractContent(data);
  if (!content) {
    throw new ApiError(502, 'AI provider returned an empty response.');
  }

  return content;
}

function extractContent(data: unknown): string | undefined {
  if (typeof data !== 'object' || data === null) return undefined;
  const choices = (data as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return undefined;
  const message = (choices[0] as { message?: unknown }).message;
  if (typeof message !== 'object' || message === null) return undefined;
  const content = (message as { content?: unknown }).content;
  return typeof content === 'string' ? content : undefined;
}