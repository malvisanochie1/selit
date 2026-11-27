import { cn } from '@/lib/cn';

type BadgeTone = 'neutral' | 'brand' | 'amber' | 'danger' | 'info' | 'dark';

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-ink-100 text-ink-700',
  brand: 'bg-brand-50 text-brand-700 ring-1 ring-brand-100',
  amber: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  danger: 'bg-danger-50 text-danger-700 ring-1 ring-danger-100',
  info: 'bg-info-50 text-info-700',
  dark: 'bg-ink-900/80 text-white backdrop-blur-md',
};

type BadgeProps = {
  tone?: BadgeTone;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function Badge({ tone = 'neutral', icon, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap [&_svg]:size-3.5',
        TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
