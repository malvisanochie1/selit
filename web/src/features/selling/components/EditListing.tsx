'use client';

import { PackageX } from 'lucide-react';

import { AreaHeader } from '@/components/layout/AreaHeader';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSession } from '@/features/auth/hooks/use-session';
import { useListing } from '@/features/listings/hooks/use-listings';

import { ListingForm } from './ListingForm';

export function EditListing({ listingId }: { listingId: string }) {
  const { user } = useSession();
  const { data: listing, isPending, isError } = useListing(listingId);

  if (!user || isPending) return <Skeleton className="h-[32rem] rounded-3xl" />;
  if (isError || listing.sellerId !== user.id) {
    return (
      <EmptyState
        icon={<PackageX />}
        title="You can't edit this listing"
        description="It may have been deleted, or it belongs to another account."
        action={<ButtonLink href="/seller">Back to my listings</ButtonLink>}
      />
    );
  }

  return (
    <>
      <AreaHeader title="Edit listing" description={listing.title} />
      <ListingForm user={user} listing={listing} />
    </>
  );
}
