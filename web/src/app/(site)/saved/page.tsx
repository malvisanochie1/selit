import type { Metadata } from 'next';
import { Suspense } from 'react';

import { SavedListings } from '@/features/saved/components/SavedListings';

export const metadata: Metadata = { title: 'Saved items' };

export default function SavedPage() {
  return (
    <div className="container-page pt-10">
      <Suspense>
        <SavedListings />
      </Suspense>
    </div>
  );
}
