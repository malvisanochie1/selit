'use client';

import { APARTMENT_TYPES, messageOf } from '@selit/shared';
import { Building2, HousePlus } from 'lucide-react';
import { useState } from 'react';

import { Reveal } from '@/components/motion/Reveal';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { controlStyles } from '@/components/ui/Field';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { SchoolPicker } from '@/features/schools/components/SchoolPicker';
import { cn } from '@/lib/cn';

import type { ApartmentFilters, ApartmentType } from '../apartment.types';
import { useApartments } from '../hooks/use-apartments';
import { ApartmentCard } from './ApartmentCard';

const BUDGETS = [
  { value: 100000, label: 'Under ₦100k' },
  { value: 200000, label: 'Under ₦200k' },
  { value: 400000, label: 'Under ₦400k' },
];

export function ApartmentBrowser() {
  const [filters, setFilters] = useState<ApartmentFilters>({ sort: 'newest', page: 1 });
  const { data, isPending, isError, error, isFetching } = useApartments(filters);

  const set = (changes: Partial<ApartmentFilters>) =>
    setFilters((current) => ({ ...current, ...changes, page: 1 }));

  return (
    <div>
      <div className="grid gap-4 rounded-3xl border border-line bg-surface p-4 sm:p-5 lg:grid-cols-[1fr_auto]">
        <SchoolPicker
          key={filters.school ?? 'any'}
          id="apartment-school"
          label="Near which school?"
          value={filters.school ?? ''}
          onChange={(school) => set({ school: school || undefined })}
          allowCustom={false}
        />
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink-800">
          Sort
          <select
            value={filters.sort}
            onChange={(event) => set({ sort: event.target.value as ApartmentFilters['sort'] })}
            className={cn(controlStyles, 'h-12 cursor-pointer lg:w-52')}
          >
            <option value="newest">Recently confirmed</option>
            <option value="price_asc">Rent: low to high</option>
            <option value="price_desc">Rent: high to low</option>
          </select>
        </label>
        <div className="-mx-1 no-scrollbar flex gap-2 overflow-x-auto px-1 lg:col-span-2">
          <Chip isActive={!filters.type} onClick={() => set({ type: undefined })}>
            All types
          </Chip>
          {APARTMENT_TYPES.map((type) => (
            <Chip
              key={type.value}
              isActive={filters.type === type.value}
              onClick={() => set({ type: type.value as ApartmentType })}
            >
              {type.label}
            </Chip>
          ))}
          <span className="mx-1 w-px shrink-0 bg-line" />
          {BUDGETS.map((budget) => (
            <Chip
              key={budget.value}
              isActive={filters.priceMax === budget.value}
              onClick={() =>
                set({ priceMax: filters.priceMax === budget.value ? undefined : budget.value })
              }
            >
              {budget.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {isPending ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-96 rounded-3xl" />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            icon={<Building2 />}
            title="We couldn't load apartments"
            description={messageOf(error)}
          />
        ) : data.items.length === 0 ? (
          <EmptyState
            icon={<HousePlus />}
            title="No rooms match yet"
            description="Try another school or a bigger budget. New rooms are confirmed every week."
          />
        ) : (
          <>
            <div
              className={cn(
                'grid gap-5 sm:grid-cols-2 lg:grid-cols-3',
                isFetching && 'opacity-70 transition-opacity',
              )}
            >
              {data.items.map((apartment, index) => (
                <Reveal key={apartment.id} index={index} className="flex">
                  <ApartmentCard apartment={apartment} className="w-full" />
                </Reveal>
              ))}
            </div>
            <Pagination
              className="mt-10"
              pagination={data.pagination}
              onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
            />
          </>
        )}
      </div>
    </div>
  );
}
