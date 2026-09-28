import { AnimatedSection } from '@/components/AnimatedSection';
import { SectionHeading } from '@/components/SectionHeading';
import type { ExampleCategoryScore } from '@/types/landing';

const EXAMPLE_SCORES: ExampleCategoryScore[] = [
  { name: 'Problem Strength', score: 84 },
  { name: 'Customer', score: 76 },
  { name: 'Market', score: 71 },
  { name: 'Competition', score: 58 },
  { name: 'Differentiation', score: 66 },
  { name: 'Business Model', score: 73 },
  { name: 'Feasibility', score: 88 },
  { name: 'Scalability', score: 62 },
  { name: 'Risk', score: 69 }
];

const VERDICT_BANDS = [
  { range: '0–39', label: 'Weak' },
  { range: '40–59', label: 'Needs Work' },
  { range: '60–74', label: 'Moderate Potential' },
  { range: '75–89', label: 'Promising' },
  { range: '90–100', label: 'Exceptional Potential' }
];

export function ExampleScore() {
  return (
    <AnimatedSection id="example-score" className="bg-paper-deep border-y border-line">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow="Example"
          title="A score you can actually explain"
          description="Every category is scored 0–100 and rolled up mathematically into one final number and verdict."
        />

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
          <div className="rounded-2xl border border-line bg-white p-8">
            <span className="text-xs font-semibold tracking-wide uppercase text-muted">
              Example: campus food-delivery app
            </span>
            <div className="flex items-end gap-3 mt-3 mb-1">
              <span className="font-serif text-6xl font-semibold text-ink">73</span>
              <span className="text-muted mb-2">/ 100</span>
            </div>
            <span className="inline-block text-sm font-semibold text-emerald-dark bg-emerald-light px-3 py-1 rounded-full mb-6">
              Moderate Potential
            </span>
            <p className="text-sm text-muted leading-relaxed">
              "Moderate potential based on the provided assumptions — strong feasibility and problem
              clarity, held back by unclear differentiation from existing campus delivery apps."
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-white p-8">
            <h3 className="text-sm font-semibold text-ink mb-5">Category breakdown</h3>
            <div className="space-y-4">
              {EXAMPLE_SCORES.map((row) => (
                <div key={row.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-charcoal">{row.name}</span>
                    <span className="font-mono text-muted">{row.score}</span>
                  </div>
                  <div className="h-2 rounded-full bg-paper-deep overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald"
                      style={{ width: `${row.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {VERDICT_BANDS.map((band) => (
            <div
              key={band.range}
              className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs"
            >
              <span className="font-mono text-muted">{band.range}</span>
              <span className="text-charcoal font-medium">{band.label}</span>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
