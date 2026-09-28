import { prisma } from '../database/prisma';
import { ApiError } from '../middleware/errorHandler';
import { VERDICT_SUMMARY } from '../analyzers/scoringConfig';
import { getAnalysisDetail } from './analysis.service';

/**
 * Builds the full report as Markdown from data that's already been
 * computed and stored — deliberately no new AI call here (see the
 * "don't run unnecessary AI requests" requirement). The report is a
 * structured rendering of the analysis, not a new piece of reasoning.
 */
export async function generateReport(userId: string, analysisId: string) {
  const analysis = await getAnalysisDetail(userId, analysisId);

  if (analysis.status !== 'COMPLETED' || analysis.overallScore === null || !analysis.verdict) {
    throw new ApiError(400, 'This analysis has not finished running yet. Please wait for it to complete.');
  }

  const content = renderMarkdown(analysis);

  return prisma.report.upsert({
    where: { analysisId },
    create: { analysisId, content },
    update: { content, generatedAt: new Date() }
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderMarkdown(a: any): string {
  const lines: string[] = [];
  const push = (s = '') => lines.push(s);

  push(`# VenturePulse Report — ${a.idea.startupName}`);
  push(`_Generated ${new Date().toLocaleDateString()}_`);
  push();
  push('## Executive Summary');
  push(`**Overall Score: ${a.overallScore} / 100 — ${a.verdict.replace(/_/g, ' ')}**`);
  push(VERDICT_SUMMARY[a.verdict as keyof typeof VERDICT_SUMMARY]);
  push();

  push('## Category Scores');
  for (const s of a.scores) {
    push(`- **${s.category.replace(/_/g, ' ')}** — ${s.score}/100 (weight ${Math.round(s.weight * 100)}%): ${s.rationale}`);
  }
  push();

  const section = (title: string, detail: { findings: string; strength: string; weakness: string; recommendation: string } | null) => {
    if (!detail) return;
    push(`## ${title}`);
    push(detail.findings);
    push();
    push(`**Strength:** ${detail.strength}`);
    push(`**Weakness:** ${detail.weakness}`);
    push(`**Recommendation:** ${detail.recommendation}`);
    push();
  };

  section('Problem Analysis', a.problemAnalysis);
  section('Market Analysis', a.marketAnalysis);
  section('Competition Analysis', a.competitionAnalysis);
  if (a.competitionAnalysis?.competitors?.length) {
    push('### Competitors');
    for (const c of a.competitionAnalysis.competitors) {
      push(`- **${c.name}**${c.price ? ` — ${c.price}` : ''}${c.differentiation ? ` — ${c.differentiation}` : ''}`);
    }
    push();
  }
  section('Business Model Analysis', a.businessModelAnalysis);
  section('Feasibility Analysis', a.feasibilityAnalysis);
  section('Risk Analysis', a.riskAnalysis);
  if (a.riskAnalysis?.risks?.length) {
    push('### Identified Risks');
    for (const r of a.riskAnalysis.risks) {
      push(`- **[${r.severity}] ${r.type.replace(/_/g, ' ')}:** ${r.description}`);
    }
    push();
  }

  if (a.aiCritique) {
    push('## AI Critic');
    push('**Strengths**');
    a.aiCritique.strengths.forEach((s: string) => push(`- ${s}`));
    push('**Weaknesses**');
    a.aiCritique.weaknesses.forEach((s: string) => push(`- ${s}`));
    push(`**Biggest Risk:** ${a.aiCritique.biggestRisk}`);
    push('**Hidden Assumptions**');
    a.aiCritique.hiddenAssumptions.forEach((s: string) => push(`- ${s}`));
    push('**Why This Could Fail**');
    a.aiCritique.whyThisCouldFail.forEach((s: string) => push(`- ${s}`));
    push('**Hard Questions**');
    a.aiCritique.hardQuestions.forEach((s: string) => push(`- ${s}`));
    push();
  }

  push('## Recommendations');
  for (const r of a.recommendations) {
    push(`- **[${r.priority}] ${r.title}:** ${r.description}`);
  }
  push();

  if (a.improvedIdea) {
    push('## Improved Idea');
    push(a.improvedIdea.improvedIdea);
    push();
    push(`**Why it's better:** ${a.improvedIdea.whyBetter}`);
    push('**Trade-offs**');
    a.improvedIdea.tradeOffs.forEach((s: string) => push(`- ${s}`));
    push();
  }

  if (a.mvpPlan) {
    push('## MVP Plan');
    push(`**Objective:** ${a.mvpPlan.objective}`);
    push('**Must-Have Features**');
    a.mvpPlan.mustHaveFeatures.forEach((s: string) => push(`- ${s}`));
    push('**Should-Have Features**');
    a.mvpPlan.shouldHaveFeatures.forEach((s: string) => push(`- ${s}`));
    push('**Later Features**');
    a.mvpPlan.laterFeatures.forEach((s: string) => push(`- ${s}`));
    push(`**Target Users:** ${a.mvpPlan.targetUsers}`);
    push(`**Core User Journey:** ${a.mvpPlan.coreUserJourney}`);
    push(`**Recommended Development Priority:** ${a.mvpPlan.developmentPriority}`);
    push();
  }

  if (a.validationExperiments?.length) {
    push('## Validation Experiments');
    for (const e of a.validationExperiments) {
      push(`### ${e.experimentName}`);
      push(`**Hypothesis:** ${e.hypothesis}`);
      push(`**Target Audience:** ${e.targetAudience}`);
      push(`**Method:** ${e.method}`);
      push(`**Required Sample:** ${e.requiredSample}`);
      push(`**Success Metric:** ${e.successMetric}`);
      push(`**Failure Threshold:** ${e.failureThreshold}`);
      push(`**Duration:** ${e.duration}`);
      push(`**Decision:** ${e.decision}`);
      push();
    }
  }

  push('## Final Verdict');
  push(`${a.overallScore}/100 — **${a.verdict.replace(/_/g, ' ')}**`);
  push(VERDICT_SUMMARY[a.verdict as keyof typeof VERDICT_SUMMARY]);

  return lines.join('\n');
}
