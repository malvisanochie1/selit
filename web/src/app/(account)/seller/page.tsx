import type { Metadata } from 'next';

import { MyListings } from '@/features/selling/components/MyListings';

export const metadata: Metadata = { title: 'My listings' };

export default function SellerPage() {
  return <MyListings />;
}
