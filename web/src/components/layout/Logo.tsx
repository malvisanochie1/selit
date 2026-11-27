import Link from 'next/link';

import { cn } from '@/lib/cn';

import { LogoMark } from './LogoMark';

type LogoProps = {
  tone?: 'dark' | 'light';
  className?: string;
};

export function Logo({ tone = 'dark', className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Selit home"
      className={cn('group inline-flex items-center gap-2 rounded-xl', className)}
    >
      <LogoMark className="transition-transform duration-500 ease-out-soft group-hover:-rotate-6" />
      <span
        className={cn(
          'font-display text-[1.6rem] leading-none font-bold tracking-[-0.04em]',
          tone === 'dark' ? 'text-ink-900' : 'text-white',
        )}
      >
        Selit
      </span>
    </Link>
  );
}
