import type { Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse';
import { testDatabaseConnection } from '../database/prisma';

export async function getHealth(_req: Request, res: Response): Promise<void> {
  const databaseConnected = await testDatabaseConnection();

  sendSuccess(
    res,
    {
      uptimeSeconds: Math.round(process.uptime()),
      database: databaseConnected ? 'connected' : 'disconnected'
    },
    'VenturePulse API is running.'
  );
}
