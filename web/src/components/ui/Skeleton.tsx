import { cn } from '@/lib/cn';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-shimmer rounded-2xl bg-[linear-gradient(90deg,var(--color-ink-100)_25%,var(--color-canvas)_50%,var(--color-ink-100)_75%)] bg-[length:200%_100%]',
        className,
      )}
    />
  );
}
