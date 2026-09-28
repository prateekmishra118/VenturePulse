import { describe, it, expect } from 'vitest';
import { calculateOverallScore, clampScore, getVerdict } from './scoringEngine';
import { CATEGORY_WEIGHTS, VERDICT_BANDS } from './scoringConfig';
import type { ScoreCategory } from '@prisma/client';

const ALL_CATEGORIES = Object.keys(CATEGORY_WEIGHTS) as ScoreCategory[];

function allScores(score: number) {
  return ALL_CATEGORIES.map((category) => ({ category, score }));
}

describe('scoringConfig', () => {
  it('weights sum to exactly 1.0 (within floating point tolerance)', () => {
    const total = Object.values(CATEGORY_WEIGHTS).reduce((sum, w) => sum + w, 0);
    expect(total).toBeCloseTo(1.0, 10);
  });

  it('verdict bands cover 0-100 with no gaps and no overlaps', () => {
    const sorted = [...VERDICT_BANDS].sort((a, b) => a.min - b.min);
    expect(sorted[0].min).toBe(0);
    expect(sorted[sorted.length - 1].max).toBe(100);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].min).toBe(sorted[i - 1].max + 1);
    }
  });
});

describe('clampScore', () => {
  it('rounds a normal value', () => {
    expect(clampScore(72.4)).toBe(72);
    expect(clampScore(72.6)).toBe(73);
  });

  it('clamps values above 100 down to 100', () => {
    expect(clampScore(150)).toBe(100);
  });

  it('clamps negative values up to 0', () => {
    expect(clampScore(-20)).toBe(0);
  });

  it('treats NaN as 0', () => {
    expect(clampScore(NaN)).toBe(0);
  });
});

describe('calculateOverallScore', () => {
  it('returns exactly 100 when every category scores 100', () => {
    expect(calculateOverallScore(allScores(100))).toBe(100);
  });

  it('returns exactly 0 when every category scores 0', () => {
    expect(calculateOverallScore(allScores(0))).toBe(0);
  });

  it('returns the same score when every category scores the same non-boundary value', () => {
    expect(calculateOverallScore(allScores(70))).toBe(70);
  });

  it('weights categories correctly — a high score in a heavy category moves the total more than in a light one', () => {
    const base = allScores(50);

    const withStrongDifferentiation = base.map((s) =>
      s.category === 'DIFFERENTIATION' ? { ...s, score: 100 } : s
    ); // 15% weight
    const withStrongScalability = base.map((s) =>
      s.category === 'SCALABILITY' ? { ...s, score: 100 } : s
    ); // 5% weight

    const baseline = calculateOverallScore(base);
    const deltaHeavy = calculateOverallScore(withStrongDifferentiation) - baseline;
    const deltaLight = calculateOverallScore(withStrongScalability) - baseline;

    expect(deltaHeavy).toBeGreaterThan(deltaLight);
  });

  it('clamps out-of-range AI-suggested scores before weighting', () => {
    const scores = ALL_CATEGORIES.map((category) => ({ category, score: 500 })); // absurd AI output
    expect(calculateOverallScore(scores)).toBe(100);
  });

  it('throws when a category is missing (wrong total count)', () => {
    const incomplete = allScores(80).slice(0, -1);
    expect(() => calculateOverallScore(incomplete)).toThrow(/expected exactly 9/);
  });

  it('throws when a category is duplicated', () => {
    const scores = allScores(80);
    scores.push({ category: scores[0].category, score: 80 });
    expect(() => calculateOverallScore(scores)).toThrow();
  });

  it('throws on an unknown category', () => {
    const scores = allScores(80);
    // @ts-expect-error — deliberately passing an invalid category to prove the guard works
    scores[0] = { category: 'NOT_A_REAL_CATEGORY', score: 80 };
    expect(() => calculateOverallScore(scores)).toThrow();
  });
});

describe('getVerdict', () => {
  it.each([
    [0, 'WEAK'],
    [39, 'WEAK'],
    [40, 'NEEDS_WORK'],
    [59, 'NEEDS_WORK'],
    [60, 'MODERATE_POTENTIAL'],
    [74, 'MODERATE_POTENTIAL'],
    [75, 'PROMISING'],
    [89, 'PROMISING'],
    [90, 'EXCEPTIONAL_POTENTIAL'],
    [100, 'EXCEPTIONAL_POTENTIAL']
  ])('maps score %i to verdict %s', (score, expected) => {
    expect(getVerdict(score)).toBe(expected);
  });
});
