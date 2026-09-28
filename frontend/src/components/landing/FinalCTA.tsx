import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { PulseLine } from '@/components/PulseLine';
import { AnimatedSection } from '@/components/AnimatedSection';

export function FinalCTA() {
  const navigate = useNavigate();

  return (
    <AnimatedSection className="bg-ink">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <PulseLine className="w-40 h-8 text-emerald mx-auto mb-8" stroke="#1F8A5F" />
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
          Get an honest read on your idea today
        </h2>
        <p className="text-white/70 max-w-xl mx-auto mb-9">
          Two minutes of input. A structured, skeptical analysis you can actually act on.
        </p>
        <Button size="lg" onClick={() => navigate('/register')}>
          Validate Your Idea
        </Button>
      </div>
    </AnimatedSection>
  );
}
