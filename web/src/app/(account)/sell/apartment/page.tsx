import type { Metadata } from 'next';

import { AreaHeader } from '@/components/layout/AreaHeader';
import { getSessionUser } from '@/features/auth/server/get-session';
import { ApartmentForm } from '@/features/selling/components/ApartmentForm';

export const metadata: Metadata = { title: 'List a room' };

export default async function SellApartmentPage() {
  const user = await getSessionUser();
  if (!user) return null;

  return (
    <>
      <AreaHeader
        title="List a room"
        description="Rent, fees and real photos upfront. Students trust listings that hide nothing."
      />
      <ApartmentForm user={user} />
    </>
  );
}
