import { z } from 'zod';

// Mirrors the enum values in schema.prisma exactly. Deliberately defined
// as plain literal lists (not z.nativeEnum(PrismaEnum)) so this file has
// zero runtime dependency on the generated Prisma client — it validates
// AI JSON shape, which is a concern independent of the database.
const DATA_CONFIDENCE = ['VERIFIED', 'ESTIMATE', 'ASSUMPTION', 'AI_RECOMMENDATION'] as const;
const RISK_TYPE = ['MARKET', 'COMPETITION', 'FINANCIAL', 'TECHNICAL', 'OPERATIONAL', 'REGULATORY', 'CUSTOMER_ADOPTION'] as const;
const RISK_SEVERITY = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
const RECOMMENDATION_PRIORITY = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

const score = z.number().min(0).max(100);
const nonEmptyString = z.string().trim().min(1);
const stringArray = z.array(nonEmptyString).min(1).max(10);

const categoryDetailBase = z.object({
  findings: nonEmptyString,
  strength: nonEmptyString,
  weakness: nonEmptyString,
  recommendation: nonEmptyString
});

export const problemAnalysisSchema = categoryDetailBase.extend({
  problemClarity: nonEmptyString,
  problemSeverity: nonEmptyString,
  frequency: nonEmptyString,
  targetCustomerClarity: nonEmptyString,
  existingAlternatives: nonEmptyString
});

export const marketAnalysisSchema = categoryDetailBase.extend({
  marketOpportunity: nonEmptyString,
  geographicOpportunity: nonEmptyString,
  growthAssumptions: nonEmptyString,
  tamEstimate: z.string().trim().optional(),
  tamConfidence: z.enum(DATA_CONFIDENCE).optional(),
  samEstimate: z.string().trim().optional(),
  samConfidence: z.enum(DATA_CONFIDENCE).optional(),
  somEstimate: z.string().trim().optional(),
  somConfidence: z.enum(DATA_CONFIDENCE).optional()
});

export const competitorSchema = z.object({
  name: nonEmptyString,
  price: z.string().trim().optional(),
  targetMarket: z.string().trim().optional(),
  features: z.string().trim().optional(),
  differentiation: z.string().trim().optional(),
  businessModel: z.string().trim().optional()
});

export const competitionAnalysisSchema = categoryDetailBase.extend({
  directCompetitors: nonEmptyString,
  indirectCompetitors: nonEmptyString,
  existingAlternatives: nonEmptyString,
  competitiveStrengths: nonEmptyString,
  competitiveWeaknesses: nonEmptyString,
  differentiation: nonEmptyString,
  competitors: z.array(competitorSchema).max(6).default([])
});

export const businessModelAnalysisSchema = categoryDetailBase.extend({
  revenueModel: nonEmptyString,
  pricingStrategy: nonEmptyString,
  customerAcquisition: nonEmptyString,
  costs: nonEmptyString,
  monetization: nonEmptyString
});

export const feasibilityAnalysisSchema = categoryDetailBase.extend({
  technicalFeasibility: nonEmptyString,
  operationalFeasibility: nonEmptyString,
  financialFeasibility: nonEmptyString
});

export const riskItemSchema = z.object({
  type: z.enum(RISK_TYPE),
  severity: z.enum(RISK_SEVERITY),
  description: nonEmptyString
});

export const riskAnalysisSchema = categoryDetailBase.extend({
  risks: z.array(riskItemSchema).min(1).max(10)
});

export const recommendationSchema = z.object({
  title: nonEmptyString,
  description: nonEmptyString,
  priority: z.enum(RECOMMENDATION_PRIORITY)
});

export const aiCritiqueSchema = z.object({
  strengths: stringArray,
  weaknesses: stringArray,
  biggestRisk: nonEmptyString,
  hiddenAssumptions: stringArray,
  whyThisCouldFail: stringArray,
  hardQuestions: stringArray,
  recommendedActions: stringArray
});

/**
 * The single consolidated AI response for a full analysis run. One AI
 * call returns all of this — see ai/prompts.ts and the "Do not run
 * multiple expensive AI calls when one structured call can reasonably
 * handle the task" requirement in the spec.
 */
export const fullAnalysisResponseSchema = z.object({
  scores: z.object({
    problemStrength: score,
    customer: score,
    market: score,
    competition: score,
    differentiation: score,
    businessModel: score,
    feasibility: score,
    scalability: score,
    risk: score
  }),
  scoreRationale: z.object({
    problemStrength: nonEmptyString,
    customer: nonEmptyString,
    market: nonEmptyString,
    competition: nonEmptyString,
    differentiation: nonEmptyString,
    businessModel: nonEmptyString,
    feasibility: nonEmptyString,
    scalability: nonEmptyString,
    risk: nonEmptyString
  }),
  problemAnalysis: problemAnalysisSchema,
  marketAnalysis: marketAnalysisSchema,
  competitionAnalysis: competitionAnalysisSchema,
  businessModelAnalysis: businessModelAnalysisSchema,
  feasibilityAnalysis: feasibilityAnalysisSchema,
  riskAnalysis: riskAnalysisSchema,
  aiCritique: aiCritiqueSchema,
  recommendations: z.array(recommendationSchema).min(2).max(8)
});

export type FullAnalysisResponse = z.infer<typeof fullAnalysisResponseSchema>;

export const improvedIdeaResponseSchema = z.object({
  improvedIdea: nonEmptyString,
  whyBetter: nonEmptyString,
  tradeOffs: stringArray
});

export type ImprovedIdeaResponse = z.infer<typeof improvedIdeaResponseSchema>;

export const mvpPlanResponseSchema = z.object({
  objective: nonEmptyString,
  mustHaveFeatures: stringArray,
  shouldHaveFeatures: stringArray,
  laterFeatures: stringArray,
  targetUsers: nonEmptyString,
  coreUserJourney: nonEmptyString,
  developmentPriority: nonEmptyString
});

export type MvpPlanResponse = z.infer<typeof mvpPlanResponseSchema>;

export const validationExperimentSchema = z.object({
  experimentName: nonEmptyString,
  hypothesis: nonEmptyString,
  targetAudience: nonEmptyString,
  method: nonEmptyString,
  requiredSample: nonEmptyString,
  successMetric: nonEmptyString,
  failureThreshold: nonEmptyString,
  duration: nonEmptyString
});

export const experimentsResponseSchema = z.object({
  experiments: z.array(validationExperimentSchema).min(1).max(5)
});

export type ExperimentsResponse = z.infer<typeof experimentsResponseSchema>;
