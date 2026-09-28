import { config, logConfigWarnings } from './config/env';
import { createApp } from './app';
import { testDatabaseConnection, disconnectDatabase } from './database/prisma';

async function startServer(): Promise<void> {
  logConfigWarnings();

  const app = createApp();

  const server = app.listen(config.port, async () => {
    console.log(`🚀 VenturePulse API running at http://localhost:${config.port}`);
    console.log(`   Health check: http://localhost:${config.port}/api/health`);
    console.log(`   Environment: ${config.nodeEnv}`);

    const dbConnected = await testDatabaseConnection();
    console.log(
      dbConnected
        ? '✅ Database connection verified.'
        : '⚠️  Could not reach the database — DB-backed routes will fail until this is fixed. Run `npm run prisma:migrate` after setting DATABASE_URL.'
    );
  });

  // ---- Graceful shutdown ----
  async function shutdown(signal: string): Promise<void> {
    console.log(`\n${signal} received. Shutting down...`);
    server.close();
    await disconnectDatabase();
    process.exit(0);
  }

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

startServer();
