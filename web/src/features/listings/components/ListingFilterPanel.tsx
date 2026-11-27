'use client';

import { CATEGORIES, CONDITIONS } from '@selit/shared';
import { useState } from 'react';

import { Chip } from '@/components/ui/Chip';
import { controlStyles } from '@/components/ui/Field';
import { SchoolPicker } from '@/features/schools/components/SchoolPicker';
import { cn } from '@/lib/cn';

import type { FilterKey } from '../hooks/use-listing-filters';
import type { ListingFilters } from '../listing.types';

type ListingFilterPanelProps = {
  filters: ListingFilters;
  onChange: (changes: Partial<Record<FilterKey, string | number | undefined>>) => void;
  hideCategory?: boolean;
  hideSchool?: boolean;
};

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-line pb-6 last:border-b-0">
      <legend className="mb-3 text-sm font-semibold text-ink-900">{title}</legend>
      {children}
    </fieldset>
  );
}

export function ListingFilterPanel({
  filters,
  onChange,
  hideCategory,
  hideSchool,
}: ListingFilterPanelProps) {
  const [min, setMin] = useState(filters.priceMin ? String(filters.priceMin) : '');
  const [max, setMax] = useState(filters.priceMax ? String(filters.priceMax) : '');

  return (
    <div className="space-y-6">
      {hideCategory ? null : (
        <Group title="Category">
          <div className="flex flex-wrap gap-2">
            <Chip
              isActive={!filters.category}
              onClick={() => onChange({ category: undefined })}
              className="h-9"
            >
              All
            </Chip>
            {CATEGORIES.map((category) => (
              <Chip
                key={category.slug}
                isActive={filters.category === category.slug}
                onClick={() => onChange({ category: category.slug })}
                className="h-9"
              >
                {category.name}
              </Chip>
            ))}
          </div>
        </Group>
      )}

      {hideSchool ? null : (
        <Group title="School">
          <SchoolPicker
            key={filters.school ?? 'any'}
            id="filter-school"
            label="Near which school?"
            value={filters.school ?? ''}
            onChange={(school) => onChange({ school })}
            allowCustom={false}
          />
          {filters.school ? (
            <button
              type="button"
              onClick={() => onChange({ school: undefined })}
              className="mt-2 cursor-pointer text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              Any school
            </button>
          ) : null}
        </Group>
      )}

      <Group title="Condition">
        <div className="flex flex-wrap gap-2">
          <Chip
            isActive={!filters.condition}
            onClick={() => onChange({ condition: undefined })}
            className="h-9"
          >
            Any
          </Chip>
          {CONDITIONS.map((condition) => (
            <Chip
              key={condition.value}
              isActive={filters.condition === condition.value}
              onClick={() => onChange({ condition: condition.value })}
              className="h-9"
            >
              {condition.label}
            </Chip>
          ))}
        </div>
      </Group>

      <Group title="Price (₦)">
        <form
          className="flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            onChange({ min: min || undefined, max: max || undefined });
          }}
        >
          <input
            inputMode="numeric"
            aria-label="Minimum price"
            placeholder="Min"
            value={min}
            onChange={(event) => setMin(event.target.value.replace(/\D/g, ''))}
            className={cn(controlStyles, 'h-11')}
          />
          <span className="text-ink-400">–</span>
          <input
            inputMode="numeric"
            aria-label="Maximum price"
            placeholder="Max"
            value={max}
            onChange={(event) => setMax(event.target.value.replace(/\D/g, ''))}
            className={cn(controlStyles, 'h-11')}
          />
          <button
            type="submit"
            className="h-11 shrink-0 cursor-pointer rounded-2xl bg-ink-900 px-4 text-sm font-semibold text-white transition-transform active:scale-[0.96]"
          >
            Go
          </button>
        </form>
      </Group>
    </div>
  );
}
