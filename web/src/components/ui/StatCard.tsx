import { CountUp } from '@/components/motion/CountUp';
import { cn } from '@/lib/cn';

type StatCardProps = {
  label: string;
  value: number;
  icon: React.ReactNode;
  hint?: string;
  suffix?: string;
  decimals?: number;
  tone?: 'brand' | 'amber' | 'info' | 'danger';
  className?: string;
};

const TONES = {
  brand: 'bg-brand-50 text-brand-700',
  amber: 'bg-amber-50 text-amber-700',
  info: 'bg-info-50 text-info-700',
  danger: 'bg-danger-50 text-danger-700',
};

export function StatCard({
  label,
  value,
  icon,
  hint,
  suffix,
  decimals,
  tone = 'brand',
  className,
}: StatCardProps) {
  return (
    <div className={cn('rounded-3xl border border-line bg-surface p-5', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink-500">{label}</p>
        <span
          className={cn(
            'flex size-9 items-center justify-center rounded-xl [&_svg]:size-[1.1rem]',
            TONES[tone],
          )}
        >
          {icon}
        </span>
      </div>
      <p className="mt-4 font-display text-4xl leading-none font-bold text-ink-900">
        <CountUp to={value} suffix={suffix} decimals={decimals} durationSeconds={1.2} />
      </p>
      {hint ? <p className="mt-2 text-xs text-ink-500">{hint}</p> : null}
    </div>
  );
}
