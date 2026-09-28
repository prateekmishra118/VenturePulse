import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { ApiClientError } from '@/services/apiClient';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-2xl font-semibold text-ink mb-2">Create your account</h1>
      <p className="text-muted mb-8">Start validating your startup idea in a couple of minutes.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-ink-soft mb-1" htmlFor="name">Full name</label>
          <input
            id="name"
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-line bg-white px-4 py-2.5 focus:outline-none focus:border-emerald"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink-soft mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-line bg-white px-4 py-2.5 focus:outline-none focus:border-emerald"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink-soft mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-line bg-white px-4 py-2.5 focus:outline-none focus:border-emerald"
          />
          <p className="text-xs text-muted mt-1">At least 8 characters.</p>
        </div>

        {error && <p className="text-sm text-coral">{error}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="text-sm text-muted mt-6 text-center">
        Already have an account? <Link to="/login" className="text-emerald font-semibold">Log in</Link>
      </p>
    </div>
  );
}
