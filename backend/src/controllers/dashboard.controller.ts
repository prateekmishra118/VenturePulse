import type { Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse';
import { getDashboardData } from '../services/dashboard.service';

export async function getDashboard(req: Request, res: Response): Promise<void> {
  const data = await getDashboardData(req.user!.userId);
  sendSuccess(res, data, 'Dashboard data retrieved.');
}
