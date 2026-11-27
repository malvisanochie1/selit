import type { Metadata } from 'next';

import { AdminCategories } from '@/features/admin/components/AdminCategories';

export const metadata: Metadata = { title: 'Categories' };

export default function AdminCategoriesPage() {
  return <AdminCategories />;
}
