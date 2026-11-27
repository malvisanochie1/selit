'use client';

import { Building2, Eye, Heart, Package, Plus, Star } from 'lucide-react';
import Link from 'next/link';

import { AreaHeader } from '@/components/layout/AreaHeader';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { StatCard } from '@/components/ui/StatCard';
import { useSession } from '@/features/auth/hooks/use-session';
import { ListingGrid } from '@/features/listings/components/ListingGrid';
import { useListings } from '@/features/listings/hooks/use-listings';
import { useSellerReviews } from '@/features/reviews/hooks/use-reviews';
import { useRecentListings, useSavedListings } from '@/features/saved/use-saved-listings';
import { VerificationBanner } from '@/features/verification/components/VerificationBanner';
import { useVerificationStatus } from '@/features/verification/hooks/use-verification';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function AccountOverview() {
  const { user } = useSession();
  const { status } = useVerificationStatus();
  const { savedIds } = useSavedListings();
  const recentIds = useRecentListings();
  const mine = useListings({ sellerId: user?.id, status: 'all', limit: 100 }, Boolean(user));
  const reviews = useSellerReviews(user?.id);
  const fresh = useListings({ limit: 4, school: user?.campusLocation || undefined });

  if (!user) return null;

  const myListings = mine.data?.items ?? [];
  const activeCount = myListings.filter((listing) => listing.status === 'active').length;
  const totalViews = myListings.reduce((sum, listing) => sum + listing.viewsCount, 0);

  return (
    <>
      <AreaHeader
        title={`${greeting()}, ${user.fullName.split(' ')[0]}`}
        description="Here's what's happening with your Selit account."
        action={
          <div className="flex gap-2">
            <ButtonLink href="/sell/item">
              <Plus /> List an item
            </ButtonLink>
            <ButtonLink href="/sell/apartment" variant="secondary">
              <Building2 /> List a room
            </ButtonLink>
          </div>
        }
      />

      <Reveal>
        <VerificationBanner status={status} />
      </Reveal>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Active listings"
          value={activeCount}
          icon={<Package />}
          hint={`${myListings.length} in total`}
        />
        <StatCard label="Listing views" value={totalViews} icon={<Eye />} tone="info" />
        <StatCard
          label="Saved items"
          value={savedIds.length}
          icon={<Heart />}
          tone="danger"
          hint="On this device"
        />
        <StatCard
          label="Your rating"
          value={reviews.data?.averageRating ?? 0}
          decimals={1}
          icon={<Star />}
          tone="amber"
          hint={`${reviews.data?.reviewCount ?? 0} reviews`}
        />
      </div>

      <section className="mt-12">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-ink-900">
            {recentIds.length ? 'Pick up where you left off' : 'New near you'}
          </h2>
          <Link
            href={recentIds.length ? '/saved?tab=recent' : '/search'}
            className="text-sm font-semibold text-brand-700"
          >
            See all
          </Link>
        </div>
        {fresh.data?.items.length ? (
          <ListingGrid listings={fresh.data.items} className="mt-6 xl:grid-cols-4" />
        ) : null}
      </section>
    </>
  );
}
