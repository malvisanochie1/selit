import { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { DURATION, EASE_OUT } from '@/theme';

const MAX_STAGGER_STEPS = 8;
const RISE = 12;

/**
 * A calm fade-and-rise driven by a shared value. Layout animations don't run
 * reliably on Android, so every entrance in the app goes through this hook.
 */
export function useAppear(index = 0, enabled = true) {
  const progress = useSharedValue(enabled ? 0 : 1);

  useEffect(() => {
    if (!enabled) return;
    const delay = Math.min(index, MAX_STAGGER_STEPS) * DURATION.stagger;
    progress.value = withDelay(delay, withTiming(1, { duration: DURATION.appear, easing: EASE_OUT }));
  }, [enabled, index, progress]);

  return useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * RISE }],
  }));
}
