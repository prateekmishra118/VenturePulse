import type { Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse';
import * as analysisService from '../services/analysis.service';
import * as reportService from '../services/report.service';

export async function analyzeIdea(req: Request, res: Response): Promise<void> {
  const analysis = await analysisService.startAnalysis(req.user!.userId, req.params.id);
  sendSuccess(res, analysis, 'Analysis started.', 202);
}

export async function getAnalysis(req: Request, res: Response): Promise<void> {
  const analysis = await analysisService.getAnalysisDetail(req.user!.userId, req.params.id);
  sendSuccess(res, analysis, 'Analysis retrieved.');
}

export async function improveIdea(req: Request, res: Response): Promise<void> {
  const improved = await analysisService.improveIdea(req.user!.userId, req.params.id);
  sendSuccess(res, improved, 'Improved idea generated.');
}

export async function generateMvp(req: Request, res: Response): Promise<void> {
  const mvp = await analysisService.generateMvp(req.user!.userId, req.params.id);
  sendSuccess(res, mvp, 'MVP plan generated.');
}

export async function generateExperiments(req: Request, res: Response): Promise<void> {
  const experiments = await analysisService.generateExperiments(req.user!.userId, req.params.id);
  sendSuccess(res, experiments, 'Validation experiments generated.');
}

export async function generateReport(req: Request, res: Response): Promise<void> {
  const report = await reportService.generateReport(req.user!.userId, req.params.id);

  if (req.query.format === 'markdown') {
    res
      .status(200)
      .type('text/markdown')
      .setHeader('Content-Disposition', `attachment; filename="venturepulse-report-${req.params.id}.md"`)
      .send(report.content);
    return;
  }

  sendSuccess(res, report, 'Report generated.');
}
