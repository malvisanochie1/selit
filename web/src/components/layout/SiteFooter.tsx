import { SITE } from '@selit/shared';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import { FOOTER_NAV } from '@/config/navigation';

import { Logo } from './Logo';

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-24 overflow-hidden bg-ink-950 text-ink-300">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl"
      />
      <div className="relative container-page grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-sm">
          <Logo tone="light" />
          <p className="mt-5 leading-relaxed text-ink-300">
            Buy and sell what students actually need, and find a place to live near campus. Built in
            Ogwashi-Uku for students across Nigeria.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-3.5 py-2 text-sm text-ink-200 ring-1 ring-white/10">
            <ShieldCheck className="size-4 text-glow" />
            Never pay before you inspect.
          </p>
        </div>
        {FOOTER_NAV.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="font-sans text-sm font-semibold tracking-wide text-white">
              {group.title}
            </h2>
            <ul className="mt-4 space-y-3">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.95rem] transition-colors duration-300 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="relative container-page flex flex-col gap-3 border-t border-white/10 py-6 text-sm text-ink-400 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {SITE.name}. Made for students in Nigeria.
        </p>
        <div className="flex gap-5">
          <a
            href={SITE.social.instagram}
            className="hover:text-white"
            rel="noopener noreferrer"
            target="_blank"
          >
            Instagram
          </a>
          <a
            href={SITE.social.x}
            className="hover:text-white"
            rel="noopener noreferrer"
            target="_blank"
          >
            X
          </a>
        </div>
      </div>
    </footer>
  );
}
