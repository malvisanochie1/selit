import type { ApartmentAction, ApartmentFilters, ApartmentInput } from '@selit/shared';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getApi } from '@/lib/api';

export const apartmentKeys = {
  all: ['apartments'] as const,
  list: (filters: ApartmentFilters) => ['apartments', 'list', filters] as const,
  detail: (id: string) => ['apartments', 'detail', id] as const,
};

export function useApartments(filters: ApartmentFilters, enabled = true) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: apartmentKeys.list(filters),
    queryFn: async () => {
      const result = await getApi().apartments.list(filters);
      for (const apartment of result.items)
        queryClient.setQueryData(apartmentKeys.detail(apartment.id), apartment);
      return result;
    },
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useApartment(id: string) {
  return useQuery({
    queryKey: apartmentKeys.detail(id),
    queryFn: () => getApi().apartments.get(id),
    enabled: Boolean(id),
  });
}

export function useCreateApartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ApartmentInput) => getApi().apartments.create(input),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: apartmentKeys.all }),
  });
}

export function useApartmentAction(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action: ApartmentAction) => getApi().apartments.sendAction(id, action),
    onSuccess: (apartment) => {
      queryClient.setQueryData(apartmentKeys.detail(id), apartment);
      void queryClient.invalidateQueries({ queryKey: ['apartments', 'list'] });
    },
  });
}
