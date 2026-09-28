import { describe, it, expect } from 'vitest';
import {
  fullAnalysisResponseSchema,
  improvedIdeaResponseSchema,
  mvpPlanResponseSchema,
  experimentsResponseSchema
} from './ai.schemas';

const validCategoryDetail = {
  findings: 'Solid findings text.',
  strength: 'A real strength.',
  weakness: 'A real weakness.',
  recommendation: 'Do this next.'
};

const validFullAnalysis = {
  scores: {
    problemStrength: 80,
    customer: 70,
    market: 65,
    competition: 60,
    differentiation: 55,
    businessModel: 72,
    feasibility: 85,
    scalability: 50,
    risk: 68
  },
  scoreRationale: {
    problemStrength: 'Clear, frequent problem.',
    customer: 'Well-defined target customer.',
    market: 'Reasonable market size.',
    competition: 'Crowded but differentiated.',
    differentiation: 'Somewhat differentiated.',
    businessModel: 'Clear revenue model.',
    feasibility: 'Technically straightforward.',
    scalability: 'Limited by manual ops.',
    risk: 'Moderate overall risk.'
  },
  problemAnalysis: {
    ...validCategoryDetail,
    problemClarity: 'Clear',
    problemSeverity: 'High',
    frequency: 'Daily',
    targetCustomerClarity: 'Clear',
    existingAlternatives: 'A few informal ones'
  },
  marketAnalysis: {
    ...validCategoryDetail,
    marketOpportunity: 'Meaningful local opportunity',
    geographicOpportunity: 'Single campus initially',
    growthAssumptions: 'Expansion to nearby campuses'
  },
  competitionAnalysis: {
    ...validCategoryDetail,
    directCompetitors: 'Swiggy, Zomato',
    indirectCompetitors: 'Walking to the canteen',
    existingAlternatives: 'Ordering ahead by phone',
    competitiveStrengths: 'Established logistics',
    competitiveWeaknesses: 'Slow after 10pm',
    differentiation: 'Campus-only riders',
    competitors: [{ name: 'Swiggy', price: 'Variable delivery fee' }]
  },
  businessModelAnalysis: {
    ...validCategoryDetail,
    revenueModel: 'Commission per order',
    pricingStrategy: 'Flat delivery fee',
    customerAcquisition: 'Campus ambassadors',
    costs: 'Rider payouts, app hosting',
    monetization: '12% commission'
  },
  feasibilityAnalysis: {
    ...validCategoryDetail,
    technicalFeasibility: 'Straightforward CRUD app',
    operationalFeasibility: 'Needs reliable riders',
    financialFeasibility: 'Low upfront cost'
  },
  riskAnalysis: {
    ...validCategoryDetail,
    risks: [{ type: 'COMPETITION', severity: 'MEDIUM', description: 'Incumbents could match pricing.' }]
  },
  aiCritique: {
    strengths: ['Clear problem'],
    weaknesses: ['Thin differentiation'],
    biggestRisk: 'Incumbent price matching',
    hiddenAssumptions: ['Students will switch apps for a small fee difference'],
    whyThisCouldFail: ['CAC could exceed customer lifetime value'],
    hardQuestions: ['What stops Swiggy from matching your price?'],
    recommendedActions: ['Run a willingness-to-pay test before building']
  },
  recommendations: [
    { title: 'Validate pricing', description: 'Run a landing page test.', priority: 'HIGH' },
    { title: 'Talk to riders', description: 'Confirm rider supply.', priority: 'MEDIUM' }
  ]
};

describe('fullAnalysisResponseSchema', () => {
  it('accepts a fully valid AI response', () => {
    const result = fullAnalysisResponseSchema.safeParse(validFullAnalysis);
    expect(result.success).toBe(true);
  });

  it('rejects a score above 100', () => {
    const bad = { ...validFullAnalysis, scores: { ...validFullAnalysis.scores, market: 150 } };
    expect(fullAnalysisResponseSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects a score below 0', () => {
    const bad = { ...validFullAnalysis, scores: { ...validFullAnalysis.scores, risk: -5 } };
    expect(fullAnalysisResponseSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects an invalid risk type', () => {
    const bad = {
      ...validFullAnalysis,
      riskAnalysis: {
        ...validFullAnalysis.riskAnalysis,
        risks: [{ type: 'ALIEN_INVASION', severity: 'MEDIUM', description: 'Not a real risk type.' }]
      }
    };
    expect(fullAnalysisResponseSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects a missing top-level section (e.g. aiCritique)', () => {
    const { aiCritique: _aiCritique, ...bad } = validFullAnalysis;
    expect(fullAnalysisResponseSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects an empty strengths array in the AI critique', () => {
    const bad = { ...validFullAnalysis, aiCritique: { ...validFullAnalysis.aiCritique, strengths: [] } };
    expect(fullAnalysisResponseSchema.safeParse(bad).success).toBe(false);
  });

  it('defaults competitors to an empty array if omitted', () => {
    const { competitors: _competitors, ...competitionWithoutCompetitors } = validFullAnalysis.competitionAnalysis;
    const withoutCompetitors = { ...validFullAnalysis, competitionAnalysis: competitionWithoutCompetitors };
    const result = fullAnalysisResponseSchema.safeParse(withoutCompetitors);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.competitionAnalysis.competitors).toEqual([]);
    }
  });
});

describe('improvedIdeaResponseSchema', () => {
  it('accepts a valid response', () => {
    const result = improvedIdeaResponseSchema.safeParse({
      improvedIdea: 'A revised version of the idea.',
      whyBetter: 'Addresses the differentiation gap.',
      tradeOffs: ['Slightly higher operating cost']
    });
    expect(result.success).toBe(true);
  });

  it('rejects an empty tradeOffs array', () => {
    const result = improvedIdeaResponseSchema.safeParse({
      improvedIdea: 'A revised version of the idea.',
      whyBetter: 'Addresses the differentiation gap.',
      tradeOffs: []
    });
    expect(result.success).toBe(false);
  });
});

describe('mvpPlanResponseSchema', () => {
  it('accepts a valid response', () => {
    const result = mvpPlanResponseSchema.safeParse({
      objective: 'Test whether students will order through the app.',
      mustHaveFeatures: ['Order placement', 'Rider assignment'],
      shouldHaveFeatures: ['Order tracking'],
      laterFeatures: ['Loyalty points'],
      targetUsers: 'Hostel students',
      coreUserJourney: 'Browse menu → order → track → receive',
      developmentPriority: 'Build ordering first, tracking second.'
    });
    expect(result.success).toBe(true);
  });
});

describe('experimentsResponseSchema', () => {
  it('accepts a valid response with 1-5 experiments', () => {
    const result = experimentsResponseSchema.safeParse({
      experiments: [
        {
          experimentName: 'Landing page test',
          hypothesis: 'Students are willing to pay ₹30 for delivery.',
          targetAudience: 'Hostel students',
          method: 'Landing page + WhatsApp signal',
          requiredSample: '150 visitors',
          successMetric: '30%+ purchase intent',
          failureThreshold: 'Under 15% intent',
          duration: '7 days'
        }
      ]
    });
    expect(result.success).toBe(true);
  });

  it('rejects zero experiments', () => {
    const result = experimentsResponseSchema.safeParse({ experiments: [] });
    expect(result.success).toBe(false);
  });
});
