'use client';

import { BadgeCheck, LayoutDashboard, LogOut, Package, Settings, ShieldCheck } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { DURATION, EASE_OUT } from '@/components/motion/motion.constants';
import { Avatar } from '@/components/ui/Avatar';
import type { SessionUser } from '@/features/auth/auth.types';
import { useSignOut } from '@/features/auth/hooks/use-session';

export function AccountMenu({ user }: { user: SessionUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const signOut = useSignOut();

  useEffect(() => {
    if (!isOpen) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key !== 'Escape') return;
      if (event instanceof MouseEvent && containerRef.current?.contains(event.target as Node))
        return;
      setIsOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [isOpen]);

  const links = [
    { href: '/account', label: 'My account', icon: LayoutDashboard },
    { href: '/seller', label: 'My listings', icon: Package },
    { href: '/account/verification', label: 'Verification', icon: BadgeCheck },
    { href: '/account/settings', label: 'Settings', icon: Settings },
    ...(user.role === 'admin' ? [{ href: '/admin', label: 'Admin', icon: ShieldCheck }] : []),
  ];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Account menu"
        className="flex cursor-pointer items-center rounded-full ring-offset-2 transition-shadow duration-300 hover:ring-2 hover:ring-brand-200"
      >
        <Avatar name={user.fullName} src={user.profileImageUrl} size={40} />
      </button>
      <AnimatePresence>
        {isOpen ? (
          <m.div
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: DURATION.quick + 0.06, ease: EASE_OUT }}
            className="absolute top-[calc(100%+0.75rem)] right-0 z-50 w-64 origin-top-right rounded-3xl border border-line bg-surface p-2 shadow-float"
          >
            <div className="px-3 pt-2 pb-3">
              <p className="truncate font-semibold text-ink-900">{user.fullName}</p>
              <p className="truncate text-sm text-ink-500">{user.email}</p>
            </div>
            <div className="border-t border-line pt-1.5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-canvas hover:text-ink-900"
                >
                  <link.icon className="size-4 text-ink-400" />
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                role="menuitem"
                onClick={() => signOut.mutate()}
                className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-danger-600 transition-colors hover:bg-danger-50"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
