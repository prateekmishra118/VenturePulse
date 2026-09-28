import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/Button';
import { LoadingState, ErrorBanner, VerdictBadge, categoryLabel } from '@/components/StatusDisplay';
import { CategoryCard } from '@/components/analysis/CategoryCard';
import { CriticPanel } from '@/components/analysis/CriticPanel';
import * as analysisService from '@/services/analysisService';
import { ApiClientError } from '@/services/apiClient';
import type { Analysis } from '@/types/api';

const POLL_INTERVAL_MS = 3000;

export function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const data = await analysisService.getAnalysis(id);
      setAnalysis(data);
      setError(null);

      if (data.status === 'PENDING' || data.status === 'ANALYZING') {
        pollTimer.current = setTimeout(load, POLL_INTERVAL_MS);
      }
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to load analysis.');
    }
  }, [id]);

  useEffect(() => {
    load();
    return () => {
      if (pollTimer.current) clearTimeout(pollTimer.current);
    };
  }, [load]);

  if (error && !analysis) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <ErrorBanner message={error} onRetry={load} />
      </div>
    );
  }

  if (!analysis) return <LoadingState label="Loading analysis..." />;

  if (analysis.status === 'PENDING' || analysis.status === 'ANALYZING') {
    return <ProgressView startupName={analysis.idea.startupName} />;
  }

  if (analysis.status === 'FAILED') {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <span className="text-4xl mb-4 block">⚠️</span>
        <h1 className="text-2xl font-semibold text-ink mb-3">This analysis failed to complete</h1>
        <p className="text-muted mb-8">
          Something went wrong while analyzing "{analysis.idea.startupName}" — this is usually a temporary AI
          provider or network issue. Your idea is safe; try running the analysis again.
        </p>
        <Link to={`/ideas/${analysis.idea.id}`}>
          <Button>Back to idea</Button>
        </Link>
      </div>
    );
  }

  return <ResultsView analysis={analysis} onUpdate={setAnalysis} />;
}

function ProgressView({ startupName }: { startupName: string }) {
  return (
    <div className="max-w-xl mx-auto px-6 py-28 text-center">
      <div className="animate-pulse text-4xl mb-6">🔎</div>
      <h1 className="text-2xl font-semibold text-ink mb-3">Analyzing "{startupName}"...</h1>
      <p className="text-muted">
        Running the idea through all 9 scoring categories, the AI Critic, and a set of recommendations. This
        usually takes under a minute.
      </p>
    </div>
  );
}

