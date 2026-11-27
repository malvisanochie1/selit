import { MobileNav } from '@/components/layout/MobileNav';
import { SampleModeBanner } from '@/components/layout/SampleModeBanner';
import { SideNav } from '@/components/layout/SideNav';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { SessionHydrator } from '@/features/auth/components/SessionHydrator';
import { requireSession } from '@/features/auth/server/get-session';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSession('/account');

  return (
    <>
      <SampleModeBanner />
      <SiteHeader />
      <main id="main" className="container-page pt-6 pb-20 lg:pt-10">
        <SessionHydrator user={user} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[15rem_1fr] lg:gap-10">
          <SideNav
            menu="account"
            label="Your account"
            footer={
              <ButtonLink href="/sell" fullWidth>
                List something
              </ButtonLink>
            }
          />
          <div className="min-w-0">{children}</div>
        </div>
      </main>
      <MobileNav />
    </>
  );
}
