import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-deep">
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 font-serif text-xl font-semibold text-ink mb-3">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald" />
            VenturePulse
          </Link>
          <p className="text-sm text-muted max-w-sm leading-relaxed">
            Validate. Analyze. Improve. A structured second opinion on your startup idea —
            before you spend months building it.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink mb-3">Product</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><a href="#how-it-works" className="hover:text-ink">How it works</a></li>
            <li><a href="#features" className="hover:text-ink">Features</a></li>
            <li><a href="#analysis-categories" className="hover:text-ink">Analysis categories</a></li>
            <li><a href="#faq" className="hover:text-ink">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link to="/register" className="hover:text-ink">Get Started</Link></li>
            <li><a href="mailto:hello@venturepulse.app" className="hover:text-ink">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
          <p>© {new Date().getFullYear()} VenturePulse. All rights reserved.</p>
          <p>Analysis is a structured opinion based on the information you provide — not a guarantee of outcome.</p>
        </div>
      </div>
    </footer>
  );
}
