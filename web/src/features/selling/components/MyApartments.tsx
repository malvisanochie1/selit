'use client';

import {
  apartmentTypeLabel,
  daysUntilRenewal,
  formatNaira,
  messageOf,
  type Apartment,
} from '@selit/shared';
import { Building2, CheckCircle2, Eye, Plus, RefreshCw, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { AreaHeader } from '@/components/layout/AreaHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useApartmentAction, useApartments } from '@/features/apartments/hooks/use-apartments';
import { useSession } from '@/features/auth/hooks/use-session';

const STATUS_BADGES = {
  available: { tone: 'brand', label: 'Available' },
  pending: { tone: 'amber', label: 'In review' },
  taken: { tone: 'neutral', label: 'Taken' },
  rejected: { tone: 'danger', label: 'Not approved' },
  removed: { tone: 'danger', label: 'Removed' },
} as const;

function ApartmentRow({ apartment }: { apartment: Apartment }) {
  const action = useApartmentAction(apartment.id);
  const badge = STATUS_BADGES[apartment.status];
  const daysLeft = daysUntilRenewal(apartment.lastRenewedAt);
  const isLive = apartment.status === 'available' || apartment.status === 'taken';

  return (
    <li className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Link
          href={`/apartments/${apartment.id}`}
          className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-canvas sm:size-20"
        >
          {apartment.images[0] ? (
            <Image
              src={apartment.images[0]}
              alt={apartment.title}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : null}
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={badge.tone}>{badge.label}</Badge>
            {isLive ? (
              <span
                className={
                  daysLeft <= 3 ? 'text-xs font-semibold text-danger-600' : 'text-xs text-ink-400'
                }
              >
                {daysLeft === 0 ? 'Hidden until you confirm' : `Confirm within ${daysLeft}d`}
              </span>
            ) : null}
          </div>
          <Link
            href={`/apartments/${apartment.id}`}
            className="mt-1 block truncate font-semibold text-ink-900 hover:text-brand-700"
          >
            {apartment.title}
          </Link>
          <p className="mt-0.5 flex items-center gap-3 text-sm text-ink-500">
            <span className="font-semibold text-ink-800">
              {formatNaira(apartment.rentPerYear)}/yr
            </span>
            <span>{apartmentTypeLabel(apartment.type)}</span>
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" /> {apartment.viewsCount.toLocaleString('en-NG')}
            </span>
          </p>
        </div>
      </div>
      {isLive ? (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="secondary"
            isLoading={action.isPending && action.variables === 'renew'}
            onClick={() => action.mutate('renew')}
          >
            <RefreshCw /> Still available
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              action.mutate(apartment.status === 'taken' ? 'mark-available' : 'mark-taken')
            }
          >
            {apartment.status === 'taken' ? <RotateCcw /> : <CheckCircle2 />}
            {apartment.status === 'taken' ? 'Available again' : 'Mark taken'}
          </Button>
        </div>
      ) : null}
      {action.isError ? <p className="text-sm text-danger-600">{messageOf(action.error)}</p> : null}
    </li>
  );
}

/** Agents confirm each place every 14 days, or it drops out of the feed. */
export function MyApartments() {
  const { user } = useSession();
  const { data, isPending, isError, error } = useApartments(
    { agentId: user?.id, includeAll: true, limit: 50 },
    Boolean(user),
  );

  return (
    <>
      <AreaHeader
        title="My apartments"
        description="Tap “Still available” at least every 14 days so students only see rooms that are really free."
        action={
          <ButtonLink href="/sell/apartment" size="sm">
            <Plus /> List a room
          </ButtonLink>
        }
      />
      {isPending ? (
        <Skeleton className="h-64 rounded-3xl" />
      ) : isError ? (
        <EmptyState
          icon={<Building2 />}
          title="Couldn't load your apartments"
          description={messageOf(error)}
        />
      ) : data.items.length === 0 ? (
        <EmptyState
          icon={<Building2 />}
          title="No apartments yet"
          description="Verified agents and landlords can list rooms near any school."
          action={<ButtonLink href="/sell/apartment">List a room</ButtonLink>}
        />
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-surface">
          {data.items.map((apartment) => (
            <ApartmentRow key={apartment.id} apartment={apartment} />
          ))}
        </ul>
      )}
    </>
  );
}
