import type { Metadata } from 'next';

import { AdminUsers } from '@/features/admin/components/AdminUsers';

export const metadata: Metadata = { title: 'Users' };

export default function AdminUsersPage() {
  return <AdminUsers />;
}
