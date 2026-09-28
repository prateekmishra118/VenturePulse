import { describe, it, expect } from 'vitest';
import { createIdeaSchema } from './idea.validators';

const validIdea = {
  startupName: 'CampusEats',
  ideaDescription: 'A campus-only food delivery app for hostel students who want late-night snacks.',
  problem: 'Students have no delivery options after 10pm near campus.',
  targetCustomer: 'Undergraduate hostel students',
  industry: 'Food delivery',
  businessModel: 'Commission per order, 12%'
};

describe('createIdeaSchema', () => {
  it('accepts a valid idea with only required fields', () => {
    expect(createIdeaSchema.safeParse(validIdea).success).toBe(true);
  });

  it('accepts a valid idea with optional fields included', () => {
    const result = createIdeaSchema.safeParse({
      ...validIdea,
      location: 'Bengaluru, India',
      expectedPricing: '₹20 flat delivery fee',
      existingCompetitors: 'Swiggy, Zomato',
      uniqueSellingProposition: 'Only campus-verified riders, 15 minute guarantee',
      additionalInfo: 'Already have 3 riders lined up'
    });
    expect(result.success).toBe(true);
  });

  it('rejects a missing startupName', () => {
    const { startupName: _startupName, ...rest } = validIdea;
    expect(createIdeaSchema.safeParse(rest).success).toBe(false);
  });

  it('rejects an idea description that is too short', () => {
    expect(createIdeaSchema.safeParse({ ...validIdea, ideaDescription: 'too short' }).success).toBe(false);
  });

  it('reports one field-level error per invalid field', () => {
    const result = createIdeaSchema.safeParse({ ...validIdea, startupName: '', problem: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.issues.map((i) => i.path.join('.'));
      expect(fields).toContain('startupName');
      expect(fields).toContain('problem');
    }
  });
});
