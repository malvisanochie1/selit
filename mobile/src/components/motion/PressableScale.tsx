import type { ReactNode } from 'react';
import { Pressable, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { DURATION, EASE_OUT } from '@/theme';

type PressableScaleProps = Omit<PressableProps, 'style' | 'children'> & {
  children: ReactNode;
  /** Classes for the inner view (layout, colours, radius). */
  className?: string;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  scaleTo?: number;
};

/** Shrinks softly while pressed and settles back smoothly on release. */
export function PressableScale({
  children,
  className,
  style,
  innerStyle,
  scaleTo = 0.96,
  disabled,
  ...props
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      {...props}
      disabled={disabled}
      onPressIn={(event) => {
        scale.value = withTiming(scaleTo, { duration: DURATION.pressIn, easing: EASE_OUT });
        props.onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.value = withTiming(1, { duration: DURATION.release, easing: EASE_OUT });
        props.onPressOut?.(event);
      }}
      style={style}
    >
      <Animated.View style={animatedStyle}>
        <View className={className} style={innerStyle}>
          {children}
        </View>
      </Animated.View>
    </Pressable>
  );
}
