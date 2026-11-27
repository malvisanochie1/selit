import { formatDate, messageOf } from '@selit/shared';
import { router, useLocalSearchParams } from 'expo-router';
import { BadgeCheck, Flag, MessageSquareText, Star, UserX } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Appear } from '@/components/motion/Appear';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { Heading, Text } from '@/components/ui/Text';
import { useSession } from '@/features/auth/session-store';
import { ListingGrid, ListingGridSkeleton } from '@/features/listings/components/ListingGrid';
import { useListings } from '@/features/listings/hooks';
import { usePublicProfile } from '@/features/profiles/hooks';
import { RatingSummary } from '@/features/reviews/components/RatingSummary';
import { ReviewCard } from '@/features/reviews/components/ReviewCard';
import { ReviewSheet } from '@/features/reviews/components/ReviewSheet';
import { useSellerReviews } from '@/features/reviews/hooks';
import { ReportSheet } from '@/features/safety/components/ReportSheet';
import { COLORS, SHADOW } from '@/theme';

export default function SellerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, isSignedIn } = useSession();
  const profile = usePublicProfile(id);
  const listings = useListings({ sellerId: id, limit: 12 });
  const reviews = useSellerReviews(id);
  const [tab, setTab] = useState<'listings' | 'reviews'>('listings');
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  if (profile.isPending) {
    return (
      <Screen header={<ScreenHeader />}>
        <Skeleton height={180} />
      </Screen>
    );
  }

  if (profile.isError || !profile.data) {
    return (
      <Screen header={<ScreenHeader />}>
        <EmptyState
          icon={<UserX size={26} color={COLORS.brand[700]} />}
          title="This member isn't available"
          description={messageOf(profile.error)}
        />
      </Screen>
    );
  }

  const seller = profile.data;
  const isSelf = user?.id === seller.id;
  const hasReviewed = reviews.data?.reviews.some((review) => review.reviewerId === user?.id);

  return (
    <Screen header={<ScreenHeader title={seller.fullName} />}>
      <Appear>
        <View style={SHADOW.card} className="items-center rounded-[28px] bg-surface p-6">
          <Avatar name={seller.fullName} src={seller.profileImageUrl} size="xl" />
          <Heading className="mt-4 text-center text-2xl">{seller.fullName}</Heading>
          <View className="mt-2 flex-row gap-1.5">
            {seller.verificationStatus === 'verified' ? (
              <Badge tone="brand" icon={<BadgeCheck size={12} color={COLORS.brand[700]} />}>
                ID verified
              </Badge>
            ) : (
              <Badge tone="amber">Not yet verified</Badge>
            )}
          </View>
          <Text className="mt-3 text-center text-sm text-ink-500">
            {[seller.campusLocation, seller.department].filter(Boolean).join(' · ')}
          </Text>
          {seller.bio ? (
            <Text className="mt-3 text-center leading-6 text-ink-700">{seller.bio}</Text>
          ) : null}
          <View className="mt-5 w-full flex-row divide-x divide-line rounded-2xl bg-canvas py-3">
            <View className="flex-1 items-center">
              <View className="flex-row items-center gap-1">
                <Star size={14} color={COLORS.amber[500]} fill={COLORS.amber[500]} />
                <Text className="font-display-bold text-lg text-ink-900">
                  {seller.averageRating.toFixed(1)}
                </Text>
              </View>
              <Text className="text-xs text-ink-500">{seller.reviewCount} reviews</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="font-display-bold text-lg text-ink-900">
                {listings.data?.pagination.total ?? '–'}
              </Text>
              <Text className="text-xs text-ink-500">Live items</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="font-display-bold text-lg text-ink-900">
                {new Date(seller.createdAt).getFullYear() || '–'}
              </Text>
              <Text className="text-xs text-ink-500">Member since</Text>
            </View>
          </View>
        </View>
      </Appear>

      <SegmentedTabs
        className="mt-6"
        value={tab}
        onChange={setTab}
        options={[
          { value: 'listings', label: 'Listings' },
          { value: 'reviews', label: `Reviews (${seller.reviewCount})` },
        ]}
      />

      <View className="mt-5">
        {tab === 'listings' ? (
          listings.isPending ? (
            <ListingGridSkeleton />
          ) : listings.data?.items.length ? (
            <ListingGrid listings={listings.data.items} />
          ) : (
            <EmptyState
              icon={<MessageSquareText size={24} color={COLORS.brand[700]} />}
              title="Nothing for sale right now"
            />
          )
        ) : (
          <View className="gap-4">
            {reviews.data ? (
              <RatingSummary
                average={reviews.data.averageRating}
                count={reviews.data.reviewCount}
                reviews={reviews.data.reviews}
              />
            ) : null}
            {!isSelf && !hasReviewed ? (
              <Button
                variant="secondary"
                icon={<Star size={16} color={COLORS.ink[900]} />}
                onPress={() => (isSignedIn ? setIsReviewOpen(true) : router.push('/sign-in'))}
              >
                Write a review
              </Button>
            ) : null}
            {reviews.isPending ? <Skeleton height={140} /> : null}
            {reviews.data?.reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                sellerName={seller.fullName}
                canReply={isSelf}
                canReact={isSignedIn && !isSelf}
              />
            ))}
          </View>
        )}
      </View>

      {!isSelf ? (
        <Button
          className="mt-8"
          variant="ghost"
          icon={<Flag size={16} color={COLORS.danger[600]} />}
          onPress={() => setIsReportOpen(true)}
        >
          <Text className="font-body-semibold text-danger-600">Report this member</Text>
        </Button>
      ) : null}
      <Text className="mt-2 text-center text-xs text-ink-400">
        Member since {formatDate(seller.createdAt)}
      </Text>

      <ReviewSheet
        open={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        sellerId={seller.id}
        sellerName={seller.fullName}
      />
      <ReportSheet
        open={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetType="user"
        targetId={seller.id}
        targetLabel={seller.fullName}
      />
    </Screen>
  );
}
