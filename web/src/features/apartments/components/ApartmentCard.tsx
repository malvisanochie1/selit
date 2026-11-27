import { apartmentTypeLabel, daysSince, findSchoolByName, formatNaira } from '@selit/shared';
import { BadgeCheck, Building2, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/Badge';
import { ListingImage } from '@/features/listings/components/ListingImage';
import { cn } from '@/lib/cn';

import type { Apartment } from '../apartment.types';

export function ApartmentCard({
  apartment,
  className,
}: {
  apartment: Apartment;
  className?: string;
}) {
  const school = findSchoolByName(apartment.school);
  const renewedDays = daysSince(apartment.lastRenewedAt);
  const isTaken = apartment.status === 'taken';

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-3xl bg-surface shadow-card ring-1 ring-line/60',
        'transition-[transform,box-shadow] duration-700 ease-out-soft hover:-translate-y-1 hover:shadow-lift',
        className,
      )}
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-canvas">
        <ListingImage
          src={apartment.images[0]}
          alt={apartment.title}
          category="Other"
          fallbackIcon={Building2}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-[900ms] ease-out-soft group-hover:scale-[1.05]"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge tone="dark">{apartmentTypeLabel(apartment.type)}</Badge>
          {apartment.isConfirmed ? null : <Badge tone="amber">Not yet confirmed</Badge>}
        </div>
        {isTaken ? (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-950/50 backdrop-blur-[2px]">
            <span className="rounded-full bg-white px-4 py-1.5 text-sm font-bold tracking-wide text-ink-900 uppercase">
              Taken
            </span>
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="font-display text-2xl leading-none font-bold tracking-tight text-ink-900">
          {formatNaira(apartment.rentPerYear)}
          <span className="ml-1 font-sans text-sm font-medium text-ink-500">/ year</span>
        </p>
        <h3 className="font-sans text-base leading-snug font-semibold text-ink-800">
          <Link
            href={`/apartments/${apartment.id}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {apartment.title}
          </Link>
        </h3>
        <p className="flex items-center gap-1.5 text-sm text-ink-500">
          <MapPin className="size-4 shrink-0 text-ink-400" />
          <span className="truncate">
            {apartment.area} · {apartment.distanceToCampus} to {school?.shortName || 'campus'}
          </span>
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-3 text-xs text-ink-500">
          <span className="flex items-center gap-1.5 font-medium text-ink-700">
            {apartment.agent.isVerified ? <BadgeCheck className="size-4 text-brand-600" /> : null}
            {apartment.agent.agencyName || apartment.agent.fullName}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {renewedDays === 0 ? 'Confirmed today' : `Confirmed ${renewedDays}d ago`}
          </span>
        </div>
      </div>
    </article>
  );
}
