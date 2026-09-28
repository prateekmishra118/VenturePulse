import { AnalysisStatus } from '@prisma/client';
import { prisma } from '../database/prisma';

export async function getDashboardData(userId: string) {
  const [totalIdeas, completedAnalyses, recentAnalyses, categoryScores, riskItems] = await Promise.all([
    prisma.startupIdea.count({ where: { userId } }),

    prisma.analysis.findMany({
      where: { idea: { userId }, status: AnalysisStatus.COMPLETED },
      select: { id: true, overallScore: true, verdict: true, completedAt: true, idea: { select: { startupName: true } } },
      orderBy: { completedAt: 'desc' }
    }),

    prisma.analysis.findMany({
      where: { idea: { userId } },
      select: {
        id: true,
        status: true,
        overallScore: true,
        verdict: true,
        createdAt: true,
        idea: { select: { id: true, startupName: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),

    prisma.score.groupBy({
      by: ['category'],
      where: { analysis: { idea: { userId }, status: AnalysisStatus.COMPLETED } },
      _avg: { score: true }
    }),

    prisma.riskItem.groupBy({
      by: ['severity'],
      where: { riskAnalysis: { analysis: { idea: { userId }, status: AnalysisStatus.COMPLETED } } },
      _count: { _all: true }
    })
  ]);

  interface CompletedAnalysisRow {
    id: string;
    overallScore: number | null;
    verdict: string | null;
    completedAt: Date | null;
    idea: { startupName: string };
  }
  interface CategoryScoreRow {
    category: string;
    _avg: { score: number | null };
  }
  interface RiskItemRow {
    severity: string;
    _count: { _all: number };
  }

  const completed = completedAnalyses as CompletedAnalysisRow[];
  const scores = completed.map((a) => a.overallScore).filter((s): s is number => s !== null);
  const averageScore = scores.length
    ? Math.round(scores.reduce((sum: number, s: number) => sum + s, 0) / scores.length)
    : null;
  const bestScore = scores.length ? Math.max(...scores) : null;

  return {
    totalIdeas,
    ideasAnalyzed: completed.length,
    averageScore,
    bestScore,
    recentAnalyses,
    charts: {
      scoreHistory: completed
        .filter((a) => a.completedAt)
        .map((a) => ({ date: a.completedAt, score: a.overallScore, startupName: a.idea.startupName }))
        .reverse(),
      categoryComparison: (categoryScores as CategoryScoreRow[]).map((c) => ({
        category: c.category,
        averageScore: Math.round(c._avg.score ?? 0)
      })),
      riskDistribution: (riskItems as RiskItemRow[]).map((r) => ({ severity: r.severity, count: r._count._all }))
    }
  };
}
