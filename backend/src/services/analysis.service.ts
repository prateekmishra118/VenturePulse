import { ScoreCategory, AnalysisStatus, CompetitorSource } from '@prisma/client';
import { prisma } from '../database/prisma';
import { ApiError } from '../middleware/errorHandler';
import { assertIdeaOwnership } from './idea.service';
import { callAiWithSchema } from './ai.service';
import {
  buildFullAnalysisPrompt,
  buildImproveIdeaPrompt,
  buildMvpPrompt,
  buildExperimentsPrompt,
  type IdeaContext
} from '../ai/prompts';
import {
  fullAnalysisResponseSchema,
  improvedIdeaResponseSchema,
  mvpPlanResponseSchema,
  experimentsResponseSchema,
  type FullAnalysisResponse
} from '../validators/ai.schemas';
import { calculateOverallScore, clampScore, getVerdict } from '../analyzers/scoringEngine';
import { CATEGORY_WEIGHTS } from '../analyzers/scoringConfig';

/**
 * Fetches an Analysis and confirms it (via its StartupIdea) belongs to
 * userId. Throws 404 otherwise — same non-distinguishing error as
 * idea.service, for the same reason (don't leak existence to non-owners).
 */
async function getOwnedAnalysis(userId: string, analysisId: string) {
  const analysis = await prisma.analysis.findUnique({
    where: { id: analysisId },
    include: { idea: true }
  });

  if (!analysis || analysis.idea.userId !== userId) {
    throw new ApiError(404, 'Analysis not found.');
  }

  return analysis;
}

/**
 * POST /api/ideas/:id/analyze
 *
 * Creates the Analysis row immediately and returns it with status
 * ANALYZING — the actual AI work happens after the response is sent
 * (see runAnalysisPipeline). The frontend polls GET /api/analyses/:id
 * until status is COMPLETED or FAILED, which is what drives the
 * "Analysis Progress" screen in the product flow.
 */
export async function startAnalysis(userId: string, ideaId: string) {
  const idea = await assertIdeaOwnership(userId, ideaId);

  const analysis = await prisma.analysis.create({
    data: { ideaId: idea.id, status: AnalysisStatus.ANALYZING }
  });

  // Intentionally not awaited — see function doc above. Errors inside
  // the pipeline are caught internally and turn into status: FAILED,
  // never an unhandled rejection.
  void runAnalysisPipeline(analysis.id, idea);

  return analysis;
}

async function runAnalysisPipeline(analysisId: string, idea: IdeaContext): Promise<void> {
  try {
    const { system, user } = buildFullAnalysisPrompt(idea);
    const result = await callAiWithSchema(system, user, fullAnalysisResponseSchema);

    await persistAnalysisResult(analysisId, result);

    console.log(`✅ Analysis ${analysisId} completed.`);
  } catch (err) {
    console.error(`❌ Analysis ${analysisId} failed:`, err instanceof Error ? err.message : err);
    await prisma.analysis
      .update({ where: { id: analysisId }, data: { status: AnalysisStatus.FAILED } })
      .catch((updateErr: unknown) => console.error('Additionally failed to mark analysis as FAILED:', updateErr));
  }
}

