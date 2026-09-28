import { AnimatedSection } from '@/components/AnimatedSection';
import { SectionHeading } from '@/components/SectionHeading';

const EXPERIMENT_FIELDS = [
  { label: 'Hypothesis', value: 'Students are willing to pay ₹30 for campus delivery.' },
  { label: 'Target Audience', value: 'Undergraduate students living in hostels, 2 campuses.' },
  { label: 'Method', value: 'Landing page + WhatsApp pre-order signal test.' },
  { label: 'Required Sample', value: '150 unique visitors.' },
  { label: 'Success Metric', value: '30%+ meaningful purchase intent.' },
  { label: 'Duration', value: '7 days.' }
];

export function ValidationExperiments() {
  return (
    <AnimatedSection id="validation-experiments" className="bg-paper-deep border-y border-line">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow="Validation"
          title="Test your riskiest assumption before you build anything"
          description="Every experiment includes a clear decision rule, so the result tells you what to do next — not just how it went."
        />

        <div className="grid lg:grid-cols-[1fr_0.8fr] gap-8">
          <div className="rounded-2xl border border-line bg-white p-8">
            <span className="text-xs font-semibold tracking-wide uppercase text-emerald-dark bg-emerald-light px-2.5 py-1 rounded-full">
              Experiment #1
            </span>
            <h3 className="text-lg font-semibold text-ink mt-4 mb-5">
              Willingness-to-pay landing page test
            </h3>

            <dl className="grid sm:grid-cols-2 gap-5">
              {EXPERIMENT_FIELDS.map((f) => (
                <div key={f.label}>
                  <dt className="text-xs font-semibold tracking-wide uppercase text-muted mb-1">
                    {f.label}
                  </dt>
                  <dd className="text-sm text-charcoal leading-relaxed">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border border-line bg-white p-8 flex flex-col justify-center">
            <span className="text-xs font-semibold tracking-wide uppercase text-muted mb-4">
              Decision rule
            </span>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg bg-emerald-light px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-emerald" />
                <span className="text-sm text-charcoal"><strong>Continue</strong> — ≥30% intent</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-gold-light px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-gold" />
                <span className="text-sm text-charcoal"><strong>Modify</strong> — 15–29% intent</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-coral-light px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-coral" />
                <span className="text-sm text-charcoal"><strong>Reject</strong> — &lt;15% intent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