function ResultsView({ analysis, onUpdate }: { analysis: Analysis; onUpdate: (a: Analysis) => void }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <div className="rounded-2xl border border-line bg-white p-8 mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">{analysis.idea.startupName}</p>
        <div className="flex items-end justify-center gap-2 mb-3">
          <span className="font-serif text-6xl font-semibold text-ink">{analysis.overallScore}</span>
          <span className="text-muted mb-2">/ 100</span>
        </div>
        {analysis.verdict && <VerdictBadge verdict={analysis.verdict} />}
      </div>

      <h2 className="text-lg font-semibold text-ink mb-4">Category Scores</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {analysis.scores.map((s) => (
          <CategoryCard
            key={s.id}
            category={s.category}
            score={s.score}
            rationale={s.rationale}
            detail={detailForCategory(s.category, analysis)}
            extra={extraForCategory(s.category, analysis)}
          />
        ))}
      </div>

      {analysis.aiCritique && (
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-ink mb-4">AI Critic</h2>
          <CriticPanel critique={analysis.aiCritique} />
        </section>
      )}

      {analysis.recommendations.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-ink mb-4">Recommendations</h2>
          <div className="space-y-3">
            {analysis.recommendations.map((r) => (
              <div key={r.id} className="rounded-lg border border-line bg-white px-5 py-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-ink/10 text-ink">{r.priority}</span>
                  <h3 className="text-sm font-semibold text-ink">{r.title}</h3>
                </div>
                <p className="text-sm text-muted">{r.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <ActionTools analysis={analysis} onUpdate={onUpdate} />
    </div>
  );
}

function detailForCategory(category: string, a: Analysis) {
  switch (category) {
    case 'PROBLEM_STRENGTH':
      return a.problemAnalysis;
    case 'MARKET':
      return a.marketAnalysis;
    case 'COMPETITION':
      return a.competitionAnalysis;
    case 'BUSINESS_MODEL':
      return a.businessModelAnalysis;
    case 'FEASIBILITY':
      return a.feasibilityAnalysis;
    case 'RISK':
      return a.riskAnalysis;
    default:
      return null;
  }
}

function extraForCategory(category: string, a: Analysis) {
  if (category === 'COMPETITION' && a.competitionAnalysis?.competitors.length) {
    return (
      <div className="pt-2">
        <p className="font-semibold text-ink mb-1">Competitors</p>
        <ul className="space-y-1">
          {a.competitionAnalysis.competitors.map((c) => (
            <li key={c.id} className="text-muted">
              <span className="text-charcoal font-medium">{c.name}</span>
              {c.price ? ` — ${c.price}` : ''}
              {c.differentiation ? ` — ${c.differentiation}` : ''}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (category === 'RISK' && a.riskAnalysis?.risks.length) {
    return (
      <div className="pt-2">
        <p className="font-semibold text-ink mb-1">Identified Risks</p>
        <ul className="space-y-1">
          {a.riskAnalysis.risks.map((r) => (
            <li key={r.id} className="text-muted">
              <span className="text-charcoal font-medium">[{r.severity}] {categoryLabel(r.type)}:</span> {r.description}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
}

function ActionTools({ analysis, onUpdate }: { analysis: Analysis; onUpdate: (a: Analysis) => void }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(action: string, fn: () => Promise<unknown>) {
    setLoading(action);
    setError(null);
    try {
      await fn();
      const refreshed = await analysisService.getAnalysis(analysis.id);
      onUpdate(refreshed);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : `Failed to ${action}.`);
    } finally {
      setLoading(null);
    }
  }

  async function handleDownloadReport() {
    setLoading('report');
    setError(null);
    try {
      await analysisService.generateReport(analysis.id);
      const res = await fetch(`/api/analyses/${analysis.id}/report?format=markdown`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('venturepulse_token') || ''}` }
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `venturepulse-report-${analysis.id}.md`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('Failed to generate report.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" disabled={!!loading} onClick={() => run('improve', () => analysisService.improveIdea(analysis.id))}>
          {loading === 'improve' ? 'Improving...' : 'Improve My Idea'}
        </Button>
        <Button variant="secondary" disabled={!!loading} onClick={() => run('mvp', () => analysisService.generateMvp(analysis.id))}>
          {loading === 'mvp' ? 'Generating...' : 'Generate MVP'}
        </Button>
        <Button variant="secondary" disabled={!!loading} onClick={() => run('experiments', () => analysisService.generateExperiments(analysis.id))}>
          {loading === 'experiments' ? 'Generating...' : 'Generate Validation Experiments'}
        </Button>
        <Button variant="secondary" disabled={!!loading} onClick={handleDownloadReport}>
          {loading === 'report' ? 'Preparing...' : 'Download Report'}
        </Button>
      </div>

      {error && <ErrorBanner message={error} />}

      {analysis.improvedIdea && (
        <div className="rounded-xl border border-line bg-white p-6">
          <h3 className="text-lg font-semibold text-ink mb-3">Improved Idea</h3>
          <p className="text-sm text-charcoal leading-relaxed mb-3">{analysis.improvedIdea.improvedIdea}</p>
          <p className="text-sm mb-3"><span className="font-semibold text-emerald-dark">Why it's better: </span>{analysis.improvedIdea.whyBetter}</p>
          <p className="text-sm font-semibold text-ink mb-1">Trade-offs</p>
          <ul className="text-sm text-muted space-y-1">
            {analysis.improvedIdea.tradeOffs.map((t, i) => <li key={i}>— {t}</li>)}
          </ul>
        </div>
      )}

      {analysis.mvpPlan && (
        <div className="rounded-xl border border-line bg-white p-6 space-y-3">
          <h3 className="text-lg font-semibold text-ink">MVP Plan</h3>
          <p className="text-sm"><span className="font-semibold text-ink">Objective: </span>{analysis.mvpPlan.objective}</p>
          <FeatureList title="Must-Have Features" items={analysis.mvpPlan.mustHaveFeatures} />
          <FeatureList title="Should-Have Features" items={analysis.mvpPlan.shouldHaveFeatures} />
          <FeatureList title="Later Features" items={analysis.mvpPlan.laterFeatures} />
          <p className="text-sm"><span className="font-semibold text-ink">Target Users: </span>{analysis.mvpPlan.targetUsers}</p>
          <p className="text-sm"><span className="font-semibold text-ink">Core User Journey: </span>{analysis.mvpPlan.coreUserJourney}</p>
          <p className="text-sm"><span className="font-semibold text-ink">Development Priority: </span>{analysis.mvpPlan.developmentPriority}</p>
        </div>
      )}

      {analysis.validationExperiments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-ink mb-3">Validation Experiments</h3>
          <div className="space-y-4">
            {analysis.validationExperiments.map((exp) => (
              <div key={exp.id} className="rounded-xl border border-line bg-white p-6">
                <h4 className="font-semibold text-ink mb-3">{exp.experimentName}</h4>
                <dl className="grid sm:grid-cols-2 gap-3 text-sm">
                  <Field label="Hypothesis" value={exp.hypothesis} />
                  <Field label="Target Audience" value={exp.targetAudience} />
                  <Field label="Method" value={exp.method} />
                  <Field label="Required Sample" value={exp.requiredSample} />
                  <Field label="Success Metric" value={exp.successMetric} />
                  <Field label="Failure Threshold" value={exp.failureThreshold} />
                  <Field label="Duration" value={exp.duration} />
                  <Field label="Decision" value={exp.decision} />
                </dl>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function FeatureList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="text-sm font-semibold text-ink mb-1">{title}</p>
      <ul className="text-sm text-muted space-y-1">
        {items.map((i, idx) => <li key={idx}>— {i}</li>)}
      </ul>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="text-charcoal">{value}</dd>
    </div>
  );
}
