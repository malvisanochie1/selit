'use client';

import * as m from 'motion/react-m';
import { useId } from 'react';

import { DURATION, EASE_OUT } from '@/components/motion/motion.constants';
import { cn } from '@/lib/cn';

export type TabOption<T extends string> = { value: T; label: string; count?: number };

type SegmentedTabsProps<T extends string> = {
  options: readonly TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
};

/** Tabs with a pill that glides to the selected option. */
export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: SegmentedTabsProps<T>) {
  const pillId = useId();
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        'no-scrollbar inline-flex max-w-full gap-1 overflow-x-auto rounded-2xl bg-ink-100/80 p-1',
        className,
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative shrink-0 cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-300',
              isActive ? 'text-ink-900' : 'text-ink-500 hover:text-ink-800',
            )}
          >
            {isActive ? (
              <m.span
                layoutId={pillId}
                className="absolute inset-0 rounded-xl bg-surface shadow-card"
                transition={{ duration: DURATION.base + 0.07, ease: EASE_OUT }}
              />
            ) : null}
            <span className="relative flex items-center gap-1.5">
              {option.label}
              {option.count !== undefined ? (
                <span
                  className={cn(
                    'rounded-full px-1.5 text-xs tabular-nums',
                    isActive ? 'bg-brand-50 text-brand-700' : 'bg-ink-200/70 text-ink-500',
                  )}
                >
                  {option.count}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
