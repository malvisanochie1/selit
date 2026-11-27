import { X } from 'lucide-react-native';
import { useEffect, useState, type ReactNode } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, DURATION, EASE_OUT } from '@/theme';

import { IconButton } from './IconButton';
import { Heading, Text } from './Text';

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

/** A bottom sheet that rises smoothly and settles; closes on the backdrop or the X. */
export function Sheet({ open, onClose, title, description, children, footer }: SheetProps) {
  const insets = useSafeAreaInsets();
  const [isMounted, setIsMounted] = useState(open);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      progress.value = withTiming(1, { duration: DURATION.appear, easing: EASE_OUT });
    } else {
      progress.value = withTiming(0, { duration: 360, easing: EASE_OUT });
      const timer = setTimeout(() => setIsMounted(false), 360);
      return () => clearTimeout(timer);
    }
  }, [open, progress]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const panelStyle = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - progress.value) * 420 }] }));

  return (
    <Modal visible={isMounted} transparent statusBarTranslucent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[{ flex: 1, backgroundColor: 'rgba(8,18,42,0.45)' }, backdropStyle]}>
        <Pressable accessibilityLabel="Close" style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[{ position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center' }, panelStyle]}>
        <View
          style={{ width: '100%', maxWidth: 620, maxHeight: '88%', paddingBottom: insets.bottom + 16 }}
          className="rounded-t-[32px] bg-surface"
        >
          <View className="items-center pt-3">
            <View className="h-1.5 w-12 rounded-full bg-ink-200" />
          </View>
          <View className="flex-row items-start gap-3 px-6 pb-2 pt-4">
            <View className="flex-1">
              <Heading className="text-xl">{title}</Heading>
              {description ? <Text className="mt-1 text-sm text-ink-500">{description}</Text> : null}
            </View>
            <IconButton accessibilityLabel="Close" tone="plain" icon={<X size={20} color={COLORS.ink[500]} />} onPress={onClose} />
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 8 }}>
            {children}
          </ScrollView>
          {footer ? <View className="flex-row gap-3 px-6 pt-3">{footer}</View> : null}
        </View>
      </Animated.View>
    </Modal>
  );
}
