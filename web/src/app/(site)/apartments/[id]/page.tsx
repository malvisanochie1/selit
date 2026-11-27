import type { Metadata } from 'next';

import { ApartmentDetail } from '@/features/apartments/components/ApartmentDetail';

type ApartmentPageProps = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: 'Apartment',
  description: 'Rent, fees, photos and the verified agent for this room near campus.',
};

export default async function ApartmentPage({ params }: ApartmentPageProps) {
  const { id } = await params;
  return (
    <div className="container-page">
      <ApartmentDetail key={id} apartmentId={id} />
    </div>
  );
}
