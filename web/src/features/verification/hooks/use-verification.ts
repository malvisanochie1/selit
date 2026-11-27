'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/features/auth/hooks/use-session';

import { getMyVerification, submitVerification } from '../verification.api';

const verificationKey = ['verification', 'me'] as const;

/** The live verification record when the service is on, otherwise the profile's stored status. */
export function useVerificationStatus() {
  const { user } = useSession();
  const query = useQuery({
    queryKey: verificationKey,
    queryFn: getMyVerification,
    enabled: Boolean(user),
  });
  return {
    status: query.data?.status ?? user?.verificationStatus ?? 'unverified',
    reviewNote: query.data?.reviewNote ?? null,
    isLoading: Boolean(user) && query.isPending,
  };
}

export function useSubmitVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitVerification,
    onSuccess: (record) => queryClient.setQueryData(verificationKey, record),
  });
}
