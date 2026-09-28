import { PrismaClient } from '@prisma/client';
import { config } from '../config/env';

/**
 * A single shared PrismaClient instance for the whole app.
 *
 * Why the globalThis caching: in development, `tsx watch` re-executes
 * this module on every file change. Without caching the client on
 * `globalThis`, each reload would create a brand new PrismaClient (and
 * therefore a brand new connection pool) without closing the old one,
 * quickly exhausting Postgres's connection limit. In production there's
 * only ever one process, so this just becomes a plain singleton.
 */
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.__prisma ??
  new PrismaClient({
    log: config.isProduction ? ['error', 'warn'] : ['warn', 'error']
  });

if (!config.isProduction) {
  global.__prisma = prisma;
}

/**
 * Runs a trivial query to confirm the database is reachable. Used by the
 * health check and at server startup — never throws, so a missing/down
 * database doesn't crash the whole API (it just can't serve DB-backed
 * routes until it's back).
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (err) {
    console.error('Database connection check failed:', err instanceof Error ? err.message : err);
    return false;
  }
}

/**
 * Closes the Prisma connection pool gracefully. Call on process shutdown.
 */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
