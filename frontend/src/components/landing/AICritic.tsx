import { AnimatedSection } from '@/components/AnimatedSection';
import { SectionHeading } from '@/components/SectionHeading';

const CRITIC_BLOCKS = [
  {
    label: 'Biggest Risk',
    tone: 'coral' as const,
    text: 'Campus delivery apps already exist with logistics infrastructure in place — your CAC could exceed what a student customer is worth.'
  },
  {
    label: 'Hidden Assumption',
    tone: 'gold' as const,
    text: "You're assuming students will switch apps for a ₹10 price difference. That hasn't been tested."
  },
  {
    label: 'Hard Question',
    tone: 'ink' as const,
    text: 'What stops the incumbent from matching your price the week you launch?'
  }
];

const TONE_CLASSES: Record<string, string> = {
  coral: 'border-coral/30 bg-coral-light text-coral',
  gold: 'border-gold/30 bg-gold-light text-[#8a6d14]',
  ink: 'border-ink/15 bg-ink/5 text-ink'
};

export function AICritic() {
  return (
    <AnimatedSection className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="AI Critic"
        title="An advisor that pushes back, not one that cheers you on"
        description="The AI Critic is instructed to behave like a skeptical startup advisor — it looks for reasons an idea could fail before it looks for reasons to like it."
      />

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {CRITIC_BLOCKS.map((block) => (
          <div key={block.label} className={`rounded-xl border p-6 ${TONE_CLASSES[block.tone]}`}>
            <span className="text-xs font-semibold tracking-wide uppercase opacity-80">
              {block.label}
            </span>
            <p className="text-sm leading-relaxed mt-3 text-charcoal">{block.text}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-line bg-white p-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
        <span className="font-semibold text-ink">Also generated per analysis:</span>
        <span>Strengths</span>
        <span>·</span>
        <span>Weaknesses</span>
        <span>·</span>
        <span>Why This Could Fail</span>
        <span>·</span>
        <span>Recommended Actions</span>
      </div>
    </AnimatedSection>
  );
}
