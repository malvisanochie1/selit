import { formatNaira } from '@selit/shared';
import type { Metadata } from 'next';

import { getSessionUser } from '@/features/auth/server/get-session';
import { ListingDetail } from '@/features/listings/components/ListingDetail';
import type { Listing } from '@/features/listings/listing.types';
import { getListingSummary } from '@/features/listings/server/get-listing-summary';

type ProductPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const listing = await getListingSummary((await params).id);
  if (!listing) return { title: 'Item' };
  const title = `${listing.title} · ${formatNaira(listing.price)}`;
  const description = listing.description.slice(0, 160);
  return {
    title,
    description,
    openGraph: { title, description, images: listing.images.slice(0, 1) },
  };
}

/** Phone numbers only reach the page for signed-in visitors. */
function withoutContact(listing: Listing): Listing {
  return listing.seller ? { ...listing, seller: { ...listing.seller, whatsApp: '' } } : listing;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const [listing, user] = await Promise.all([getListingSummary(id), getSessionUser()]);
  const initialListing = listing && !user ? withoutContact(listing) : listing;

  return (
    <div className="container-page">
      <ListingDetail key={id} listingId={id} initialListing={initialListing} />
    </div>
  );
}
