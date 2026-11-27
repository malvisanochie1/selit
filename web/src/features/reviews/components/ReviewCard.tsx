'use client';

import { formatRelativeTime } from '@selit/shared';
import { CornerDownRight, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { RatingStars } from '@/components/ui/RatingStars';
import { cn } from '@/lib/cn';

import { useReplyToReview, useToggleHelpful } from '../hooks/use-reviews';
import type { Review } from '../review.types';

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
  const reviewerName = review.reviewer?.fullName ?? 'Selit user';

  return (
    <article className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
      <header className="flex items-start gap-3">
        <Avatar name={reviewerName} src={review.reviewer?.profileImageUrl} size={44} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink-900">{reviewerName}</p>
          <div className="mt-0.5 flex items-center gap-2 text-sm text-ink-500">
            <RatingStars rating={review.rating} />
            <time dateTime={review.createdAt} suppressHydrationWarning>
              {formatRelativeTime(review.createdAt)}
            </time>
          </div>
        </div>
      </header>
      <p className="mt-4 leading-relaxed text-ink-700">{review.comment}</p>

      {review.sellerReply && !isReplying ? (
        <div className="mt-4 flex gap-3 rounded-2xl bg-canvas p-4">
          <CornerDownRight className="size-4 shrink-0 text-ink-400" />
          <div>
            <p className="text-sm font-semibold text-ink-900">
              Reply from {sellerName.split(' ')[0]}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink-600">{review.sellerReply}</p>
          </div>
        </div>
      ) : null}

      {isReplying ? (
        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (draft.trim().length < 2) return;
            reply.mutate(
              { reviewId: review.id, reply: draft.trim() },
              { onSuccess: () => setIsReplying(false) },
            );
          }}
        >
          <label htmlFor={`reply-${review.id}`} className="sr-only">
            Your reply
          </label>
          <textarea
            id={`reply-${review.id}`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={3}
            maxLength={1000}
            className="w-full rounded-2xl border border-line-strong p-3 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-100 focus:outline-none"
            placeholder="Thank them or clear up anything they mentioned"
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setIsReplying(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit" isLoading={reply.isPending}>
              Post reply
            </Button>
          </div>
        </form>
      ) : null}

      <footer className="mt-4 flex items-center gap-2">
        <button
          type="button"
          disabled={!canReact || helpful.isPending}
          onClick={() => helpful.mutate(review.id)}
          aria-pressed={review.hasReacted}
          className={cn(
            'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-300 active:scale-95 disabled:cursor-default',
            review.hasReacted
              ? 'border-brand-200 bg-brand-50 text-brand-700'
              : 'border-line text-ink-600 enabled:hover:border-ink-300',
          )}
        >
          <ThumbsUp className="size-4" />
          Helpful{review.reactionCount ? ` · ${review.reactionCount}` : ''}
        </button>
        {canReply && !isReplying ? (
          <Button size="sm" variant="ghost" onClick={() => setIsReplying(true)}>
            {review.sellerReply ? 'Edit reply' : 'Reply'}
          </Button>
        ) : null}
      </footer>
    </article>
  );
}
