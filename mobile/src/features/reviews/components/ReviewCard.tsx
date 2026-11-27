import { formatRelativeTime, type Review } from '@selit/shared';
import { CornerDownRight, ThumbsUp } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { PressableScale } from '@/components/motion/PressableScale';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { RatingStars } from '@/components/ui/RatingStars';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { cn } from '@/lib/cn';
import { COLORS } from '@/theme';

import { useReplyToReview, useToggleHelpful } from '../hooks';

type ReviewCardProps = {
  review: Review;
  sellerName: string;
  canReply: boolean;
  canReact: boolean;
};

export function ReviewCard({ review, sellerName, canReply, canReact }: ReviewCardProps) {
  const helpful = useToggleHelpful(review.sellerId);
  const reply = useReplyToReview(review.sellerId);
  const [isReplying, setIsReplying] = useState(false);
  const [draft, setDraft] = useState(review.sellerReply ?? '');
  const reviewerName = review.reviewer?.fullName ?? 'Selit member';

  return (
    <View className="rounded-3xl border border-line bg-surface p-5">
      <View className="flex-row items-start gap-3">
        <Avatar name={reviewerName} src={review.reviewer?.profileImageUrl} size="sm" />
        <View className="flex-1">
          <Text className="font-body-semibold text-ink-900">{reviewerName}</Text>
          <View className="mt-1 flex-row items-center gap-2">
            <RatingStars value={review.rating} size={12} />
            <Text className="text-xs text-ink-500">{formatRelativeTime(review.createdAt)}</Text>
          </View>
        </View>
      </View>
      <Text className="mt-3 leading-6 text-ink-700">{review.comment}</Text>

      {review.sellerReply && !isReplying ? (
        <View className="mt-4 flex-row gap-3 rounded-2xl bg-canvas p-4">
          <CornerDownRight size={16} color={COLORS.ink[400]} />
          <View className="flex-1">
            <Text className="font-body-semibold text-sm text-ink-900">
              Reply from {sellerName.split(' ')[0]}
            </Text>
            <Text className="mt-1 text-sm leading-5 text-ink-600">{review.sellerReply}</Text>
          </View>
        </View>
      ) : null}

      {isReplying ? (
        <View className="mt-4 gap-3">
          <TextField
            multiline
            value={draft}
            onChangeText={setDraft}
            maxLength={1000}
            placeholder="Thank them or clear up anything they mentioned"
          />
          <View className="flex-row justify-end gap-2">
            <Button size="sm" variant="ghost" onPress={() => setIsReplying(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              isLoading={reply.isPending}
              onPress={() => {
                if (draft.trim().length < 2) return;
                reply.mutate(
                  { reviewId: review.id, reply: draft.trim() },
                  { onSuccess: () => setIsReplying(false) },
                );
              }}
            >
              Post reply
            </Button>
          </View>
        </View>
      ) : null}

      <View className="mt-4 flex-row items-center gap-2">
        <PressableScale
          disabled={!canReact || helpful.isPending}
          onPress={() => helpful.mutate(review.id)}
          accessibilityRole="button"
          accessibilityState={{ selected: review.hasReacted }}
          className={cn(
            'h-9 flex-row items-center gap-1.5 rounded-full border px-3',
            review.hasReacted ? 'border-brand-200 bg-brand-50' : 'border-line',
          )}
        >
          <ThumbsUp size={14} color={review.hasReacted ? COLORS.brand[700] : COLORS.ink[600]} />
          <Text
            className={cn(
              'font-body-semibold text-sm',
              review.hasReacted ? 'text-brand-700' : 'text-ink-600',
            )}
          >
            Helpful{review.reactionCount ? ` · ${review.reactionCount}` : ''}
          </Text>
        </PressableScale>
        {canReply && !isReplying ? (
          <Button size="sm" variant="ghost" onPress={() => setIsReplying(true)}>
            {review.sellerReply ? 'Edit reply' : 'Reply'}
          </Button>
        ) : null}
      </View>
    </View>
  );
}
