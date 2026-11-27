import type { Metadata } from 'next';
import { Suspense } from 'react';

import { AdminApartments } from '@/features/admin/components/AdminApartments';

export const metadata: Metadata = { title: 'Apartments' };

export default function AdminApartmentsPage() {
  return (
    <Suspense>
      <AdminApartments />
    </Suspense>
  );
}
