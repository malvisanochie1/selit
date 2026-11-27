import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';

export type Crumb = { href: string; label: string };

type PageHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: string;
  crumbs?: Crumb[];
  action?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  eyebrow,
  crumbs,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('pt-8 pb-8 sm:pt-12 sm:pb-10', className)}>
      {crumbs?.length ? (
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-ink-500">
            {crumbs.map((crumb, index) => (
              <li key={crumb.href} className="flex items-center gap-1">
                {index > 0 ? <ChevronRight className="size-3.5 text-ink-300" /> : null}
                <Link href={crumb.href} className="transition-colors hover:text-ink-900">
                  {crumb.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <Reveal>
          {eyebrow ? (
            <p className="mb-3 text-xs font-bold tracking-[0.18em] text-brand-600 uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-4xl leading-[1.05] font-semibold text-ink-900 sm:text-5xl">
            {title}
          </h1>
          {description ? (
            <div className="mt-3 max-w-2xl text-base text-ink-500 sm:text-lg">{description}</div>
          ) : null}
        </Reveal>
        {action ? (
          <Reveal delay={0.1} className="shrink-0">
            {action}
          </Reveal>
        ) : null}
      </div>
    </div>
  );
}
