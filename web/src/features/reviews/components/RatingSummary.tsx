import { RatingStars } from '@/components/ui/RatingStars';

import type { SellerReviews } from '../review.types';

export function RatingSummary({ summary }: { summary: SellerReviews }) {
  const counts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: summary.reviews.filter((review) => Math.round(review.rating) === stars).length,
  }));
  const max = Math.max(1, ...counts.map((row) => row.count));

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-line bg-surface p-6 sm:flex-row sm:items-center">
      <div className="text-center sm:w-40 sm:shrink-0">
        <p className="font-display text-6xl leading-none font-bold text-ink-900">
          {summary.reviewCount ? summary.averageRating.toFixed(1) : '–'}
        </p>
        <RatingStars rating={summary.averageRating} size="md" className="mt-3" />
        <p className="mt-2 text-sm text-ink-500">
          {summary.reviewCount} {summary.reviewCount === 1 ? 'review' : 'reviews'}
        </p>
      </div>
      <ul className="flex-1 space-y-2">
        {counts.map((row) => (
          <li key={row.stars} className="flex items-center gap-3 text-sm">
            <span className="w-3 text-ink-600 tabular-nums">{row.stars}</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100">
              <span
                className="block h-full rounded-full bg-amber-500 transition-[width] duration-1000 ease-out-soft"
                style={{ width: `${(row.count / max) * 100}%` }}
              />
            </span>
            <span className="w-6 text-right text-ink-500 tabular-nums">{row.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
