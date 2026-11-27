import { cn } from '@/lib/cn';

export type ButtonVariant =
  'primary' | 'dark' | 'secondary' | 'ghost' | 'accent' | 'danger' | 'whatsapp';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-500 text-white shadow-glow hover:bg-brand-600 disabled:bg-brand-300 disabled:shadow-none',
  dark: 'bg-ink-900 text-white hover:bg-ink-800 disabled:bg-ink-400',
  secondary:
    'border border-line-strong bg-surface text-ink-900 hover:border-ink-300 hover:bg-canvas disabled:text-ink-400',
  ghost: 'text-ink-700 hover:bg-ink-100 hover:text-ink-900 disabled:text-ink-400',
  accent: 'bg-amber-500 text-ink-950 hover:bg-amber-400 disabled:bg-amber-100',
  danger: 'bg-danger-500 text-white hover:bg-danger-600 disabled:bg-danger-100',
  whatsapp: 'bg-[#1fae5b] text-white hover:bg-[#189a4f] disabled:opacity-60',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 gap-1.5 rounded-xl px-3.5 text-sm',
  md: 'h-11 gap-2 rounded-2xl px-5 text-[0.95rem]',
  lg: 'h-13 gap-2.5 rounded-2xl px-7 text-base',
  icon: 'size-11 rounded-2xl',
};

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}) {
  return cn(
    'inline-flex shrink-0 cursor-pointer items-center justify-center font-semibold whitespace-nowrap select-none',
    'transition-[background-color,border-color,color,box-shadow,transform] duration-[440ms] ease-out-soft',
    'active:scale-[0.96] active:duration-200 disabled:pointer-events-none',
    '[&_svg]:size-[1.1em] [&_svg]:shrink-0',
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
    className,
  );
}
