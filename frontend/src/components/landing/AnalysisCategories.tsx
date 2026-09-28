import { AnimatedSection } from '@/components/AnimatedSection';
import { SectionHeading } from '@/components/SectionHeading';
import type { AnalysisCategory } from '@/types/landing';

const CATEGORIES: AnalysisCategory[] = [
  { name: 'Problem Strength', weight: 15, description: 'Clarity, severity, and frequency of the problem.' },
  { name: 'Customer', weight: 10, description: 'Target customer clarity and willingness-to-pay signals.' },
  { name: 'Market', weight: 15, description: 'Opportunity size and growth assumptions, clearly labeled.' },
  { name: 'Competition', weight: 10, description: 'Direct/indirect alternatives and your differentiation.' },
  { name: 'Differentiation', weight: 15, description: 'What makes this idea meaningfully different.' },
  { name: 'Business Model', weight: 10, description: 'Revenue model, pricing, and acquisition strategy.' },
  { name: 'Feasibility', weight: 10, description: 'Technical, operational, and financial feasibility.' },
  { name: 'Scalability', weight: 5, description: 'Customer, geographic, and operational scalability.' },
  { name: 'Risk', weight: 10, description: 'Market, competitive, financial, and regulatory risk.' }
];

export function AnalysisCategories() {
  return (
    <AnimatedSection id="analysis-categories" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="Methodology"
        title="Nine categories. Transparent weights. One calculated score."
        description="The AI reasons about each category — the application calculates the final score from configurable weights, documented in the scoring engine."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CATEGORIES.map((cat) => (
          <div key={cat.name} className="rounded-xl border border-line bg-white p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-ink">{cat.name}</h3>
              <span className="text-xs font-mono font-semibold text-emerald-dark bg-emerald-light px-2 py-0.5 rounded-full">
                {cat.weight}%
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed">{cat.description}</p>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
