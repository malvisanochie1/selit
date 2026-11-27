'use client';

import { categoryName, findSchoolByName, formatNaira, messageOf } from '@selit/shared';
import { PackageSearch, RefreshCw, Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Dialog } from '@/components/ui/Dialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { controlStyles } from '@/components/ui/Field';
import { Pagination } from '@/components/ui/Pagination';
import { cn } from '@/lib/cn';

import { useListingFilters } from '../hooks/use-listing-filters';
import { useListings } from '../hooks/use-listings';
import type { ListingFilters, ListingSort } from '../listing.types';
import { ListingFilterPanel } from './ListingFilterPanel';
import { ListingGrid, ListingGridSkeleton } from './ListingGrid';

const SORT_OPTIONS: { value: ListingSort; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'oldest', label: 'Oldest first' },
];

/** Re-mounted when the URL query changes, so the box always shows the active search. */
function SearchBox({ initial, onSearch }: { initial: string; onSearch: (query: string) => void }) {
  const [query, setQuery] = useState(initial);
  return (
    <form
      role="search"
      className="relative flex-1"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(query.trim());
      }}
    >
      <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-400" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search items"
        aria-label="Search items"
        className={cn(controlStyles, 'h-12 pl-12')}
      />
    </form>
  );
}

type ListingBrowserProps = {
  fixed?: Partial<ListingFilters>;
};

export function ListingBrowser({ fixed = {} }: ListingBrowserProps) {
  const { filters, update, clear } = useListingFilters(fixed);
  const { data, isPending, isError, error, refetch, isFetching } = useListings(filters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeChips = [
    !fixed.category && filters.category
      ? {
          key: 'category' as const,
          label: categoryName(filters.category),
        }
      : null,
    !fixed.school && filters.school
      ? {
          key: 'school' as const,
          label: findSchoolByName(filters.school)?.shortName || filters.school,
        }
      : null,
    filters.condition ? { key: 'condition' as const, label: filters.condition } : null,
    filters.priceMin
      ? { key: 'min' as const, label: `From ${formatNaira(filters.priceMin)}` }
      : null,
    filters.priceMax
      ? { key: 'max' as const, label: `Up to ${formatNaira(filters.priceMax)}` }
      : null,
  ].filter((chip) => chip !== null);

  const panel = (
    <ListingFilterPanel
      filters={filters}
      onChange={(changes) => {
        update(changes);
        setIsFilterOpen(false);
      }}
      hideCategory={Boolean(fixed.category)}
      hideSchool={Boolean(fixed.school)}
    />
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[17.5rem_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-28 rounded-3xl border border-line bg-surface p-6">
          <h2 className="mb-5 font-sans text-base font-semibold text-ink-900">Filters</h2>
          {panel}
        </div>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row">
          <SearchBox
            key={filters.search ?? ''}
            initial={filters.search ?? ''}
            onSearch={(q) => update({ q: q || undefined })}
          />
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="h-12 lg:hidden"
              onClick={() => setIsFilterOpen(true)}
            >
              <SlidersHorizontal />
              Filters
              {activeChips.length ? (
                <span className="rounded-full bg-brand-500 px-1.5 text-xs text-white">
                  {activeChips.length}
                </span>
              ) : null}
            </Button>
            <label className="relative flex-1 sm:flex-none">
              <span className="sr-only">Sort by</span>
              <select
                value={filters.sort}
                onChange={(event) => update({ sort: event.target.value })}
                className={cn(controlStyles, 'h-12 cursor-pointer sm:w-52')}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-4 flex min-h-8 flex-wrap items-center gap-2">
          <p className="mr-2 text-sm text-ink-500">
            {data ? (
              <>
                <span className="font-semibold text-ink-900">
                  {data.pagination.total.toLocaleString('en-NG')}
                </span>{' '}
                {data.pagination.total === 1 ? 'item' : 'items'}
                {filters.search ? <> for “{filters.search}”</> : null}
              </>
            ) : (
              'Searching…'
            )}
          </p>
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => update({ [chip.key]: undefined })}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-800 ring-1 ring-brand-100 transition-colors hover:bg-brand-100"
            >
              {chip.label}
              <X className="size-3.5" />
            </button>
          ))}
          {activeChips.length > 1 || filters.search ? (
            <button
              type="button"
              onClick={clear}
              className="cursor-pointer text-sm font-semibold text-ink-500 hover:text-ink-900"
            >
              Clear all
            </button>
          ) : null}
        </div>

        <div className="mt-6">
          {isPending ? (
            <ListingGridSkeleton count={8} className="xl:grid-cols-3" />
          ) : isError ? (
            <EmptyState
              icon={<RefreshCw />}
              title="We couldn't load items"
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
              title="No items match yet"
              description="Try a wider price range, another school, or fewer filters. New items are listed every day."
              action={
                <div className="flex flex-wrap justify-center gap-2">
                  <Button variant="secondary" onClick={clear}>
                    Clear filters
                  </Button>
                  <ButtonLink href="/sell">Sell something</ButtonLink>
                </div>
              }
            />
          ) : (
            <>
              <ListingGrid
                listings={data.items}
                className={cn(
                  'xl:grid-cols-3',
                  isFetching && 'opacity-70 transition-opacity duration-300',
                )}
              />
              <Pagination
                className="mt-10"
                pagination={data.pagination}
                onPageChange={(page) => {
                  update({ page });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </>
          )}
        </div>
      </div>

      <Dialog open={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="Filters">
        {panel}
      </Dialog>
    </div>
  );
}
