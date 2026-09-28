import { useState } from 'react';
import { AnimatedSection } from '@/components/AnimatedSection';
import { SectionHeading } from '@/components/SectionHeading';
import type { FAQItem } from '@/types/landing';

const FAQS: FAQItem[] = [
  {
    question: 'Does VenturePulse guarantee my startup will succeed?',
    answer:
      "No. VenturePulse gives you a structured, honest assessment based on the information you provide — it identifies risks and gaps in your thinking, but it can't predict outcomes. Treat the score as a starting point for validation, not a verdict."
  },
  {
    question: 'Where do market numbers come from?',
    answer:
      'VenturePulse never invents market statistics and presents them as fact. Every figure is labeled as verified information, an estimate, an assumption, or an AI recommendation, so you always know how much to trust it.'
  },
  {
    question: 'Is the score just an AI guess?',
    answer:
      'No. The AI provides structured reasoning per category, but the final 0–100 score is calculated by the application using documented, configurable weights — not returned directly by the AI.'
  },
  {
    question: 'Can I edit my idea and re-run the analysis?',
    answer:
      'Yes. Every analysis is saved to your history, and the "Improve My Idea" tool produces a revised version you can re-validate.'
  },
  {
    question: 'Is my idea data private?',
    answer:
      "Yes. You can only access your own startup ideas and analyses. Your idea details are never shared with other users, and API keys for AI providers stay server-side."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <AnimatedSection id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <SectionHeading eyebrow="FAQ" title="Common questions" align="center" />

      <div className="space-y-3">
        {FAQS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.question} className="rounded-xl border border-line bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold text-ink">{item.question}</span>
                <span
                  className={`shrink-0 text-emerald text-lg transition-transform duration-200 ${
                    isOpen ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-muted leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AnimatedSection>
  );
}
