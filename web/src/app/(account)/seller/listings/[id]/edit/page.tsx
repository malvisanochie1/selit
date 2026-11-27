import type { Metadata } from 'next';

import { EditListing } from '@/features/selling/components/EditListing';

export const metadata: Metadata = { title: 'Edit listing' };

type EditListingPageProps = { params: Promise<{ id: string }> };

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params;
  return <EditListing key={id} listingId={id} />;
}
