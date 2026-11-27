import type { Metadata } from 'next';
import { Suspense } from 'react';

import { AdminListings } from '@/features/admin/components/AdminListings';

export const metadata: Metadata = { title: 'Listings' };

export default function AdminListingsPage() {
  return (
    <Suspense>
      <AdminListings />
    </Suspense>
  );
}
