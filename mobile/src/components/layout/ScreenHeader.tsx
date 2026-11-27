import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { IconButton } from '@/components/ui/IconButton';
import { Heading } from '@/components/ui/Text';
import { COLORS, MAX_CONTENT_WIDTH } from '@/theme';

/** Back button, title and optional actions for stacked screens. */
export function ScreenHeader({ title, actions, onBack }: { title?: string; actions?: ReactNode; onBack?: () => void }) {
  return (
    <View style={{ width: '100%', maxWidth: MAX_CONTENT_WIDTH, alignSelf: 'center', paddingHorizontal: '5%' }} className="h-16 flex-row items-center gap-3">
      <IconButton
        accessibilityLabel="Go back"
        icon={<ArrowLeft size={20} color={COLORS.ink[900]} />}
        onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))}
      />
      <Heading numberOfLines={1} className="flex-1 text-xl">
        {title ?? ''}
      </Heading>
      {actions ? <View className="flex-row gap-2">{actions}</View> : null}
    </View>
  );
}
