'use client';

import { Heart, Plus } from 'lucide-react';
import * as m from 'motion/react-m';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { DURATION, EASE_OUT } from '@/components/motion/motion.constants';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Skeleton } from '@/components/ui/Skeleton';
import { PRIMARY_NAV } from '@/config/navigation';
import { useSession } from '@/features/auth/hooks/use-session';
import { useSavedListings } from '@/features/saved/use-saved-listings';
import { cn } from '@/lib/cn';

import { AccountMenu } from './AccountMenu';
import { HeaderSearch } from './HeaderSearch';
import { Logo } from './Logo';

export function SiteHeader() {
  const pathname = usePathname();
  const { user, isLoading } = useSession();
  const { savedIds } = useSavedListings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-500 ease-out-soft',
        isScrolled
          ? 'border-line bg-surface/85 shadow-[0_8px_30px_-20px_rgb(13_27_52/0.25)] backdrop-blur-xl'
          : 'border-transparent bg-canvas/70 backdrop-blur-md',
      )}
    >
      <div className="container-page flex h-[4.25rem] items-center gap-4 lg:h-20 lg:gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block" onMouseLeave={() => setHovered(null)}>
          <ul className="flex items-center gap-1">
            {PRIMARY_NAV.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href} className="relative">
                  {hovered === item.href ? (
                    <m.span
                      layoutId="header-nav-hover"
                      className="absolute inset-0 rounded-xl bg-ink-100"
                      transition={{ duration: DURATION.base, ease: EASE_OUT }}
                    />
                  ) : null}
                  <Link
                    href={item.href}
                    onMouseEnter={() => setHovered(item.href)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'relative block rounded-xl px-3.5 py-2 text-[0.94rem] font-semibold transition-colors duration-300',
                      isActive ? 'text-brand-700' : 'text-ink-600 hover:text-ink-900',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <HeaderSearch className="ml-auto hidden w-full max-w-xs md:block xl:max-w-sm" />

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link
            href="/saved"
            aria-label={`Saved items (${savedIds.length})`}
            className="relative hidden size-11 items-center justify-center rounded-2xl text-ink-700 transition-colors hover:bg-ink-100 hover:text-ink-900 sm:flex"
          >
            <Heart className="size-5" />
            {savedIds.length > 0 ? (
              <span className="absolute top-1.5 right-1.5 flex min-w-4.5 items-center justify-center rounded-full bg-brand-500 px-1 text-[0.65rem] leading-[1.1rem] font-bold text-white tabular-nums">
                {savedIds.length}
              </span>
            ) : null}
          </Link>

          {isLoading ? (
            <Skeleton className="size-10 rounded-full" />
          ) : user ? (
            <AccountMenu user={user} />
          ) : (
            <ButtonLink href="/sign-in" variant="ghost" size="sm" className="h-11 px-4">
              Sign in
            </ButtonLink>
          )}

          <ButtonLink href="/sell" size="sm" className="h-11 px-4">
            <Plus />
            <span>Sell</span>
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
