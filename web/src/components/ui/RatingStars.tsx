import { Star } from 'lucide-react';

import { cn } from '@/lib/cn';

type RatingStarsProps = {
  rating: number;
  size?: 'sm' | 'md';
  className?: string;
};

export function RatingStars({ rating, size = 'sm', className }: RatingStarsProps) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <span
      className={cn('inline-flex items-center gap-0.5', className)}
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
      role="img"
    >
      {[1, 2, 3, 4, 5].map((step) => (
        <Star
          key={step}
          aria-hidden="true"
          className={cn(
            size === 'sm' ? 'size-3.5' : 'size-5',
            step <= rounded
              ? 'fill-amber-500 text-amber-500'
              : step - 0.5 === rounded
                ? 'fill-amber-500/50 text-amber-500'
                : 'fill-ink-200 text-ink-200',
          )}
        />
      ))}
    </span>
  );
}
