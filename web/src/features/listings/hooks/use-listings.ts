'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createListing,
  deleteListing,
  getListing,
  listListings,
  updateListing,
} from '../listings.api';
import type { Listing, ListingFilters, ListingInput, ListingUpdate } from '../listing.types';

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
      const result = await listListings(filters);
      // Seed detail caches so opening an item is instant.
      for (const listing of result.items) {
        queryClient.setQueryData(listingKeys.detail(listing.id), listing);
      }
      return result;
    },
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useListing(id: string, initialListing?: Listing | null) {
  return useQuery({
    queryKey: listingKeys.detail(id),
    queryFn: () => getListing(id),
    initialData: initialListing ?? undefined,
    enabled: Boolean(id),
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ListingInput) => createListing(input),
    onSuccess: (listing) => {
      queryClient.setQueryData(listingKeys.detail(listing.id), listing);
      void queryClient.invalidateQueries({ queryKey: listingKeys.all });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, update }: { id: string; update: ListingUpdate }) =>
      updateListing(id, update),
    onSuccess: (listing: Listing) => {
      queryClient.setQueryData(listingKeys.detail(listing.id), listing);
      void queryClient.invalidateQueries({ queryKey: listingKeys.all });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteListing(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: listingKeys.all }),
  });
}
