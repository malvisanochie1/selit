import type { Metadata } from 'next';
import { Suspense } from 'react';

import { ListingPublished } from '@/features/selling/components/ListingPublished';

export const metadata: Metadata = { title: 'Listing published' };

export default function SellSuccessPage() {
  return (
    <Suspense>
      <ListingPublished />
    </Suspense>
  );
}
