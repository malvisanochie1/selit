import { cn } from '@/lib/cn';

type ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
  icon?: React.ReactNode;
};

export function Chip({ isActive = false, icon, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      className={cn(
        'inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-semibold whitespace-nowrap',
        'transition-[background-color,border-color,color,transform] duration-[440ms] ease-out-soft active:scale-[0.96] [&_svg]:size-4',
        isActive
          ? 'border-ink-900 bg-ink-900 text-white'
          : 'border-line-strong bg-surface text-ink-700 hover:border-ink-300 hover:text-ink-900',
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
