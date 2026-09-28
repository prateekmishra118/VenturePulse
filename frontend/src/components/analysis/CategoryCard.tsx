import { useState } from 'react';
import { categoryLabel } from '@/components/StatusDisplay';
import type { CategoryDetail } from '@/types/api';

interface CategoryCardProps {
  category: string;
  score: number;
  rationale: string;
  detail?: CategoryDetail | null;
  extra?: React.ReactNode;
}

export function CategoryCard({ category, score, rationale, detail, extra }: CategoryCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-line bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => detail && setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div>
          <h3 className="text-sm font-semibold text-ink">{categoryLabel(category)}</h3>
          <p className="text-xs text-muted mt-0.5">{rationale}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-serif text-2xl font-semibold text-ink">{score}</span>
          {detail && (
            <span className={`text-emerald text-lg transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
          )}
        </div>
      </button>

      {open && detail && (
        <div className="px-5 pb-5 border-t border-line pt-4 space-y-3 text-sm">
          <p className="text-charcoal leading-relaxed">{detail.findings}</p>
          <p><span className="font-semibold text-emerald-dark">Strength: </span>{detail.strength}</p>
          <p><span className="font-semibold text-coral">Weakness: </span>{detail.weakness}</p>
          <p><span className="font-semibold text-ink">Recommendation: </span>{detail.recommendation}</p>
          {extra}
        </div>
      )}
    </div>
  );
}
