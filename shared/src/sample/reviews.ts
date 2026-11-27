import type { Review } from '../types';

const at = (daysAgo: number) =>
  new Date(Date.parse('2026-11-26T09:00:00.000Z') - daysAgo * 86_400_000).toISOString();

function review(
  id: string,
  sellerId: string,
  reviewerName: string,
  rating: number,
  comment: string,
  daysAgo: number,
  sellerReply: string | null = null,
  reactionCount = 0,
): Review {
  return {
    id,
    reviewerId: `reviewer-${id}`,
    sellerId,
    rating,
    comment,
    sellerReply,
    sellerReplyUpdatedAt: sellerReply ? at(daysAgo - 1) : null,
    reactionCount,
    hasReacted: false,
    createdAt: at(daysAgo),
    updatedAt: at(daysAgo),
    reviewer: { id: `reviewer-${id}`, fullName: reviewerName, profileImageUrl: '' },
  };
}

export const SAMPLE_REVIEWS: Review[] = [
  review(
    'rev-1',
    'user-ada',
    'Chinedu Okoro',
    5,
    'Mattress was exactly as described and very clean. We met at the main gate, no stress at all.',
    3,
    'Thank you Chinedu! Enjoy it.',
    4,
  ),
  review(
    'rev-2',
    'user-ada',
    'Favour Ekeh',
    5,
    'Honest seller. She even helped me carry the drum to the keke.',
    9,
    null,
    2,
  ),
  review(
    'rev-3',
    'user-ada',
    'Samuel Ighalo',
    4,
    'Table had a small scratch she had already mentioned. Fair price.',
    21,
  ),
  review(
    'rev-4',
    'user-tobi',
    'Esther Ojo',
    5,
    'Laptop works perfectly. He let me test everything for 20 minutes before paying.',
    5,
    'Glad it worked out!',
    6,
  ),
  review(
    'rev-5',
    'user-tobi',
    'David Uche',
    4,
    'Phone battery is as stated. Replied fast on WhatsApp.',
    14,
    null,
    1,
  ),
  review(
    'rev-6',
    'user-ifeoma',
    'Grace Obi',
    5,
    'Pots were almost new. Lovely person.',
    7,
    null,
    3,
  ),
  review('rev-7', 'user-blessing', 'Amaka Nnaji', 5, 'Sneakers were brand new as promised.', 4),
  review(
    'rev-8',
    'user-kelechi',
    'Tunde Bello',
    4,
    'Books in good shape, a bit of highlighting.',
    11,
  ),
];
