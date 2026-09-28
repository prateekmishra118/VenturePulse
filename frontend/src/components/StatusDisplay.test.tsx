import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VerdictBadge, StatusPill, categoryLabel } from './StatusDisplay';

describe('categoryLabel', () => {
  it('converts SCREAMING_SNAKE_CASE to Title Case', () => {
    expect(categoryLabel('PROBLEM_STRENGTH')).toBe('Problem Strength');
    expect(categoryLabel('MARKET')).toBe('Market');
    expect(categoryLabel('CUSTOMER_ADOPTION')).toBe('Customer Adoption');
  });
});

describe('VerdictBadge', () => {
  it('renders the human-readable label for a known verdict', () => {
    render(<VerdictBadge verdict="MODERATE_POTENTIAL" />);
    expect(screen.getByText('Moderate Potential')).toBeInTheDocument();
  });

  it('falls back to the raw value for an unknown verdict', () => {
    render(<VerdictBadge verdict="SOMETHING_NEW" />);
    expect(screen.getByText('SOMETHING_NEW')).toBeInTheDocument();
  });
});

describe('StatusPill', () => {
  it('renders the status with underscores replaced by spaces', () => {
    render(<StatusPill status="ANALYZING" />);
    expect(screen.getByText('ANALYZING')).toBeInTheDocument();
  });
});
