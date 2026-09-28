export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return <div className="py-20 text-center text-muted">{label}</div>;
}

export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-lg border border-coral/30 bg-coral-light px-5 py-4 text-sm text-coral flex items-center justify-between gap-4">
      <span>{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="font-semibold underline shrink-0">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="py-16 text-center">
      <p className="font-semibold text-ink mb-1">{title}</p>
      {description && <p className="text-sm text-muted">{description}</p>}
    </div>
  );
}

const VERDICT_LABELS: Record<string, string> = {
  WEAK: 'Weak',
  NEEDS_WORK: 'Needs Work',
  MODERATE_POTENTIAL: 'Moderate Potential',
  PROMISING: 'Promising',
  EXCEPTIONAL_POTENTIAL: 'Exceptional Potential'
};

const VERDICT_CLASSES: Record<string, string> = {
  WEAK: 'bg-coral-light text-coral',
  NEEDS_WORK: 'bg-gold-light text-[#8a6d14]',
  MODERATE_POTENTIAL: 'bg-ink/10 text-ink',
  PROMISING: 'bg-emerald-light text-emerald-dark',
  EXCEPTIONAL_POTENTIAL: 'bg-emerald text-white'
};

export function VerdictBadge({ verdict }: { verdict: string }) {
  return (
    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${VERDICT_CLASSES[verdict] || 'bg-ink/10 text-ink'}`}>
      {VERDICT_LABELS[verdict] || verdict}
    </span>
  );
}

const STATUS_CLASSES: Record<string, string> = {
  PENDING: 'bg-ink/10 text-ink',
  ANALYZING: 'bg-gold-light text-[#8a6d14]',
  COMPLETED: 'bg-emerald-light text-emerald-dark',
  FAILED: 'bg-coral-light text-coral'
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_CLASSES[status] || 'bg-ink/10 text-ink'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-muted mb-1">
        <span>{label}</span>
        <span className="font-mono">{score}</span>
      </div>
      <div className="h-1.5 rounded-full bg-paper-deep overflow-hidden">
        <div className="h-full rounded-full bg-emerald" style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
      </div>
    </div>
  );
}

export function categoryLabel(category: string): string {
  return category
    .split('_')
    .map((w) => w[0] + w.slice(1).toLowerCase())
    .join(' ');
}
