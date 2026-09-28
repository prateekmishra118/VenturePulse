import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { PulseLine } from '@/components/PulseLine';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-emerald-dark bg-emerald-light px-3 py-1.5 rounded-full mb-6">
              Startup idea validation
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.08] text-ink mb-6">
              Know Your Startup Before You Build It.
            </h1>

            <p className="text-lg text-muted leading-relaxed max-w-xl mb-9">
              VenturePulse analyzes your startup idea, challenges your assumptions, identifies risks,
              and gives you a practical path toward validation.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" onClick={() => navigate('/register')}>
                Validate Your Idea
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => document.getElementById('example-score')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Demo
              </Button>
            </div>

            <p className="text-xs text-muted mt-6">
              No credit card required · Analysis takes about 2 minutes
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="relative"
          >
            <div className="rounded-2xl border border-line bg-white shadow-xl shadow-ink/5 p-7">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-semibold tracking-wide uppercase text-muted">
                  Overall Score
                </span>
                <span className="text-xs font-semibold text-emerald-dark bg-emerald-light px-2.5 py-1 rounded-full">
                  Promising
                </span>
              </div>

              <div className="flex items-end gap-3 mb-6">
                <span className="font-serif text-6xl font-semibold text-ink">78</span>
                <span className="text-muted mb-2">/ 100</span>
              </div>

              <PulseLine className="w-full h-10 text-emerald mb-6" />

              <div className="space-y-3">
                {[
                  { label: 'Problem Strength', value: 82 },
                  { label: 'Market Potential', value: 71 },
                  { label: 'Competition', value: 64 }
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between text-xs text-muted mb-1">
                      <span>{row.label}</span>
                      <span>{row.value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-paper-deep overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald"
                        style={{ width: `${row.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-muted mt-3 text-center">
              Illustrative example — not a real analysis
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
