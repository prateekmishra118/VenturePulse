import path from 'node:path';
import dotenv from 'dotenv';

// Load environment variables from the repo-root .env file (see
// VenturePulse/.env.example for every variable this project expects).
// This runs as soon as config/env.ts is first imported, so it must be
// the very first project import in server.ts.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

type NodeEnv = 'development' | 'test' | 'production';

interface AppConfig {
  nodeEnv: NodeEnv;
  isProduction: boolean;
  port: number;
  clientUrl: string;
  databaseUrl: string | undefined;
  jwtSecret: string | undefined;
  openAiApiKey: string | undefined;
  /** Base URL for the OpenAI-compatible chat completions API. */
  openAiBaseUrl: string;
  /** Model name to request — override for a different provider/model. */
  openAiModel: string;
}

function readNodeEnv(): NodeEnv {
  const raw = process.env.NODE_ENV;
  if (raw === 'production' || raw === 'test') return raw;
  return 'development';
}

function readPort(): number {
  const raw = process.env.PORT;
  const parsed = raw ? Number(raw) : NaN;
  if (!raw || Number.isNaN(parsed)) {
    return 4000;
  }
  return parsed;
}

export const config: AppConfig = {
  nodeEnv: readNodeEnv(),
  isProduction: readNodeEnv() === 'production',
  port: readPort(),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || undefined,
  jwtSecret: process.env.JWT_SECRET || undefined,
  openAiApiKey: process.env.OPENAI_API_KEY || undefined,
   // Strip trailing slashes so "…/openai/" and "…/openai" both work.
  openAiBaseUrl: (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, ''),
  openAiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini'
};

/**
 * Warn (don't crash) about env vars a feature needs but that aren't set.
 * The app still boots without them — routes that actually need the
 * missing piece fail with a clear 500/503 ApiError when called, instead
 * of the whole server refusing to start.
 */
export function logConfigWarnings(): void {
  if (!config.databaseUrl) {
    console.warn('⚠️  DATABASE_URL is not set — DB-backed routes will fail.');
  }
  if (!config.jwtSecret) {
    console.warn('⚠️  JWT_SECRET is not set — auth routes will fail.');
  }
  if (!config.openAiApiKey) {
    console.warn('⚠️  OPENAI_API_KEY is not set — analysis/AI routes will fail.');
  }
}
