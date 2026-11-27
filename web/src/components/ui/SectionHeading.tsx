import { cn } from '@/lib/cn';

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  action?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'items-center text-center sm:flex-col sm:items-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow ? (
          <p className="mb-3 text-xs font-bold tracking-[0.18em] text-brand-600 uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-3xl leading-[1.08] font-semibold text-ink-900 sm:text-4xl">{title}</h2>
        {description ? (
          <p className="mt-3 text-base text-ink-500 sm:text-lg">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
