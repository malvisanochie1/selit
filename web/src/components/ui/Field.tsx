import { cn } from '@/lib/cn';

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
};

/** Label, hint and error message around any form control. */
export function Field({ id, label, hint, error, optional, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between text-sm font-semibold text-ink-800"
      >
        {label}
        {optional ? <span className="text-xs font-medium text-ink-400">Optional</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-danger-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export const controlStyles = cn(
  'w-full min-w-0 rounded-2xl border border-line-strong bg-surface px-4 text-[0.95rem] text-ink-900',
  'transition-[border-color,box-shadow] duration-300 ease-out-soft placeholder:text-ink-400',
  'hover:border-ink-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 focus:outline-none',
  'disabled:cursor-not-allowed disabled:bg-canvas disabled:text-ink-400',
  'aria-[invalid=true]:border-danger-500 aria-[invalid=true]:focus:ring-danger-100',
);
