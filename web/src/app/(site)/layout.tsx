import { MobileNav } from '@/components/layout/MobileNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SampleModeBanner } from '@/components/layout/SampleModeBanner';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SampleModeBanner />
      <SiteHeader />
      <main id="main" className="min-h-[70dvh]">
        {children}
      </main>
      <SiteFooter />
      <MobileNav />
    </>
  );
}
