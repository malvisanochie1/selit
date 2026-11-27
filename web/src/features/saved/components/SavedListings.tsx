'use client';

import { useQueries } from '@tanstack/react-query';
import { Clock, Heart } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { AreaHeader } from '@/components/layout/AreaHeader';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { EmptyState } from '@/components/ui/EmptyState';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { ListingGrid, ListingGridSkeleton } from '@/features/listings/components/ListingGrid';
import { listingKeys } from '@/features/listings/hooks/use-listings';
import { getListing } from '@/features/listings/listings.api';
import type { Listing } from '@/features/listings/listing.types';

import { useRecentListings, useSavedListings } from '../use-saved-listings';

type Tab = 'saved' | 'recent';

function useListingsById(ids: string[]) {
  return useQueries({
    queries: ids.slice(0, 24).map((id) => ({
      queryKey: listingKeys.detail(id),
      queryFn: () => getListing(id),
      staleTime: 10 * 60 * 1000,
      retry: false,
    })),
    combine: (results) => ({
      listings: results
        .map((result) => result.data)
        .filter((listing): listing is Listing => Boolean(listing)),
      isPending: results.some((result) => result.isPending),
    }),
  });
}

export function SavedListings() {
  const router = useRouter();
  const tab: Tab = useSearchParams().get('tab') === 'recent' ? 'recent' : 'saved';
  const { savedIds } = useSavedListings();
  const recentIds = useRecentListings();
  const ids = tab === 'saved' ? savedIds : recentIds;
  const { listings, isPending } = useListingsById(ids);

  return (
    <>
      <AreaHeader
        title="Saved"
        description="Items you hearted and items you looked at recently, kept on this device."
      />
      <SegmentedTabs
        label="Saved sections"
        value={tab}
        onChange={(next) => router.replace(next === 'recent' ? '/saved?tab=recent' : '/saved')}
        options={[
          { value: 'saved', label: 'Saved', count: savedIds.length },
          { value: 'recent', label: 'Recently viewed', count: recentIds.length },
        ]}
      />
      <div className="mt-8">
        {ids.length === 0 ? (
          <EmptyState
            icon={tab === 'saved' ? <Heart /> : <Clock />}
            title={tab === 'saved' ? 'Nothing saved yet' : 'No recent items'}
            description={
              tab === 'saved'
                ? 'Tap the heart on any item to keep it here while you decide.'
                : 'Items you open will show up here so you can find them again.'
            }
            action={<ButtonLink href="/search">Start browsing</ButtonLink>}
          />
        ) : isPending && listings.length === 0 ? (
          <ListingGridSkeleton count={Math.min(ids.length, 8)} className="xl:grid-cols-3" />
        ) : (
          <ListingGrid listings={listings} className="xl:grid-cols-3" />
        )}
      </div>
    </>
  );
}
