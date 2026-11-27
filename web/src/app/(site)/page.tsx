import { ApartmentsTeaser } from '@/features/home/components/ApartmentsTeaser';
import { CategoryShowcase } from '@/features/home/components/CategoryShowcase';
import { FreshListings } from '@/features/home/components/FreshListings';
import { HomeHero } from '@/features/home/components/HomeHero';
import { HowItWorks } from '@/features/home/components/HowItWorks';
import { SafetyBand } from '@/features/home/components/SafetyBand';
import { SchoolsBand } from '@/features/home/components/SchoolsBand';
import { SellCta } from '@/features/home/components/SellCta';

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <FreshListings />
      <CategoryShowcase />
      <ApartmentsTeaser />
      <HowItWorks />
      <SafetyBand />
      <SchoolsBand />
      <SellCta />
    </>
  );
}
