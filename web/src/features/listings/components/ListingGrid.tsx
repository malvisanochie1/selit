'use client';

import { Reveal } from '@/components/motion/Reveal';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';

import type { Listing } from '../listing.types';
import { ListingCard } from './ListingCard';

const GRID = 'grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4';
const ANIMATED_ITEMS = 8;

type ListingGridProps = {
  listings: Listing[];
  className?: string;
};

/** Only the first screenful glides in; items further down simply appear as you scroll. */
export function ListingGrid({ listings, className }: ListingGridProps) {
  return (
    <div className={cn(GRID, className)}>
      {listings.map((listing, index) =>
        index < ANIMATED_ITEMS ? (
          <Reveal key={listing.id} index={index} className="flex">
            <ListingCard listing={listing} priority={index < 4} className="w-full" />
          </Reveal>
        ) : (
          <ListingCard key={listing.id} listing={listing} />
        ),
      )}
    </div>
  );
}

export function ListingGridSkeleton({
  count = 8,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn(GRID, className)} aria-busy="true" aria-label="Loading listings">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-3xl bg-surface ring-1 ring-line/60">
          <Skeleton className="aspect-square rounded-none sm:aspect-[4/3.4]" />
          <div className="space-y-2.5 p-4">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
