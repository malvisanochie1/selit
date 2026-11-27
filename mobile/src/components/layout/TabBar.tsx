import type { BottomTabBarProps } from 'expo-router/tabs';
import { Building2, House, Plus, Search, UserRound, type LucideIcon } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/motion/PressableScale';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/cn';
import { COLORS, EASE_OUT, SHADOW } from '@/theme';

const TABS: Record<string, { label: string; icon: LucideIcon }> = {
  index: { label: 'Home', icon: House },
  browse: { label: 'Browse', icon: Search },
  sell: { label: 'Sell', icon: Plus },
  apartments: { label: 'Homes', icon: Building2 },
  account: { label: 'Account', icon: UserRound },
};

// Kept at module level so the pill glides from where it was, even after a remount.
let lastIndex = 0;

/** Floating tab bar with a pill that glides to the active tab and a raised Sell button. */
export function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [width, setWidth] = useState(0);
  const count = state.routes.length;
  const slot = width / count;
  const position = useSharedValue(lastIndex * slot);

  useEffect(() => {
    const distance = Math.abs(state.index - lastIndex);
    position.value = withTiming(state.index * slot, { duration: 520 + 80 * distance, easing: EASE_OUT });
    lastIndex = state.index;
  }, [state.index, slot, position]);

  const pillStyle = useAnimatedStyle(() => ({ transform: [{ translateX: position.value }] }));
  const sellIndex = state.routes.findIndex((route) => route.name === 'sell');
  const showPill = state.index !== sellIndex;

  return (
    <View
      pointerEvents="box-none"
      style={{ position: 'absolute', left: 0, right: 0, bottom: Math.max(insets.bottom, 12), alignItems: 'center' }}
    >
      <View style={[{ width: '92%', maxWidth: 520 }, SHADOW.float]} className="rounded-[28px] bg-ink-900 p-1.5">
        <View className="flex-row" onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}>
          {width > 0 && showPill ? (
            <Animated.View pointerEvents="none" style={[{ position: 'absolute', top: 0, bottom: 0, width: slot }, pillStyle]}>
              <View className="flex-1 rounded-[22px] bg-white/10" />
            </Animated.View>
          ) : null}
          {state.routes.map((route, index) => {
            const tab = TABS[route.name];
            if (!tab) return null;
            const isFocused = state.index === index;
            const Icon = tab.icon;
            const onPress = () => {
              if (!isFocused) navigateToTab(route.key);
            };

            if (route.name === 'sell') {
              return (
                <View key={route.key} className="flex-1 items-center justify-center">
                  <PressableScale
                    onPress={onPress}
                    accessibilityRole="button"
                    accessibilityLabel="Sell something"
                    className="size-12 items-center justify-center rounded-2xl bg-brand-500"
                  >
                    <Plus size={24} color="#fff" strokeWidth={2.4} />
                  </PressableScale>
                </View>
              );
            }

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                accessibilityRole="tab"
                accessibilityState={{ selected: isFocused }}
                accessibilityLabel={tab.label}
                className="h-14 flex-1 items-center justify-center gap-1"
              >
                <Icon size={20} color={isFocused ? COLORS.glow : COLORS.ink[300]} strokeWidth={isFocused ? 2.4 : 2} />
                <Text className={cn('font-body-semibold text-[11px]', isFocused ? 'text-white' : 'text-ink-300')}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
