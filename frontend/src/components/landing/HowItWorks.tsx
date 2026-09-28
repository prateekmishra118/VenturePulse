import { AnimatedSection } from '@/components/AnimatedSection';
import { SectionHeading } from '@/components/SectionHeading';
import type { HowItWorksStep } from '@/types/landing';

const STEPS: HowItWorksStep[] = [
  {
    step: 1,
    title: 'Describe your idea',
    description:
      'Fill in a structured form: the problem, your target customer, market, business model, and known competitors.'
  },
  {
    step: 2,
    title: 'VenturePulse analyzes it',
    description:
      'Nine categories are evaluated — from problem strength to risk — each scored and backed by a written rationale.'
  },
  {
    step: 3,
    title: 'Get a skeptical second opinion',
    description:
      'The AI Critic surfaces weaknesses, hidden assumptions, and the questions a sharp investor would ask.'
  },
  {
    step: 4,
    title: 'Improve and validate',
    description:
      'Use the improved idea, MVP plan, and validation experiments to test your riskiest assumptions cheaply.'
  }
];

export function HowItWorks() {
  return (
    <AnimatedSection id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="Process"
        title="How VenturePulse Works"
        description="A structured pipeline, not a chat window — every step produces something concrete."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STEPS.map((s) => (
          <div key={s.step} className="relative rounded-xl border border-line bg-white p-6">
            <span className="font-serif text-3xl text-emerald/40 font-semibold">
              {String(s.step).padStart(2, '0')}
            </span>
            <h3 className="text-lg font-semibold text-ink mt-3 mb-2">{s.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
