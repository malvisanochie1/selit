'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createReview,
  deleteReview,
  getSellerReviews,
  replyToReview,
  toggleHelpful,
} from '../reviews.api';
import type { ReviewInput } from '../review.types';

export const reviewKeys = {
  seller: (sellerId: string) => ['reviews', sellerId] as const,
};

export function useSellerReviews(sellerId: string | undefined) {
  return useQuery({
    queryKey: reviewKeys.seller(sellerId ?? ''),
    queryFn: () => getSellerReviews(sellerId as string),
    enabled: Boolean(sellerId),
  });
}

function useInvalidate(sellerId: string) {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: reviewKeys.seller(sellerId) });
    void queryClient.invalidateQueries({ queryKey: ['profiles', sellerId] });
  };
}

export function useCreateReview(sellerId: string) {
  const invalidate = useInvalidate(sellerId);
  return useMutation({
    mutationFn: (input: ReviewInput) => createReview(sellerId, input),
    onSuccess: invalidate,
  });
}

export function useReplyToReview(sellerId: string) {
  const invalidate = useInvalidate(sellerId);
  return useMutation({
    mutationFn: ({ reviewId, reply }: { reviewId: string; reply: string }) =>
      replyToReview(reviewId, reply),
    onSuccess: invalidate,
  });
}

export function useToggleHelpful(sellerId: string) {
  const invalidate = useInvalidate(sellerId);
  return useMutation({ mutationFn: toggleHelpful, onSuccess: invalidate });
}

export function useDeleteReview(sellerId: string) {
  const invalidate = useInvalidate(sellerId);
  return useMutation({ mutationFn: deleteReview, onSuccess: invalidate });
}
