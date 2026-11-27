'use client';

import { messageOf } from '@selit/shared';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { TextArea } from '@/components/ui/TextArea';

import { useCreateReview } from '../hooks/use-reviews';
import { StarInput } from './StarInput';

export function ReviewForm({ sellerId, sellerName }: { sellerId: string; sellerName: string }) {
  const create = useCreateReview(sellerId);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  if (create.isSuccess) {
    return <Notice tone="success" title="Thanks for your review" />;
  }

  return (
    <form
      className="rounded-3xl border border-line bg-surface p-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (!rating) return setError('Tap a star to rate your experience.');
        if (comment.trim().length < 3)
          return setError('Tell other students a little about how it went.');
        setError('');
        create.mutate(
          { rating, comment: comment.trim() },
          { onError: (mutationError) => setError(messageOf(mutationError)) },
        );
      }}
    >
      <h3 className="font-sans text-lg font-semibold text-ink-900">
        Rate {sellerName.split(' ')[0]}
      </h3>
      <p className="mt-1 text-sm text-ink-500">
        Only review sellers you actually met or bought from.
      </p>
      <div className="mt-4">
        <StarInput value={rating} onChange={setRating} />
      </div>
      <div className="mt-4">
        <TextArea
          id="review-comment"
          label="Your review"
          rows={3}
          maxLength={1000}
          placeholder="Was the item as described? Were they on time?"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
      </div>
      {error ? (
        <Notice tone="danger" className="mt-4">
          {error}
        </Notice>
      ) : null}
      <Button type="submit" className="mt-5" isLoading={create.isPending}>
        Post review
      </Button>
    </form>
  );
}