async function persistAnalysisResult(analysisId: string, result: FullAnalysisResponse): Promise<void> {
  const categoryScores: Array<{ category: ScoreCategory; score: number; rationale: string }> = [
    { category: ScoreCategory.PROBLEM_STRENGTH, score: result.scores.problemStrength, rationale: result.scoreRationale.problemStrength },
    { category: ScoreCategory.CUSTOMER, score: result.scores.customer, rationale: result.scoreRationale.customer },
    { category: ScoreCategory.MARKET, score: result.scores.market, rationale: result.scoreRationale.market },
    { category: ScoreCategory.COMPETITION, score: result.scores.competition, rationale: result.scoreRationale.competition },
    { category: ScoreCategory.DIFFERENTIATION, score: result.scores.differentiation, rationale: result.scoreRationale.differentiation },
    { category: ScoreCategory.BUSINESS_MODEL, score: result.scores.businessModel, rationale: result.scoreRationale.businessModel },
    { category: ScoreCategory.FEASIBILITY, score: result.scores.feasibility, rationale: result.scoreRationale.feasibility },
    { category: ScoreCategory.SCALABILITY, score: result.scores.scalability, rationale: result.scoreRationale.scalability },
    { category: ScoreCategory.RISK, score: result.scores.risk, rationale: result.scoreRationale.risk }
  ];

  // The application — not the AI — calculates the final number.
  const overallScore = calculateOverallScore(categoryScores.map((c) => ({ category: c.category, score: c.score })));
  const verdict = getVerdict(overallScore);

  await prisma.$transaction([
    prisma.score.createMany({
      data: categoryScores.map((c) => ({
        analysisId,
        category: c.category,
        score: clampScore(c.score),
        weight: CATEGORY_WEIGHTS[c.category],
        rationale: c.rationale
      }))
    }),
    prisma.problemAnalysis.create({ data: { analysisId, ...result.problemAnalysis } }),
    prisma.marketAnalysis.create({ data: { analysisId, ...result.marketAnalysis } }),
    prisma.competitionAnalysis.create({
      data: {
        analysisId,
        directCompetitors: result.competitionAnalysis.directCompetitors,
        indirectCompetitors: result.competitionAnalysis.indirectCompetitors,
        existingAlternatives: result.competitionAnalysis.existingAlternatives,
        competitiveStrengths: result.competitionAnalysis.competitiveStrengths,
        competitiveWeaknesses: result.competitionAnalysis.competitiveWeaknesses,
        differentiation: result.competitionAnalysis.differentiation,
        findings: result.competitionAnalysis.findings,
        strength: result.competitionAnalysis.strength,
        weakness: result.competitionAnalysis.weakness,
        recommendation: result.competitionAnalysis.recommendation,
        competitors: {
          create: result.competitionAnalysis.competitors.map((c) => ({ ...c, source: CompetitorSource.AI_DISCOVERED }))
        }
      }
    }),
    prisma.businessModelAnalysis.create({ data: { analysisId, ...result.businessModelAnalysis } }),
    prisma.feasibilityAnalysis.create({ data: { analysisId, ...result.feasibilityAnalysis } }),
    prisma.riskAnalysis.create({
      data: {
        analysisId,
        findings: result.riskAnalysis.findings,
        strength: result.riskAnalysis.strength,
        weakness: result.riskAnalysis.weakness,
        recommendation: result.riskAnalysis.recommendation,
        risks: { create: result.riskAnalysis.risks }
      }
    }),
    prisma.aICritique.create({ data: { analysisId, ...result.aiCritique } }),
    prisma.recommendation.createMany({
      data: result.recommendations.map((r) => ({ analysisId, ...r }))
    }),
    prisma.analysis.update({
      where: { id: analysisId },
      data: { status: AnalysisStatus.COMPLETED, overallScore, verdict, completedAt: new Date() }
    })
  ]);
}

/**
 * GET /api/analyses/:id — full detail for the Results / Detailed
 * Analysis / AI Critic pages.
 */
export async function getAnalysisDetail(userId: string, analysisId: string) {
  await getOwnedAnalysis(userId, analysisId); // ownership check

  return prisma.analysis.findUniqueOrThrow({
    where: { id: analysisId },
    include: {
      idea: true,
      scores: true,
      problemAnalysis: true,
      marketAnalysis: true,
      competitionAnalysis: { include: { competitors: true } },
      businessModelAnalysis: true,
      feasibilityAnalysis: true,
      riskAnalysis: { include: { risks: true } },
      aiCritique: true,
      improvedIdea: true,
      mvpPlan: true,
      recommendations: { orderBy: { createdAt: 'asc' } },
      validationExperiments: { orderBy: { createdAt: 'asc' } },
      report: true
    }
  });
}

function assertCompleted(status: AnalysisStatus): void {
  if (status !== AnalysisStatus.COMPLETED) {
    throw new ApiError(400, 'This analysis has not finished running yet. Please wait for it to complete.');
  }
}

/** POST /api/analyses/:id/improve */
export async function improveIdea(userId: string, analysisId: string) {
  const analysis = await getOwnedAnalysis(userId, analysisId);
  assertCompleted(analysis.status);

  const critique = await prisma.aICritique.findUnique({ where: { analysisId } });
  const weaknesses = critique?.weaknesses ?? [];

  const { system, user } = buildImproveIdeaPrompt(analysis.idea, weaknesses);
  const result = await callAiWithSchema(system, user, improvedIdeaResponseSchema);

  return prisma.improvedIdea.upsert({
    where: { analysisId },
    create: { analysisId, originalIdea: analysis.idea.ideaDescription, ...result },
    update: { originalIdea: analysis.idea.ideaDescription, ...result }
  });
}

/** POST /api/analyses/:id/mvp */
export async function generateMvp(userId: string, analysisId: string) {
  const analysis = await getOwnedAnalysis(userId, analysisId);
  assertCompleted(analysis.status);

  const { system, user } = buildMvpPrompt(analysis.idea);
  const result = await callAiWithSchema(system, user, mvpPlanResponseSchema);

  return prisma.mvpPlan.upsert({
    where: { analysisId },
    create: { analysisId, ...result },
    update: { ...result }
  });
}

/** POST /api/analyses/:id/experiments */
export async function generateExperiments(userId: string, analysisId: string) {
  const analysis = await getOwnedAnalysis(userId, analysisId);
  assertCompleted(analysis.status);

  const { system, user } = buildExperimentsPrompt(analysis.idea);
  const { experiments } = await callAiWithSchema(system, user, experimentsResponseSchema);

  // Regenerating replaces the previous set, rather than piling up
  // duplicates every time the founder clicks "generate" again.
  await prisma.validationExperiment.deleteMany({ where: { analysisId } });
  await prisma.validationExperiment.createMany({
    data: experiments.map((e) => ({ analysisId, ...e }))
  });

  return prisma.validationExperiment.findMany({ where: { analysisId }, orderBy: { createdAt: 'asc' } });
}
