import type { Metadata } from 'next';

import { AreaHeader } from '@/components/layout/AreaHeader';
import { getSessionUser } from '@/features/auth/server/get-session';
import { ListingForm } from '@/features/selling/components/ListingForm';

export const metadata: Metadata = { title: 'Sell an item' };

export default async function SellItemPage() {
  const user = await getSessionUser();
  if (!user) return null;

  return (
    <>
      <AreaHeader
        title="Sell an item"
        description="Honest photos and a fair price get the fastest replies."
      />
      <ListingForm user={user} />
    </>
  );
}
