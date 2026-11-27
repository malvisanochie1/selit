'use client';

import { MessageSquareText } from 'lucide-react';

import { AreaHeader } from '@/components/layout/AreaHeader';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSession } from '@/features/auth/hooks/use-session';

import { useSellerReviews } from '../hooks/use-reviews';
import { RatingSummary } from './RatingSummary';
import { ReviewCard } from './ReviewCard';

export function MyReviews() {
  const { user } = useSession();
  const { data, isPending } = useSellerReviews(user?.id);
  if (!user) return null;

  return (
    <>
      <AreaHeader
        title="Reviews"
        description="What buyers say about you. A short, kind reply goes a long way."
        action={
          <ButtonLink href={`/sellers/${user.id}`} variant="secondary">
            View public profile
          </ButtonLink>
        }
      />
      {isPending ? (
        <Skeleton className="h-64 rounded-3xl" />
      ) : !data?.reviewCount ? (
        <EmptyState
          icon={<MessageSquareText />}
          title="No reviews yet"
          description="After a sale, ask the buyer to leave a review on your profile. Good reviews help you sell faster."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
          <div>
            <RatingSummary summary={data} />
          </div>
          <div className="space-y-4">
            {data.reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                sellerName={user.fullName}
                canReply
                canReact={false}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
