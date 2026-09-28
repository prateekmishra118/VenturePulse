import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/Button';
import { LoadingState, ErrorBanner, EmptyState } from '@/components/StatusDisplay';
import * as ideaService from '@/services/ideaService';
import { ApiClientError } from '@/services/apiClient';
import type { StartupIdea } from '@/types/api';

export function IdeasListPage() {
  const [ideas, setIdeas] = useState<StartupIdea[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    ideaService
      .listIdeas()
      .then(setIdeas)
      .catch((err) => setError(err instanceof ApiClientError ? err.message : 'Failed to load your ideas.'));
  }, []);

  useEffect(load, [load]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this idea and all of its analyses? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await ideaService.deleteIdea(id);
      setIdeas((prev) => prev?.filter((i) => i.id !== id) ?? null);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to delete idea.');
    } finally {
      setDeletingId(null);
    }
  }

  if (error && !ideas) return <div className="max-w-4xl mx-auto px-6 py-16"><ErrorBanner message={error} onRetry={load} /></div>;
  if (!ideas) return <LoadingState label="Loading your ideas..." />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between gap-4 mb-10">
        <h1 className="text-2xl md:text-3xl font-semibold text-ink">My Ideas</h1>
        <Link to="/ideas/new"><Button>+ New Idea</Button></Link>
      </div>

      {error && <div className="mb-6"><ErrorBanner message={error} /></div>}

      {ideas.length === 0 ? (
        <EmptyState title="No ideas yet" description="Create your first startup idea to get a structured validation." />
      ) : (
        <div className="space-y-3">
          {ideas.map((idea) => (
            <div key={idea.id} className="flex items-center justify-between gap-4 rounded-lg border border-line bg-white px-5 py-4">
              <Link to={`/ideas/${idea.id}`} className="flex-1 min-w-0">
                <p className="font-semibold text-ink">{idea.startupName}</p>
                <p className="text-sm text-muted truncate">{idea.ideaDescription}</p>
                <p className="text-xs text-muted mt-1">
                  {idea.analyses?.length ?? 0} {idea.analyses?.length === 1 ? 'analysis' : 'analyses'}
                </p>
              </Link>
              <button
                onClick={() => handleDelete(idea.id)}
                disabled={deletingId === idea.id}
                className="text-sm text-coral font-semibold shrink-0"
              >
                {deletingId === idea.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
