import type { Review } from '@selit/shared';
import { View } from 'react-native';

import { RatingStars } from '@/components/ui/RatingStars';
import { Text } from '@/components/ui/Text';

export function RatingSummary({
  average,
  count,
  reviews,
}: {
  average: number;
  count: number;
  reviews: Review[];
}) {
  return (
    <View className="flex-row items-center gap-5 rounded-3xl border border-line bg-surface p-5">
      <View className="items-center">
        <Text className="font-display-bold text-5xl text-ink-900">{average.toFixed(1)}</Text>
        <RatingStars value={average} />
        <Text className="mt-1 text-xs text-ink-500">
          {count} {count === 1 ? 'review' : 'reviews'}
        </Text>
      </View>
      <View className="flex-1 gap-1.5">
        {[5, 4, 3, 2, 1].map((stars) => {
          const share = reviews.length
            ? reviews.filter((review) => review.rating === stars).length / reviews.length
            : 0;
          return (
            <View key={stars} className="flex-row items-center gap-2">
              <Text className="w-3 text-xs text-ink-500">{stars}</Text>
              <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                <View
                  style={{ width: `${share * 100}%` }}
                  className="h-full rounded-full bg-amber-500"
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
