import { Star } from 'lucide-react-native';
import { View } from 'react-native';

import { PageTitle } from '@/components/layout/PageTitle';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSession } from '@/features/auth/session-store';
import { RatingSummary } from '@/features/reviews/components/RatingSummary';
import { ReviewCard } from '@/features/reviews/components/ReviewCard';
import { useSellerReviews } from '@/features/reviews/hooks';
import { COLORS } from '@/theme';

export default function MyReviewsScreen() {
  const { user } = useSession();
  const { data, isPending, refetch, isRefetching } = useSellerReviews(user?.id);

  return (
    <Screen header={<ScreenHeader />} onRefresh={() => void refetch()} isRefreshing={isRefetching}>
      <PageTitle
        title="Reviews about me"
        description="Reply to thank people or clear up anything they mention."
      />
      {isPending ? (
        <Skeleton height={200} />
      ) : !data || data.reviews.length === 0 ? (
        <EmptyState
          icon={<Star size={24} color={COLORS.brand[700]} />}
          title="No reviews yet"
          description="After a deal, ask the buyer to leave a review on your profile. It helps the next buyer trust you."
        />
      ) : (
        <View className="gap-4">
          <RatingSummary
            average={data.averageRating}
            count={data.reviewCount}
            reviews={data.reviews}
          />
          {data.reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              sellerName={user?.fullName ?? ''}
              canReply
              canReact={false}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
