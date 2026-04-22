import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { FeaturesAccordion } from '@/components/FeaturesAccordion';
import { HowItWorks } from '@/components/HowItWorks';
import { SecurityGrid } from '@/components/SecurityGrid';
import { ShariaBanner } from '@/components/ShariaBanner';
import { ComparisonTable } from '@/components/ComparisonTable';
import { FAQAccordion } from '@/components/FAQAccordion';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-base-dark text-base-beige">
      <Navigation />
      <Hero />
      <FeaturesAccordion />
      <HowItWorks />
      <SecurityGrid />
      <ShariaBanner />
      <ComparisonTable />
      <FAQAccordion />
      <Footer />
    </main>
  );
}
