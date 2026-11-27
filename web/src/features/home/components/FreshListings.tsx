'use client';

import { messageOf } from '@selit/shared';
import { ArrowUpRight, PackageSearch, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { ListingGrid, ListingGridSkeleton } from '@/features/listings/components/ListingGrid';
import { useListings } from '@/features/listings/hooks/use-listings';

const TABS = [
  { value: '', label: 'Everything' },
  { value: 'Hostel Items', label: 'Hostel' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Furniture', label: 'Furniture' },
  { value: 'Kitchen Items', label: 'Kitchen' },
] as const;

type TabValue = (typeof TABS)[number]['value'];

export function FreshListings() {
  const [category, setCategory] = useState<TabValue>('');
  const { data, isPending, isError, error, refetch, isFetching } = useListings({
    category: category || undefined,
    limit: 8,
    sort: 'newest',
  });

  return (
    <section className="container-page py-14 sm:py-20">
      <SectionHeading
        eyebrow="Just listed"
        title="Fresh from students nearby"
        action={
          <Link
            href="/search"
            className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800"
          >
            See everything <ArrowUpRight className="size-4" />
          </Link>
        }
      />
      <SegmentedTabs
        label="Filter fresh listings"
        options={TABS}
        value={category}
        onChange={setCategory}
        className="mt-8"
      />
      <div className="mt-8">
        {isPending ? (
          <ListingGridSkeleton count={8} />
        ) : isError ? (
          <EmptyState
            icon={<RefreshCw />}
            title="We couldn't load listings"
            description={messageOf(error)}
            action={
              <Button variant="secondary" onClick={() => refetch()} isLoading={isFetching}>
                Try again
              </Button>
            }
          />
        ) : data.items.length === 0 ? (
          <EmptyState
            icon={<PackageSearch />}
            title="Nothing here yet"
            description="Be the first to list something in this category."
            action={<ButtonLink href="/sell">List an item</ButtonLink>}
          />
        ) : (
          <ListingGrid
            listings={data.items}
            className={isFetching ? 'opacity-70 transition-opacity' : ''}
          />
        )}
      </div>
    </section>
  );
}
