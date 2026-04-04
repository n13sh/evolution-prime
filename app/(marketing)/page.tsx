import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { FooterSection } from '@/components/landing/FooterSection';
import { NavBar } from '@/components/landing/NavBar';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-surface-base overflow-hidden">
      <NavBar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <PricingSection />
      <FooterSection />
    </main>
  );
}
