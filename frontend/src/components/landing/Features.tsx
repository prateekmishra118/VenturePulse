import { AnimatedSection } from '@/components/AnimatedSection';
import { SectionHeading } from '@/components/SectionHeading';
import type { Feature } from '@/types/landing';

const FEATURES: Feature[] = [
  {
    icon: '📊',
    title: 'Weighted scoring engine',
    description:
      'Nine categories, configurable weights, and a final score calculated by the application — not a single AI guess.'
  },
  {
    icon: '🧠',
    title: 'AI Critic',
    description:
      'A dedicated, skeptical reviewer that looks for what could go wrong, not just what looks good.'
  },
  {
    icon: '🛠️',
    title: 'MVP generator',
    description:
      'Must-have vs. later features, target users, and a recommended build order — scoped to what you described.'
  },
  {
    icon: '🧪',
    title: 'Validation experiments',
    description:
      'Concrete, cheap tests with a hypothesis, success threshold, and a continue/modify/reject decision rule.'
  },
  {
    icon: '📁',
    title: 'Analysis history',
    description:
      'Every idea and analysis is saved to your account so you can revisit, compare, and track how a concept evolves.'
  },
  {
    icon: '📄',
    title: 'Downloadable reports',
    description:
      'Export a full report — scores, risks, recommendations, and the improved idea — to share or archive.'
  }
];

export function Features() {
  return (
    <AnimatedSection id="features" className="bg-paper-deep border-y border-line">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow="Platform"
          title="Everything you need to pressure-test an idea"
          description="Built for founders who want an honest read before they commit months of work."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl bg-white border border-line p-6">
              <div className="text-2xl mb-4">{f.icon}</div>
              <h3 className="text-base font-semibold text-ink mb-2">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
