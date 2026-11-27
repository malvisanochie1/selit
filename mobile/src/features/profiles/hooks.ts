import type { ProfileUpdateInput } from '@selit/shared';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useSessionStore } from '@/features/auth/session-store';
import { getApi } from '@/lib/api';

export function usePublicProfile(id: string) {
  return useQuery({
    queryKey: ['profiles', id],
    queryFn: () => getApi().profiles.getPublicProfile(id),
    enabled: Boolean(id),
  });
}

export function useUpdateProfile() {
  const setUser = useSessionStore((state) => state.setUser);
  return useMutation({
    mutationFn: (input: ProfileUpdateInput) => getApi().profiles.updateMyProfile(input),
    onSuccess: setUser,
  });
}
