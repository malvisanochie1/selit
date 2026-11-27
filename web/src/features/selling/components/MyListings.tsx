'use client';

import { formatNaira, formatRelativeTime, messageOf } from '@selit/shared';
import {
  CheckCircle2,
  Clock,
  Eye,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { AreaHeader } from '@/components/layout/AreaHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Dialog } from '@/components/ui/Dialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatCard } from '@/components/ui/StatCard';
import { useSession } from '@/features/auth/hooks/use-session';
import { ListingImage } from '@/features/listings/components/ListingImage';
import {
  useDeleteListing,
  useListings,
  useUpdateListing,
} from '@/features/listings/hooks/use-listings';
import type { Listing, ListingStatus } from '@/features/listings/listing.types';

type Filter = 'all' | 'active' | 'pending' | 'sold' | 'rejected';

const STATUS_BADGES: Record<
  ListingStatus,
  { tone: 'brand' | 'amber' | 'neutral' | 'danger'; label: string }
> = {
  active: { tone: 'brand', label: 'Live' },
  pending: { tone: 'amber', label: 'In review' },
  sold: { tone: 'neutral', label: 'Sold' },
  rejected: { tone: 'danger', label: 'Not approved' },
  removed: { tone: 'danger', label: 'Removed' },
};

function ListingRow({
  listing,
  onDelete,
}: {
  listing: Listing;
  onDelete: (listing: Listing) => void;
}) {
  const update = useUpdateListing();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const badge = STATUS_BADGES[listing.status];
  const canToggle = listing.status === 'active' || listing.status === 'sold';

  return (
    <li className="flex items-center gap-4 p-4 sm:p-5">
      <Link
        href={`/products/${listing.id}`}
        className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-canvas sm:size-20"
      >
        <ListingImage
          src={listing.images[0]}
          alt={listing.title}
          category={listing.category}
          sizes="80px"
          compact
        />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={badge.tone}>{badge.label}</Badge>
          <span className="text-xs text-ink-400">{formatRelativeTime(listing.createdAt)}</span>
        </div>
        <Link
          href={`/products/${listing.id}`}
          className="mt-1 block truncate font-semibold text-ink-900 hover:text-brand-700"
        >
          {listing.title}
        </Link>
        <p className="mt-0.5 flex items-center gap-3 text-sm text-ink-500">
          <span className="font-semibold text-ink-800">{formatNaira(listing.price)}</span>
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" /> {listing.viewsCount.toLocaleString('en-NG')}
          </span>
        </p>
      </div>
      <div className="hidden items-center gap-2 md:flex">
        {canToggle ? (
          <Button
            size="sm"
            variant="secondary"
            isLoading={update.isPending}
            onClick={() =>
              update.mutate({
                id: listing.id,
                update: { status: listing.status === 'sold' ? 'active' : 'sold' },
              })
            }
          >
            {listing.status === 'sold' ? <RotateCcw /> : <CheckCircle2 />}
            {listing.status === 'sold' ? 'Relist' : 'Mark sold'}
          </Button>
        ) : null}
        <ButtonLink
          href={`/seller/listings/${listing.id}/edit`}
          size="sm"
          variant="ghost"
          aria-label={`Edit ${listing.title}`}
        >
          <Pencil />
        </ButtonLink>
        <Button
          size="sm"
          variant="ghost"
          aria-label={`Delete ${listing.title}`}
          className="text-ink-400 hover:bg-danger-50 hover:text-danger-600"
          onClick={() => onDelete(listing)}
        >
          <Trash2 />
        </Button>
      </div>
      <div className="relative md:hidden">
        <Button
          size="icon"
          variant="ghost"
          aria-label="More actions"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <MoreHorizontal />
        </Button>
        {isMenuOpen ? (
          <div className="absolute top-full right-0 z-20 mt-1 w-44 rounded-2xl border border-line bg-surface p-1.5 shadow-float">
            {canToggle ? (
              <button
                type="button"
                className="w-full cursor-pointer rounded-xl px-3 py-2 text-left text-sm font-medium hover:bg-canvas"
                onClick={() => {
                  setIsMenuOpen(false);
                  update.mutate({
                    id: listing.id,
                    update: { status: listing.status === 'sold' ? 'active' : 'sold' },
                  });
                }}
              >
                {listing.status === 'sold' ? 'Relist' : 'Mark as sold'}
              </button>
            ) : null}
            <Link
              href={`/seller/listings/${listing.id}/edit`}
              className="block rounded-xl px-3 py-2 text-sm font-medium hover:bg-canvas"
            >
              Edit
            </Link>
            <button
              type="button"
              className="w-full cursor-pointer rounded-xl px-3 py-2 text-left text-sm font-medium text-danger-600 hover:bg-danger-50"
              onClick={() => {
                setIsMenuOpen(false);
                onDelete(listing);
              }}
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </li>
  );
}

export function MyListings() {
  const { user } = useSession();
  const { data, isPending, isError, error } = useListings(
    { sellerId: user?.id, status: 'all', limit: 100 },
    Boolean(user),
  );
  const remove = useDeleteListing();
  const [filter, setFilter] = useState<Filter>('all');
  const [toDelete, setToDelete] = useState<Listing | null>(null);

  const listings = useMemo(() => data?.items ?? [], [data]);
  const countOf = (status: ListingStatus) =>
    listings.filter((listing) => listing.status === status).length;
  const visible =
    filter === 'all' ? listings : listings.filter((listing) => listing.status === filter);

  return (
    <>
      <AreaHeader
        title="My listings"
        description="Mark items as sold as soon as they go, so buyers don't message you for nothing."
        action={
          <ButtonLink href="/sell/item">
            <Plus /> New listing
          </ButtonLink>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Live" value={countOf('active')} icon={<Package />} />
        <StatCard label="In review" value={countOf('pending')} icon={<Clock />} tone="amber" />
        <StatCard label="Sold" value={countOf('sold')} icon={<CheckCircle2 />} tone="info" />
        <StatCard
          label="Total views"
          value={listings.reduce((sum, listing) => sum + listing.viewsCount, 0)}
          icon={<Eye />}
          tone="danger"
        />
      </div>

      <SegmentedTabs
        className="mt-8"
        label="Filter listings"
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: 'All', count: listings.length },
          { value: 'active', label: 'Live', count: countOf('active') },
          { value: 'pending', label: 'In review', count: countOf('pending') },
          { value: 'sold', label: 'Sold', count: countOf('sold') },
          { value: 'rejected', label: 'Not approved', count: countOf('rejected') },
        ]}
      />

      <div className="mt-6">
        {isPending ? (
          <Skeleton className="h-72 rounded-3xl" />
        ) : isError ? (
          <EmptyState
            icon={<Package />}
            title="We couldn't load your listings"
            description={messageOf(error)}
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<Package />}
            title={filter === 'all' ? 'You haven’t listed anything yet' : 'Nothing here'}
            description="Graduating, moving, or upgrading? Someone near you needs what you no longer use."
            action={<ButtonLink href="/sell/item">List your first item</ButtonLink>}
          />
        ) : (
          <ul className="divide-y divide-line rounded-3xl border border-line bg-surface">
            {visible.map((listing) => (
              <ListingRow key={listing.id} listing={listing} onDelete={setToDelete} />
            ))}
          </ul>
        )}
      </div>

      <Dialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Delete this listing?"
        description={toDelete?.title}
        footer={
          <>
            <Button variant="ghost" onClick={() => setToDelete(null)}>
              Keep it
            </Button>
            <Button
              variant="danger"
              isLoading={remove.isPending}
              onClick={() =>
                toDelete && remove.mutate(toDelete.id, { onSuccess: () => setToDelete(null) })
              }
            >
              Delete for good
            </Button>
          </>
        }
      >
        <p className="text-ink-600">
          This removes it from Selit permanently. If it just sold, use “Mark sold” instead so buyers
          can see it went.
        </p>
        {remove.isError ? (
          <p className="mt-3 text-sm text-danger-600">{messageOf(remove.error)}</p>
        ) : null}
      </Dialog>
    </>
  );
}
