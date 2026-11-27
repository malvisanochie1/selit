'use client';

import { formatDate, messageOf } from '@selit/shared';
import {
  BadgeCheck,
  Building,
  CalendarDays,
  Flag,
  GraduationCap,
  MessageSquareText,
  PackageOpen,
  UserX,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Reveal } from '@/components/motion/Reveal';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { EmptyState } from '@/components/ui/EmptyState';
import { RatingStars } from '@/components/ui/RatingStars';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSession } from '@/features/auth/hooks/use-session';
import { ListingGrid, ListingGridSkeleton } from '@/features/listings/components/ListingGrid';
import { useListings } from '@/features/listings/hooks/use-listings';
import { ReportDialog } from '@/features/reports/components/ReportDialog';
import { RatingSummary } from '@/features/reviews/components/RatingSummary';
import { ReviewCard } from '@/features/reviews/components/ReviewCard';
import { ReviewForm } from '@/features/reviews/components/ReviewForm';
import { useSellerReviews } from '@/features/reviews/hooks/use-reviews';

import { usePublicProfile } from '../hooks/use-profile';

type Tab = 'listings' | 'reviews';

export function SellerProfile({ sellerId }: { sellerId: string }) {
  const pathname = usePathname();
  const { user } = useSession();
  const profile = usePublicProfile(sellerId);
  const listings = useListings({ sellerId, limit: 24, sort: 'newest' });
  const reviews = useSellerReviews(sellerId);
  const [tab, setTab] = useState<Tab>('listings');
  const [isReportOpen, setIsReportOpen] = useState(false);

  if (profile.isPending) {
    return (
      <div className="space-y-6 pt-10">
        <Skeleton className="h-56 w-full rounded-[2rem]" />
        <ListingGridSkeleton count={4} />
      </div>
    );
  }
  if (profile.isError) {
    return (
      <EmptyState
        className="mt-10"
        icon={<UserX />}
        title="Seller not found"
        description={messageOf(profile.error)}
        action={<ButtonLink href="/search">Browse items</ButtonLink>}
      />
    );
  }

  const seller = profile.data;
  const isMe = user?.id === seller.id;
  const isVerified = seller.verificationStatus === 'verified';
  const ratingSummary = reviews.data;
  const hasReviewed = Boolean(
    ratingSummary?.reviews.some((review) => review.reviewerId === user?.id),
  );

  return (
    <>
      <Reveal className="relative mt-8 overflow-hidden rounded-[2rem] bg-surface p-6 shadow-card ring-1 ring-line sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-brand-100/70 blur-3xl"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <Avatar
            name={seller.fullName}
            src={seller.profileImageUrl}
            size={104}
            className="ring-4 ring-brand-50"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">{seller.fullName}</h1>
              {isVerified ? (
                <Badge tone="brand" icon={<BadgeCheck />}>
                  ID verified
                </Badge>
              ) : (
                <Badge tone="amber">Not yet verified</Badge>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-600">
              {seller.campusLocation ? (
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="size-4 text-ink-400" />
                  {seller.campusLocation}
                </span>
              ) : null}
              {seller.department ? (
                <span className="flex items-center gap-1.5">
                  <Building className="size-4 text-ink-400" />
                  {seller.department}
                </span>
              ) : null}
              {seller.createdAt ? (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-4 text-ink-400" />
                  Joined {formatDate(seller.createdAt)}
                </span>
              ) : null}
            </div>
            {seller.bio ? (
              <p className="mt-4 max-w-2xl leading-relaxed text-ink-600">{seller.bio}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:items-end">
            {seller.reviewCount ? (
              <div className="flex items-center gap-2">
                <RatingStars rating={seller.averageRating} size="md" />
                <span className="font-semibold text-ink-900">
                  {seller.averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-ink-500">({seller.reviewCount})</span>
              </div>
            ) : (
              <span className="text-sm text-ink-500">No reviews yet</span>
            )}
            {isMe ? (
              <ButtonLink href="/account/profile" variant="secondary" size="sm">
                Edit profile
              </ButtonLink>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-ink-500 hover:text-danger-600"
                onClick={() => setIsReportOpen(true)}
              >
                <Flag /> Report seller
              </Button>
            )}
          </div>
        </div>
      </Reveal>

      <SegmentedTabs
        label="Seller sections"
        className="mt-10"
        value={tab}
        onChange={setTab}
        options={[
          { value: 'listings', label: 'Listings', count: listings.data?.pagination.total },
          { value: 'reviews', label: 'Reviews', count: ratingSummary?.reviewCount },
        ]}
      />

      <div className="mt-8">
        {tab === 'listings' ? (
          listings.isPending ? (
            <ListingGridSkeleton count={4} />
          ) : listings.data?.items.length ? (
            <ListingGrid listings={listings.data.items} />
          ) : (
            <EmptyState
              icon={<PackageOpen />}
              title="No active listings"
              description="Check back soon."
            />
          )
        ) : (
          <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
            <div className="space-y-4">
              {ratingSummary ? (
                <RatingSummary summary={ratingSummary} />
              ) : (
                <Skeleton className="h-48" />
              )}
              {!user ? (
                <ButtonLink
                  href={`/sign-in?next=${encodeURIComponent(pathname)}`}
                  variant="secondary"
                  fullWidth
                >
                  Sign in to leave a review
                </ButtonLink>
              ) : !isMe && !hasReviewed ? (
                <ReviewForm sellerId={seller.id} sellerName={seller.fullName} />
              ) : null}
            </div>
            <div className="space-y-4">
              {reviews.isPending ? (
                <Skeleton className="h-40" />
              ) : ratingSummary?.reviews.length ? (
                ratingSummary.reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    sellerName={seller.fullName}
                    canReply={isMe}
                    canReact={Boolean(user) && review.reviewerId !== user?.id}
                  />
                ))
              ) : (
                <EmptyState
                  icon={<MessageSquareText />}
                  title="No reviews yet"
                  description="Bought something from this seller? Your review helps the next student."
                />
              )}
            </div>
          </div>
        )}
      </div>

      <p className="mt-10 text-center text-sm text-ink-500">
        Reviews are from students who met this seller. Always meet in public.{' '}
        <Link href="/safety" className="font-semibold text-brand-700 hover:underline">
          Safety tips
        </Link>
      </p>

      <ReportDialog
        open={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetType="user"
        targetId={seller.id}
        targetLabel={seller.fullName}
      />
    </>
  );
}
