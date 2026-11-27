import { Star } from 'lucide-react-native';
import { View } from 'react-native';

import { COLORS } from '@/theme';

export function RatingStars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <View className="flex-row gap-0.5" accessibilityLabel={`${value.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = value >= index + 0.5;
        return (
          <Star
            key={index}
            size={size}
            color={filled ? COLORS.amber[500] : COLORS.ink[300]}
            fill={filled ? COLORS.amber[500] : 'transparent'}
          />
        );
      })}
    </View>
  );
}
