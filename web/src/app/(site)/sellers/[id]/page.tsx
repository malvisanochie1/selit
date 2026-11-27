import type { Metadata } from 'next';

import { SellerProfile } from '@/features/profiles/components/SellerProfile';

type SellerPageProps = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: 'Seller profile',
  description: 'Listings, ratings and reviews for this Selit seller.',
};

export default async function SellerPage({ params }: SellerPageProps) {
  const { id } = await params;
  return (
    <div className="container-page">
      <SellerProfile key={id} sellerId={id} />
    </div>
  );
}
