import type { ReviewInput } from '@selit/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getApi } from '@/lib/api';

export const reviewKeys = { seller: (id: string) => ['reviews', id] as const };

export function useSellerReviews(sellerId: string | undefined) {
  return useQuery({
    queryKey: reviewKeys.seller(sellerId ?? ''),
    queryFn: () => getApi().reviews.forSeller(sellerId ?? ''),
    enabled: Boolean(sellerId),
  });
}

function useRefreshReviews(sellerId: string) {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: reviewKeys.seller(sellerId) });
    void queryClient.invalidateQueries({ queryKey: ['profiles', sellerId] });
  };
}

export function useCreateReview(sellerId: string) {
  const refresh = useRefreshReviews(sellerId);
  return useMutation({
    mutationFn: (input: ReviewInput) => getApi().reviews.create(sellerId, input),
    onSuccess: refresh,
  });
}

export function useReplyToReview(sellerId: string) {
  const refresh = useRefreshReviews(sellerId);
  return useMutation({
    mutationFn: ({ reviewId, reply }: { reviewId: string; reply: string }) =>
      getApi().reviews.reply(reviewId, reply),
    onSuccess: refresh,
  });
}

export function useToggleHelpful(sellerId: string) {
  const refresh = useRefreshReviews(sellerId);
  return useMutation({
    mutationFn: (reviewId: string) => getApi().reviews.toggleHelpful(reviewId),
    onSuccess: refresh,
  });
}

export function useDeleteReview(sellerId: string) {
  const refresh = useRefreshReviews(sellerId);
  return useMutation({
    mutationFn: (reviewId: string) => getApi().reviews.remove(reviewId),
    onSuccess: refresh,
  });
}
