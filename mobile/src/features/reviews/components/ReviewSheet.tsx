import { messageOf, reviewSchema } from '@selit/shared';
import { Star } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { COLORS } from '@/theme';

import { useCreateReview } from '../hooks';

const LABELS = ['', 'Poor', 'Not great', 'Okay', 'Good', 'Excellent'];

export function ReviewSheet({
  open,
  onClose,
  sellerId,
  sellerName,
}: {
  open: boolean;
  onClose: () => void;
  sellerId: string;
  sellerName: string;
}) {
  const create = useCreateReview(sellerId);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  function submit() {
    const parsed = reviewSchema.safeParse({ rating, comment });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? 'Check your review.');
    setError('');
    create.mutate(parsed.data, {
      onSuccess: () => {
        setRating(0);
        setComment('');
        onClose();
      },
    });
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={`Review ${sellerName.split(' ')[0]}`}
      description="Only review someone you actually met and dealt with."
      footer={
        <View className="flex-1">
          <Button onPress={submit} isLoading={create.isPending}>
            Post review
          </Button>
        </View>
      }
    >
      <View className="gap-5">
        <View className="items-center gap-2">
          <View className="flex-row gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <Pressable
                key={value}
                onPress={() => setRating(value)}
                accessibilityRole="button"
                accessibilityLabel={`${value} stars`}
                hitSlop={4}
              >
                <Star
                  size={36}
                  color={value <= rating ? COLORS.amber[500] : COLORS.ink[300]}
                  fill={value <= rating ? COLORS.amber[500] : 'transparent'}
                />
              </Pressable>
            ))}
          </View>
          <Text className="font-body-semibold text-sm text-ink-600">
            {LABELS[rating] || 'Tap to rate'}
          </Text>
        </View>
        <TextField
          label="How did it go?"
          multiline
          value={comment}
          onChangeText={setComment}
          maxLength={1000}
          placeholder="Was the item as described? Were they on time?"
        />
        {error || create.isError ? (
          <Notice tone="danger">{error || messageOf(create.error)}</Notice>
        ) : null}
      </View>
    </Sheet>
  );
}
