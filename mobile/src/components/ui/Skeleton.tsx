import { useEffect } from 'react';
import { View, type DimensionValue } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { EASE_IN_OUT } from '@/theme';

/** A soft breathing placeholder while content loads. */
export function Skeleton({
  height,
  width = '100%',
  radius = 24,
}: {
  height: DimensionValue;
  width?: DimensionValue;
  radius?: number;
}) {
  const opacity = useSharedValue(0.55);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 900, easing: EASE_IN_OUT }), -1, true);
  }, [opacity]);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View style={[{ height, width, borderRadius: radius, overflow: 'hidden' }, style]}>
      <View className="flex-1 bg-ink-100" />
    </Animated.View>
  );
}
