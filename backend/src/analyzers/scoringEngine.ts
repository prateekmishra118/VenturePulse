import type { ScoreCategory, Verdict } from '@prisma/client';
import { CATEGORY_WEIGHTS, VERDICT_BANDS } from './scoringConfig';

export interface CategoryScoreInput {
  category: ScoreCategory;
  score: number; // 0-100, expected already-validated (see validators/ai.schemas.ts)
}

/**
 * Clamps a raw score (e.g. an AI-suggested rating) into the valid 0-100
 * integer range. The AI is one input into a category's score, but this
 * function is the only thing standing between "whatever the model said"
 * and a number that ends up in the database and on a user's screen.
 */
export function clampScore(raw: number): number {
  if (Number.isNaN(raw)) return 0;
  return Math.round(Math.min(100, Math.max(0, raw)));
}

/**
 * Calculates the final 0-100 overall score as a weighted sum of category
 * scores. This is the ONLY place the overall score is computed — the AI
 * never returns "82/100" directly; it only ever contributes a per-category
 * score, and this function does the math.
 *
 * Requires all 9 categories to be present exactly once (checked by count
 * up front, then by duplicate-detection while summing) — throws otherwise,
 * since a silently-missing category would silently skew the weighting.
 */
export function calculateOverallScore(scores: CategoryScoreInput[]): number {
  const categories = Object.keys(CATEGORY_WEIGHTS) as ScoreCategory[];

  if (scores.length !== categories.length) {
    throw new Error(
      `calculateOverallScore expected exactly ${categories.length} category scores, got ${scores.length}.`
    );
  }

  const seen = new Set<ScoreCategory>();
  let weightedSum = 0;

  for (const { category, score } of scores) {
    if (seen.has(category)) {
      throw new Error(`Duplicate score for category ${category}.`);
    }
    seen.add(category);

    const weight = CATEGORY_WEIGHTS[category];
    if (weight === undefined) {
      throw new Error(`Unknown score category: ${category}.`);
    }

    weightedSum += clampScore(score) * weight;
  }

  // Reachability note: at this point scores.length === categories.length
  // (checked above) and every entry in `scores` was unique (checked in
  // the loop above), so `seen` necessarily equals the full category set —
  // there is no remaining "missing category" case to check separately.

  return Math.round(weightedSum);
}

/**
 * Maps a final 0-100 score to its verdict band.
 */
export function getVerdict(overallScore: number): Verdict {
  const clamped = clampScore(overallScore);
  const band = VERDICT_BANDS.find((b) => clamped >= b.min && clamped <= b.max);
  // VERDICT_BANDS covers 0-100 with no gaps (asserted in the test suite),
  // so this fallback should never actually trigger.
  return band?.verdict ?? 'WEAK';
}
