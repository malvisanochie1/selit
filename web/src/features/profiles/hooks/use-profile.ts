'use client';

import { useMutation, useQuery } from '@tanstack/react-query';

import { useSetSessionUser } from '@/features/auth/hooks/use-session';

import { becomeSeller, getPublicProfile, updateMyProfile } from '../profiles.api';

export function usePublicProfile(id: string) {
  return useQuery({
    queryKey: ['profiles', id],
    queryFn: () => getPublicProfile(id),
    enabled: Boolean(id),
  });
}

export function useUpdateMyProfile() {
  const setUser = useSetSessionUser();
  return useMutation({ mutationFn: updateMyProfile, onSuccess: setUser });
}

export function useBecomeSeller() {
  const setUser = useSetSessionUser();
  return useMutation({ mutationFn: becomeSeller, onSuccess: setUser });
}
