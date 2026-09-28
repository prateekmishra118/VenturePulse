import { Link } from 'react-router-dom';
import { Button } from '@/components/Button';

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-32 text-center">
      <span className="font-serif text-6xl font-semibold text-ink/20">404</span>
      <h1 className="text-2xl font-semibold text-ink mt-4 mb-3">Page not found</h1>
      <p className="text-muted mb-8">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
