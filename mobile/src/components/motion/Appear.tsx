import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { useAppear } from './use-appear';

type AppearProps = {
  children: ReactNode;
  index?: number;
  /** Only the first screenful animates; items met while scrolling simply appear. */
  enabled?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
};

/** Animated wrapper (style only) around a plain view that carries the classes. */
export function Appear({ children, index = 0, enabled = true, style, className }: AppearProps) {
  const animatedStyle = useAppear(index, enabled);
  return (
    <Animated.View style={[animatedStyle, style]}>
      <View className={className}>{children}</View>
    </Animated.View>
  );
}
