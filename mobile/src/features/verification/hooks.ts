import type { VerificationSubmission } from '@selit/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSession, useSessionStore } from '@/features/auth/session-store';
import { getApi } from '@/lib/api';

const verificationKey = ['verification', 'me'] as const;

export function useVerificationStatus() {
  const { user } = useSession();
  const query = useQuery({ queryKey: verificationKey, queryFn: () => getApi().verification.mine(), enabled: Boolean(user) });
  return {
    status: query.data?.status ?? user?.verificationStatus ?? 'unverified',
    record: query.data,
    isLoading: Boolean(user) && query.isPending,
  };
}

export function useSubmitVerification() {
  const queryClient = useQueryClient();
  const refresh = useSessionStore((state) => state.refresh);
  return useMutation({
    mutationFn: (submission: VerificationSubmission) => getApi().verification.submit(submission),
    onSuccess: (record) => {
      queryClient.setQueryData(verificationKey, record);
      void refresh();
    },
  });
}
