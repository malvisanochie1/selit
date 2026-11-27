import type { Metadata } from 'next';

import { MyApartments } from '@/features/selling/components/MyApartments';

export const metadata: Metadata = { title: 'My apartments' };

export default function MyApartmentsPage() {
  return <MyApartments />;
}
