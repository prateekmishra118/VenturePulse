import type { AICritique } from '@/types/api';

function List({ title, items, tone }: { title: string; items: string[]; tone: 'emerald' | 'coral' | 'ink' }) {
  const toneClass = tone === 'emerald' ? 'text-emerald-dark' : tone === 'coral' ? 'text-coral' : 'text-ink';
  return (
    <div>
      <h4 className={`text-xs font-semibold uppercase tracking-wide mb-2 ${toneClass}`}>{title}</h4>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-charcoal leading-relaxed flex gap-2">
            <span className="text-muted">—</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CriticPanel({ critique }: { critique: AICritique }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-coral/30 bg-coral-light p-5">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-coral mb-1">Biggest Risk</h4>
        <p className="text-sm text-charcoal leading-relaxed">{critique.biggestRisk}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <List title="Strengths" items={critique.strengths} tone="emerald" />
        <List title="Weaknesses" items={critique.weaknesses} tone="coral" />
        <List title="Hidden Assumptions" items={critique.hiddenAssumptions} tone="ink" />
        <List title="Why This Could Fail" items={critique.whyThisCouldFail} tone="coral" />
        <List title="Hard Questions" items={critique.hardQuestions} tone="ink" />
        <List title="Recommended Actions" items={critique.recommendedActions} tone="emerald" />
      </div>
    </div>
  );
}
