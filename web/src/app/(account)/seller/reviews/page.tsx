import type { Metadata } from 'next';

import { MyReviews } from '@/features/reviews/components/MyReviews';

export const metadata: Metadata = { title: 'Reviews' };

export default function SellerReviewsPage() {
  return <MyReviews />;
}
