import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, Pie, PieChart, Legend } from 'recharts';
import { Button } from '@/components/Button';
import { LoadingState, ErrorBanner, EmptyState, VerdictBadge, StatusPill, categoryLabel } from '@/components/StatusDisplay';
import * as dashboardService from '@/services/dashboardService';
import { ApiClientError } from '@/services/apiClient';
import type { DashboardData } from '@/types/api';

const SEVERITY_COLORS: Record<string, string> = {
  LOW: '#1F8A5F',
  MEDIUM: '#C9A227',
  HIGH: '#E4572E',
  CRITICAL: '#8A3B28'
};

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    dashboardService
      .getDashboard()
      .then(setData)
      .catch((err) => setError(err instanceof ApiClientError ? err.message : 'Failed to load dashboard.'));
  }, []);

  useEffect(load, [load]);

  if (error && !data) return <div className="max-w-5xl mx-auto px-6 py-16"><ErrorBanner message={error} onRetry={load} /></div>;
  if (!data) return <LoadingState label="Loading dashboard..." />;

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between gap-4 mb-10">
        <h1 className="text-2xl md:text-3xl font-semibold text-ink">Dashboard</h1>
        <div className="flex gap-3">
          <Link to="/ideas"><Button variant="secondary">My Ideas</Button></Link>
          <Link to="/ideas/new"><Button>+ New Idea</Button></Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        <StatCard label="Total Ideas" value={data.totalIdeas} />
        <StatCard label="Ideas Analyzed" value={data.ideasAnalyzed} />
        <StatCard label="Average Score" value={data.averageScore ?? '—'} />
        <StatCard label="Best Score" value={data.bestScore ?? '—'} />
      </div>

      {data.ideasAnalyzed === 0 ? (
        <EmptyState
          title="No completed analyses yet"
          description="Create an idea and run its first validation to see charts and history here."
        />
      ) : (
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <ChartCard title="Score History">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.charts.scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4DFD0" />
                <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} fontSize={12} />
                <YAxis domain={[0, 100]} fontSize={12} />
                <Tooltip labelFormatter={(d) => new Date(d as string).toLocaleDateString()} />
                <Line type="monotone" dataKey="score" stroke="#1F8A5F" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Category Comparison (average)">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.charts.categoryComparison} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4DFD0" />
                <XAxis type="number" domain={[0, 100]} fontSize={12} />
                <YAxis type="category" dataKey="category" tickFormatter={categoryLabel} width={110} fontSize={11} />
                <Tooltip labelFormatter={(v) => categoryLabel(String(v))} />
                <Bar dataKey="averageScore" fill="#1F8A5F" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {data.charts.riskDistribution.length > 0 && (
            <ChartCard title="Risk Distribution">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={data.charts.riskDistribution} dataKey="count" nameKey="severity" outerRadius={80} label>
                    {data.charts.riskDistribution.map((entry) => (
                      <Cell key={entry.severity} fill={SEVERITY_COLORS[entry.severity] || '#6B6255'} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </div>
      )}

      <h2 className="text-lg font-semibold text-ink mb-4">Recent Analyses</h2>
      {data.recentAnalyses.length === 0 ? (
        <p className="text-sm text-muted">No analyses yet.</p>
      ) : (
        <div className="space-y-3">
          {data.recentAnalyses.map((a) => (
            <Link
              key={a.id}
              to={`/analyses/${a.id}`}
              className="flex items-center justify-between gap-4 rounded-lg border border-line bg-white px-5 py-4 hover:border-emerald transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-ink">{a.idea.startupName}</p>
                <p className="text-xs text-muted">{new Date(a.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                {a.overallScore !== null && <span className="font-serif font-semibold text-ink">{a.overallScore}/100</span>}
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

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-ink text-white p-5">
      <div className="font-serif text-3xl font-semibold text-gold">{value}</div>
      <div className="text-sm text-white/75 mt-1">{label}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-white p-6">
      <h3 className="text-sm font-semibold text-ink mb-4">{title}</h3>
      {children}
    </div>
  );
}
