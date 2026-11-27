'use client';

import { findSchoolByName, formatNaira, formatRelativeTime, messageOf } from '@selit/shared';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Package, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { AreaHeader } from '@/components/layout/AreaHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { ListingImage } from '@/features/listings/components/ListingImage';

import { listAdminListings, setListingStatus } from '../admin.api';
import type { AdminListing, ModeratedListingStatus } from '../admin.types';
import { AdminTable, Td, Th } from './AdminTable';

type Filter = ModeratedListingStatus | 'all';
const FILTERS: { value: Filter; label: string }[] = [
  { value: 'pending', label: 'Awaiting review' },
  { value: 'active', label: 'Live' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'removed', label: 'Removed' },
  { value: 'all', label: 'All' },
];

const TONES = {
  active: 'brand',
  pending: 'amber',
  rejected: 'danger',
  removed: 'danger',
  sold: 'neutral',
} as const;

export function AdminListings() {
  const router = useRouter();
  const params = useSearchParams();
  const queryClient = useQueryClient();
  const status = (FILTERS.find((filter) => filter.value === params.get('status'))?.value ??
    'pending') as Filter;
  const [page, setPage] = useState(1);
  const [toRemove, setToRemove] = useState<AdminListing | null>(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['admin', 'listings', status, page],
    queryFn: () => listAdminListings(status, page),
    placeholderData: keepPreviousData,
  });
  const moderate = useMutation({
    mutationFn: ({ id, next }: { id: string; next: ModeratedListingStatus }) =>
      setListingStatus(id, next),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin'] });
      void queryClient.invalidateQueries({ queryKey: ['listings'] });
      setToRemove(null);
    },
  });

  return (
    <>
      <AreaHeader
        title="Listings"
        description="Approve real items, reject bait and remove anything that breaks the rules."
      />
      <SegmentedTabs
        label="Listing status"
        value={status}
        onChange={(next) => {
          setPage(1);
          router.replace(`/admin/listings?status=${next}`);
        }}
        options={FILTERS}
      />
      {moderate.isError ? (
        <p className="mt-4 text-sm text-danger-600">{messageOf(moderate.error)}</p>
      ) : null}

      <div className="mt-6">
        {isPending ? (
          <Skeleton className="h-96 rounded-3xl" />
        ) : isError ? (
          <EmptyState
            icon={<Package />}
            title="Couldn't load listings"
            description={messageOf(error)}
          />
        ) : data.items.length === 0 ? (
          <EmptyState
            icon={<Check />}
            title="All clear"
            description="Nothing in this queue right now."
          />
        ) : (
          <>
            <AdminTable>
              <thead>
                <tr>
                  <Th>Listing</Th>
                  <Th>Seller</Th>
                  <Th>Price</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((listing) => (
                  <tr key={listing.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-canvas">
                          <ListingImage
                            src={listing.images[0]}
                            alt=""
                            category={listing.category}
                            sizes="48px"
                            compact
                          />
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={`/products/${listing.id}`}
                            className="block max-w-[16rem] truncate font-semibold text-ink-900 hover:text-brand-700"
                          >
                            {listing.title}
                          </Link>
                          <p className="text-xs text-ink-500">
                            {findSchoolByName(listing.school)?.shortName || listing.school} ·{' '}
                            {formatRelativeTime(listing.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <Link
                        href={`/sellers/${listing.sellerId}`}
                        className="font-medium text-ink-800 hover:text-brand-700"
                      >
                        {listing.seller?.fullName ?? 'Unknown'}
                      </Link>
                    </Td>
                    <Td className="font-semibold tabular-nums">{formatNaira(listing.price)}</Td>
                    <Td>
                      <Badge tone={TONES[listing.status]}>{listing.status}</Badge>
                    </Td>
                    <Td>
                      <div className="flex justify-end gap-1.5">
                        {listing.status !== 'active' ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => moderate.mutate({ id: listing.id, next: 'active' })}
                          >
                            <Check /> Approve
                          </Button>
                        ) : null}
                        {listing.status === 'pending' ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moderate.mutate({ id: listing.id, next: 'rejected' })}
                          >
                            <X /> Reject
                          </Button>
                        ) : null}
                        {listing.status !== 'removed' ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            aria-label="Remove listing"
                            className="text-danger-600 hover:bg-danger-50"
                            onClick={() => setToRemove(listing)}
                          >
                            <Trash2 />
                          </Button>
                        ) : null}
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
            <Pagination className="mt-6" pagination={data.pagination} onPageChange={setPage} />
          </>
        )}
      </div>

      <Dialog
        open={Boolean(toRemove)}
        onClose={() => setToRemove(null)}
        title="Remove this listing?"
        description={toRemove?.title}
        footer={
          <>
            <Button variant="ghost" onClick={() => setToRemove(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={moderate.isPending}
              onClick={() => toRemove && moderate.mutate({ id: toRemove.id, next: 'removed' })}
            >
              Remove listing
            </Button>
          </>
        }
      >
        <p className="text-ink-600">
          It disappears from search and the seller can no longer edit it.
        </p>
      </Dialog>
    </>
  );
}
