import type { ScoreCategory, Verdict } from '@prisma/client';

/**
 * Weighted scoring configuration. Weights must sum to 1.0 — this is
 * asserted in scoringEngine.test.ts so a typo here fails CI loudly
 * instead of silently producing a wrong overall score.
 *
 * These are the only numbers that decide how much each category
 * contributes to the final score. Change them here — never scatter
 * magic weight numbers through controllers/services.
 *
 * Deliberately typed against plain string literals (matching the
 * ScoreCategory enum's values) rather than importing the enum as a
 * runtime value — this file has zero runtime dependency on the
 * generated Prisma client, so it can be tested in total isolation.
 */
export const CATEGORY_WEIGHTS: Record<ScoreCategory, number> = {
  PROBLEM_STRENGTH: 0.15,
  CUSTOMER: 0.1,
  MARKET: 0.15,
  COMPETITION: 0.1,
  DIFFERENTIATION: 0.15,
  BUSINESS_MODEL: 0.1,
  FEASIBILITY: 0.1,
  SCALABILITY: 0.05,
  RISK: 0.1
};

/**
 * Verdict bands, per the product spec. Bands are inclusive of their
 * lower bound and exclusive of the next band's lower bound, except the
 * top band which includes 100.
 */
export const VERDICT_BANDS: Array<{ min: number; max: number; verdict: Verdict; label: string }> = [
  { min: 0, max: 39, verdict: 'WEAK', label: 'Weak' },
  { min: 40, max: 59, verdict: 'NEEDS_WORK', label: 'Needs Work' },
  { min: 60, max: 74, verdict: 'MODERATE_POTENTIAL', label: 'Moderate Potential' },
  { min: 75, max: 89, verdict: 'PROMISING', label: 'Promising' },
  { min: 90, max: 100, verdict: 'EXCEPTIONAL_POTENTIAL', label: 'Exceptional Potential' }
];

/**
 * User-facing verdict language. Deliberately hedged per the spec: never
 * "this will succeed", always framed as a read on the assumptions given.
 */
export const VERDICT_SUMMARY: Record<Verdict, string> = {
  WEAK: 'Weak based on the provided assumptions — significant gaps across multiple categories.',
  NEEDS_WORK: 'Needs work based on the provided assumptions — the core idea has real gaps to address.',
  MODERATE_POTENTIAL: 'Moderate potential based on the provided assumptions — some real strengths, held back by specific weaknesses.',
  PROMISING: 'Promising based on the provided assumptions — strong fundamentals with a few risks worth validating.',
  EXCEPTIONAL_POTENTIAL: 'Exceptional potential based on the provided assumptions — but even a strong score is not a guarantee of success.'
};
