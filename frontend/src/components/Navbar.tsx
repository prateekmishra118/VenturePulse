import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';

const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Analysis', href: '#analysis-categories' },
  { label: 'FAQ', href: '#faq' }
];

export function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur border-b border-line">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-serif text-xl font-semibold text-ink">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald" />
          VenturePulse
        </Link>

        {!user && (
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-charcoal/80 hover:text-ink transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-muted">Hi, {user.name.split(' ')[0]}</span>
              <Button variant="ghost" size="md" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button variant="secondary" size="md" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="md" onClick={() => navigate('/login')} className="hidden sm:inline-flex">
                Log in
              </Button>
              <Button variant="primary" size="md" onClick={() => navigate('/register')}>
                Validate Your Idea
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
