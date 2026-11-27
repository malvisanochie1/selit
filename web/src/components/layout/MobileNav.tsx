'use client';

import * as m from 'motion/react-m';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { DURATION, EASE_OUT } from '@/components/motion/motion.constants';
import { MOBILE_NAV } from '@/config/navigation';
import { cn } from '@/lib/cn';

function activeHref(pathname: string) {
  const matches = MOBILE_NAV.filter(
    (item) => pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`)),
  );
  return matches.sort((a, b) => b.href.length - a.href.length)[0]?.href ?? null;
}

/** Bottom tab bar for phones, with a pill that glides to the current tab. */
export function MobileNav() {
  const pathname = usePathname();
  const current = activeHref(pathname);

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <ul className="mx-auto grid h-[var(--mobile-nav-height)] max-w-lg grid-cols-5 px-2">
        {MOBILE_NAV.map((item) => {
          const isActive = item.href === current;
          return (
            <li key={item.href} className="relative flex items-center justify-center">
              <Link
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative flex w-full flex-col items-center gap-1 py-1.5 text-[0.68rem] font-semibold transition-colors duration-300',
                  isActive ? 'text-brand-700' : 'text-ink-500',
                )}
              >
                {isActive ? (
                  <m.span
                    layoutId="mobile-nav-pill"
                    className="absolute top-0.5 h-8 w-14 rounded-full bg-brand-50"
                    transition={{ duration: DURATION.base + 0.07, ease: EASE_OUT }}
                  />
                ) : null}
                <item.icon
                  className="relative mt-0.5 size-[1.35rem]"
                  strokeWidth={isActive ? 2.4 : 2}
                />
                <span className="relative">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
