import type { ReviewInput } from '@selit/shared';

import { getApi } from '@/lib/api';

export function getSellerReviews(sellerId: string) {
  return getApi().reviews.forSeller(sellerId);
}

export function createReview(sellerId: string, input: ReviewInput) {
  return getApi().reviews.create(sellerId, input);
}

export function replyToReview(reviewId: string, reply: string) {
  return getApi().reviews.reply(reviewId, reply);
}

export function toggleHelpful(reviewId: string) {
  return getApi().reviews.toggleHelpful(reviewId);
}

export function deleteReview(reviewId: string) {
  return getApi().reviews.remove(reviewId);
}
