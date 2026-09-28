import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Features } from '@/components/landing/Features';
import { AnalysisCategories } from '@/components/landing/AnalysisCategories';
import { ExampleScore } from '@/components/landing/ExampleScore';
import { AICritic } from '@/components/landing/AICritic';
import { ValidationExperiments } from '@/components/landing/ValidationExperiments';
import { FAQ } from '@/components/landing/FAQ';
import { FinalCTA } from '@/components/landing/FinalCTA';

export function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <AnalysisCategories />
      <ExampleScore />
      <AICritic />
      <ValidationExperiments />
      <FAQ />
      <FinalCTA />
    </>
  );
}
