import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/Button';
import { LoadingState, ErrorBanner, VerdictBadge, StatusPill } from '@/components/StatusDisplay';
import * as ideaService from '@/services/ideaService';
import * as analysisService from '@/services/analysisService';
import { ApiClientError } from '@/services/apiClient';
import type { StartupIdea } from '@/types/api';

export function IdeaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<StartupIdea | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const load = useCallback(() => {
    if (!id) return;
    setError(null);
    ideaService
      .getIdea(id)
      .then(setIdea)
      .catch((err) => setError(err instanceof ApiClientError ? err.message : 'Failed to load idea.'));
  }, [id]);

  useEffect(load, [load]);

  async function handleAnalyze() {
    if (!id) return;
    setIsStarting(true);
    setError(null);
    try {
      const analysis = await analysisService.analyzeIdea(id);
      navigate(`/analyses/${analysis.id}`);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to start analysis.');
      setIsStarting(false);
    }
  }

  if (error && !idea) return <div className="max-w-3xl mx-auto px-6 py-16"><ErrorBanner message={error} onRetry={load} /></div>;
  if (!idea) return <LoadingState label="Loading idea..." />;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-ink mb-1">{idea.startupName}</h1>
          <p className="text-muted">{idea.industry} · {idea.location || 'Location not specified'}</p>
        </div>
        <Button size="lg" onClick={handleAnalyze} disabled={isStarting}>
          {isStarting ? 'Starting...' : 'Start Validation'}
        </Button>
      </div>

      {error && <div className="mb-6"><ErrorBanner message={error} /></div>}

      <div className="rounded-xl border border-line bg-white p-6 mb-8 space-y-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-1">Idea</h3>
          <p className="text-sm text-charcoal leading-relaxed">{idea.ideaDescription}</p>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-1">Problem</h3>
          <p className="text-sm text-charcoal leading-relaxed">{idea.problem}</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-1">Target Customer</h3>
            <p className="text-sm text-charcoal">{idea.targetCustomer}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-1">Business Model</h3>
            <p className="text-sm text-charcoal">{idea.businessModel}</p>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-ink mb-4">Analysis History</h2>
      {!idea.analyses || idea.analyses.length === 0 ? (
        <p className="text-sm text-muted">No analyses yet — click "Start Validation" above.</p>
      ) : (
        <div className="space-y-3">
          {idea.analyses.map((a) => (
            <Link
              key={a.id}
              to={`/analyses/${a.id}`}
              className="flex items-center justify-between gap-4 rounded-lg border border-line bg-white px-5 py-4 hover:border-emerald transition-colors"
            >
              <div>
                <p className="text-sm text-muted">{new Date(a.createdAt).toLocaleString()}</p>
                {a.overallScore !== null && <p className="font-serif text-xl font-semibold text-ink">{a.overallScore}/100</p>}
              </div>
              <div className="flex items-center gap-2">
                {a.verdict && <VerdictBadge verdict={a.verdict} />}
                <StatusPill status={a.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
