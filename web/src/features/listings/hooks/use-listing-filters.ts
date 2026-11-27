'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import type { ListingFilters, ListingSort } from '../listing.types';

const SORTS: ListingSort[] = ['newest', 'oldest', 'price_asc', 'price_desc'];

function positiveNumber(value: string | null) {
  const parsed = Number(value);
  return value && Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export type FilterKey = 'q' | 'category' | 'school' | 'condition' | 'min' | 'max' | 'sort' | 'page';

/** Browse filters live in the URL, so results can be shared and the back button works. */
export function useListingFilters(fixed: Partial<ListingFilters> = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const filters = useMemo<ListingFilters>(() => {
    const sort = params.get('sort') as ListingSort | null;
    return {
      search: params.get('q') ?? undefined,
      category: fixed.category ?? params.get('category') ?? undefined,
      school: fixed.school ?? params.get('school') ?? undefined,
      condition: params.get('condition') ?? undefined,
      priceMin: positiveNumber(params.get('min')),
      priceMax: positiveNumber(params.get('max')),
      sort: sort && SORTS.includes(sort) ? sort : 'newest',
      page: positiveNumber(params.get('page')) ?? 1,
      limit: 16,
    };
  }, [params, fixed.category, fixed.school]);

  const update = useCallback(
    (changes: Partial<Record<FilterKey, string | number | undefined>>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value === undefined || value === '' || (key === 'sort' && value === 'newest'))
          next.delete(key);
        else next.set(key, String(value));
      }
      if (!('page' in changes)) next.delete('page');
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  const clear = useCallback(() => router.replace(pathname, { scroll: false }), [pathname, router]);

  return { filters, update, clear };
}
