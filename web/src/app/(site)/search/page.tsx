import type { Metadata } from 'next';
import { Suspense } from 'react';

import { PageHeader } from '@/components/layout/PageHeader';
import { ListingBrowser } from '@/features/listings/components/ListingBrowser';
import { ListingGridSkeleton } from '@/features/listings/components/ListingGrid';

export const metadata: Metadata = {
  title: 'Browse items',
  description:
    'Used furniture, hostel items, electronics, phones and books from students near your campus.',
};

export default function SearchPage() {
  return (
    <div className="container-page">
      <PageHeader
        eyebrow="Marketplace"
        title="Browse items"
        description="Second-hand essentials from students near you, at student prices."
      />
      <Suspense fallback={<ListingGridSkeleton />}>
        <ListingBrowser />
      </Suspense>
    </div>
  );
}
