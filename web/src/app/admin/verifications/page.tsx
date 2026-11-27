import type { Metadata } from 'next';

import { AdminVerifications } from '@/features/admin/components/AdminVerifications';

export const metadata: Metadata = { title: 'Verifications' };

export default function AdminVerificationsPage() {
  return <AdminVerifications />;
}
