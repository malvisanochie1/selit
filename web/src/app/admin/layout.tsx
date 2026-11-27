import type { Metadata } from 'next';

import { MobileNav } from '@/components/layout/MobileNav';
import { SampleModeBanner } from '@/components/layout/SampleModeBanner';
import { SideNav } from '@/components/layout/SideNav';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SessionHydrator } from '@/features/auth/components/SessionHydrator';
import { requireSession } from '@/features/auth/server/get-session';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · Selit admin' },
  robots: { index: false, follow: false },
};

/** Admin access is checked on the server against the database profile on every request. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSession('/admin', ['admin']);

  return (
    <>
      <SampleModeBanner />
      <SiteHeader />
      <main id="main" className="container-page pt-6 pb-20 lg:pt-10">
        <SessionHydrator user={user} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[15rem_1fr] lg:gap-10">
          <SideNav
            menu="admin"
            label="Admin"
            footer={<p className="px-4 text-xs text-ink-400">Signed in as an administrator.</p>}
          />
          <div className="min-w-0">{children}</div>
        </div>
      </main>
      <MobileNav />
    </>
  );
}
