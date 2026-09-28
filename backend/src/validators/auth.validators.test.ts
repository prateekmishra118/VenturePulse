import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from './auth.validators';

describe('registerSchema', () => {
  it('accepts valid input and normalizes the email to lowercase', () => {
    const result = registerSchema.safeParse({ name: 'Ada Lovelace', email: 'ADA@Example.com', password: 'correcthorse' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('ada@example.com');
    }
  });

  it('rejects a name that is too short', () => {
    expect(registerSchema.safeParse({ name: 'A', email: 'a@b.com', password: 'correcthorse' }).success).toBe(false);
  });

  it('rejects an invalid email', () => {
    expect(registerSchema.safeParse({ name: 'Ada', email: 'not-an-email', password: 'correcthorse' }).success).toBe(false);
  });

  it('rejects a password under 8 characters', () => {
    expect(registerSchema.safeParse({ name: 'Ada', email: 'a@b.com', password: 'short1' }).success).toBe(false);
  });

  it('rejects a whitespace-only name', () => {
    expect(registerSchema.safeParse({ name: '   ', email: 'a@b.com', password: 'correcthorse' }).success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts valid input', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'anything' }).success).toBe(true);
  });

  it('rejects a missing password', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: '' }).success).toBe(false);
  });

  it('rejects an invalid email', () => {
    expect(loginSchema.safeParse({ email: 'nope', password: 'x' }).success).toBe(false);
  });
});
