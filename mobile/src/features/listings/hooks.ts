import type { Listing, ListingFilters, ListingInput, ListingUpdate } from '@selit/shared';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getApi } from '@/lib/api';

export const listingKeys = {
  all: ['listings'] as const,
  list: (filters: ListingFilters) => ['listings', 'list', filters] as const,
  detail: (id: string) => ['listings', 'detail', id] as const,
};

export function useListings(filters: ListingFilters, enabled = true) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: listingKeys.list(filters),
    queryFn: async () => {
      const result = await getApi().listings.list(filters);
      // Seed detail caches so opening an item is instant.
      for (const listing of result.items)
        queryClient.setQueryData(listingKeys.detail(listing.id), listing);
      return result;
    },
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: listingKeys.detail(id),
    queryFn: () => getApi().listings.get(id),
    enabled: Boolean(id),
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ListingInput) => getApi().listings.create(input),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: listingKeys.all }),
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, update }: { id: string; update: ListingUpdate }) =>
      getApi().listings.update(id, update),
    onSuccess: (listing: Listing) => {
      queryClient.setQueryData(listingKeys.detail(listing.id), listing);
      void queryClient.invalidateQueries({ queryKey: ['listings', 'list'] });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => getApi().listings.remove(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: listingKeys.all }),
  });
}
