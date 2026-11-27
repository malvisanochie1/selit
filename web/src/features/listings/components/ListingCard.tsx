import { conditionLabel, findSchoolByName, formatNaira, formatRelativeTime } from '@selit/shared';
import { BadgeCheck, MapPin } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/Badge';
import { SaveButton } from '@/features/saved/SaveButton';
import { cn } from '@/lib/cn';

import type { Listing } from '../listing.types';
import { ListingImage } from './ListingImage';

type ListingCardProps = {
  listing: Listing;
  priority?: boolean;
  className?: string;
};

export function ListingCard({ listing, priority = false, className }: ListingCardProps) {
  const school = findSchoolByName(listing.school);
  const place = school?.shortName || school?.city || listing.school;
  const isVerified = listing.seller?.verificationStatus === 'verified';
  const isSold = listing.status === 'sold';

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-3xl bg-surface shadow-card ring-1 ring-line/60',
        'transition-[transform,box-shadow] duration-700 ease-out-soft hover:-translate-y-1 hover:shadow-lift',
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-canvas sm:aspect-[4/3.4]">
        <ListingImage
          src={listing.images[0]}
          alt={listing.title}
          category={listing.category}
          priority={priority}
          sizes="(min-width: 1280px) 290px, (min-width: 768px) 30vw, 50vw"
          className="transition-transform duration-[900ms] ease-out-soft group-hover:scale-[1.05]"
        />
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          <Badge tone="dark">{conditionLabel(listing.condition)}</Badge>
        </div>
        <SaveButton
          listingId={listing.id}
          title={listing.title}
          className="absolute top-2 right-2 z-10"
        />
        {isSold ? (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-950/45 backdrop-blur-[2px]">
            <span className="rounded-full bg-white px-4 py-1.5 text-sm font-bold tracking-wide text-ink-900 uppercase">
              Sold
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5 sm:p-4">
        <p className="font-display text-lg leading-none font-bold tracking-tight text-ink-900 sm:text-xl">
          {formatNaira(listing.price)}
        </p>
        <h3 className="line-clamp-2 font-sans text-sm leading-snug font-medium text-ink-700 sm:text-[0.95rem]">
          <Link
            href={`/products/${listing.id}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {listing.title}
          </Link>
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 text-xs text-ink-500">
          <span className="flex min-w-0 items-center gap-1">
            <MapPin className="size-3.5 shrink-0 text-ink-400" />
            <span className="truncate">{place}</span>
            {isVerified ? (
              <BadgeCheck
                className="size-3.5 shrink-0 text-brand-600"
                aria-label="Verified seller"
              />
            ) : null}
          </span>
          <time dateTime={listing.createdAt} className="shrink-0" suppressHydrationWarning>
            {formatRelativeTime(listing.createdAt)}
          </time>
        </div>
      </div>
    </article>
  );
}
