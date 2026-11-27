import { useEffect, useState } from 'react';
import { Pressable, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { cn } from '@/lib/cn';
import { DURATION, EASE_OUT } from '@/theme';

import { Text } from './Text';

export type TabOption<T extends string> = { value: T; label: string };

/** Tabs with a pill that glides to the selected option. */
export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: readonly TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  const [width, setWidth] = useState(0);
  const index = Math.max(0, options.findIndex((option) => option.value === value));
  const segment = width / options.length;
  const left = useSharedValue(0);

  useEffect(() => {
    left.value = withTiming(index * segment, { duration: DURATION.tab, easing: EASE_OUT });
  }, [index, segment, left]);

  const pillStyle = useAnimatedStyle(() => ({ transform: [{ translateX: left.value }] }));

  return (
    <View
      onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width - 8)}
      className={cn('flex-row rounded-2xl bg-ink-100 p-1', className)}
      accessibilityRole="tablist"
    >
      {width > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[{ position: 'absolute', top: 4, bottom: 4, left: 4, width: segment }, pillStyle]}
        >
          <View className="flex-1 rounded-xl bg-surface" style={{ elevation: 1 }} />
        </Animated.View>
      ) : null}
      {options.map((option) => (
        <Pressable
          key={option.value}
          accessibilityRole="tab"
          accessibilityState={{ selected: option.value === value }}
          onPress={() => onChange(option.value)}
          className="h-10 flex-1 items-center justify-center px-1"
        >
          <Text
            numberOfLines={1}
            className={cn('font-body-semibold text-sm', option.value === value ? 'text-ink-900' : 'text-ink-500')}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
