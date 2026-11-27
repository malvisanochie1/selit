import { useMutation, useQueryClient } from '@tanstack/react-query';

/** Runs an admin action, then refreshes every admin list and the public feeds. */
export function useAdminAction<TInput>(action: (input: TInput) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: action,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin'] });
      void queryClient.invalidateQueries({ queryKey: ['listings'] });
      void queryClient.invalidateQueries({ queryKey: ['apartments'] });
    },
  });
}
