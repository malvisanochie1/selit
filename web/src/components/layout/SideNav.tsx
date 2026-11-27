'use client';

import * as m from 'motion/react-m';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useId } from 'react';

import { DURATION, EASE_OUT } from '@/components/motion/motion.constants';
import { ACCOUNT_NAV, ADMIN_NAV, type NavItem } from '@/config/navigation';
import { cn } from '@/lib/cn';

function currentHref(items: readonly NavItem[], pathname: string) {
  return (
    items
      .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
      .sort((a, b) => b.href.length - a.href.length)[0]?.href ?? null
  );
}

const MENUS = { account: ACCOUNT_NAV, admin: ADMIN_NAV } as const;

type SideNavProps = {
  menu: keyof typeof MENUS;
  label: string;
  footer?: React.ReactNode;
};

/** Sidebar on desktop, a scrollable row of tabs on phones; the highlight glides between items. */
export function SideNav({ menu, label, footer }: SideNavProps) {
  const items = MENUS[menu];
  const pathname = usePathname();
  const active = currentHref(items, pathname);
  const pillId = useId();

  return (
    <nav aria-label={label} className="min-w-0 lg:sticky lg:top-28 lg:self-start">
      <ul className="-mx-[max(1rem,5%)] no-scrollbar flex gap-1 overflow-x-auto px-[max(1rem,5%)] lg:mx-0 lg:flex-col lg:px-0">
        {items.map((item) => {
          const isActive = item.href === active;
          return (
            <li key={item.href} className="relative shrink-0">
              {isActive ? (
                <m.span
                  layoutId={pillId}
                  className="absolute inset-0 rounded-2xl bg-surface shadow-card ring-1 ring-line"
                  transition={{ duration: DURATION.base + 0.07, ease: EASE_OUT }}
                />
              ) : null}
              <Link
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors duration-300',
                  isActive ? 'text-ink-900' : 'text-ink-500 hover:text-ink-900',
                )}
              >
                <item.icon
                  className={cn('size-[1.1rem]', isActive ? 'text-brand-600' : 'text-ink-400')}
                />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      {footer ? <div className="mt-6 hidden lg:block">{footer}</div> : null}
    </nav>
  );
}
