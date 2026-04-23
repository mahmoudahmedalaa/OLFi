import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { ProblemSection } from '@/components/ProblemSection';
import { HowItWorks } from '@/components/HowItWorks';
import { SavingsCalculator } from '@/components/SavingsCalculator';
import { FeaturesAccordion } from '@/components/FeaturesAccordion';
import { IslamicFinanceQA } from '@/components/IslamicFinanceQA';
import { ComparisonTable } from '@/components/ComparisonTable';
import { BetaTestersStories } from '@/components/BetaTestersStories';
import { FAQAccordion } from '@/components/FAQAccordion';
import { WaitlistCTA } from '@/components/WaitlistCTA';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-base-dark text-base-beige">
      <Navigation />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <SavingsCalculator />
      <FeaturesAccordion />
      <IslamicFinanceQA />
      <ComparisonTable />
      <BetaTestersStories />
      <FAQAccordion />
      <WaitlistCTA />
      <Footer />
    </main>
  );
}
