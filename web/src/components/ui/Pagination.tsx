import type { Pagination as PaginationData } from '@selit/shared';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/cn';

type PaginationProps = {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  className?: string;
};

function pageWindow(current: number, total: number) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  return [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
}

export function Pagination({ pagination, onPageChange, className }: PaginationProps) {
  const { page, pages, total, limit } = pagination;
  if (pages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const items = pageWindow(page, pages);

  const arrowStyles =
    'flex size-10 cursor-pointer items-center justify-center rounded-xl border border-line bg-surface text-ink-700 transition-colors hover:border-ink-300 disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex flex-col items-center justify-between gap-3 sm:flex-row', className)}
    >
      <p className="text-sm text-ink-500">
        Showing <span className="font-semibold text-ink-800">{from}</span>–
        <span className="font-semibold text-ink-800">{to}</span> of{' '}
        <span className="font-semibold text-ink-800">{total.toLocaleString('en-NG')}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className={arrowStyles}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </button>
        {items.map((item, index) => (
          <span key={item} className="flex items-center gap-1.5">
            {index > 0 && item - items[index - 1] > 1 ? (
              <span className="px-1 text-ink-400">…</span>
            ) : null}
            <button
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? 'page' : undefined}
              className={cn(
                'h-10 min-w-10 cursor-pointer rounded-xl px-3 text-sm font-semibold tabular-nums transition-colors',
                item === page ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-100',
              )}
            >
              {item}
            </button>
          </span>
        ))}
        <button
          type="button"
          className={arrowStyles}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </nav>
  );
}
