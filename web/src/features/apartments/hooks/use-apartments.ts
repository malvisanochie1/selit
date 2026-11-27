'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createApartment,
  getApartment,
  listApartments,
  sendApartmentAction,
} from '../apartments.api';
import type { ApartmentFilters } from '../apartment.types';

export const apartmentKeys = {
  all: ['apartments'] as const,
  list: (filters: ApartmentFilters) => ['apartments', 'list', filters] as const,
  detail: (id: string) => ['apartments', 'detail', id] as const,
};

export function useApartments(filters: ApartmentFilters, enabled = true) {
  return useQuery({
    queryKey: apartmentKeys.list(filters),
    queryFn: () => listApartments(filters),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useApartment(id: string) {
  return useQuery({
    queryKey: apartmentKeys.detail(id),
    queryFn: () => getApartment(id),
    enabled: Boolean(id),
  });
}

export function useCreateApartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createApartment,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: apartmentKeys.all }),
  });
}

export function useApartmentAction(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action: Parameters<typeof sendApartmentAction>[1]) =>
      sendApartmentAction(id, action),
    onSuccess: (apartment) => {
      queryClient.setQueryData(apartmentKeys.detail(id), apartment);
      void queryClient.invalidateQueries({ queryKey: ['apartments', 'list'] });
    },
  });
}
