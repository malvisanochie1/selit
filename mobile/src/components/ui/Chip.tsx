import type { ReactNode } from 'react';
import { View } from 'react-native';

import { PressableScale } from '@/components/motion/PressableScale';
import { cn } from '@/lib/cn';

import { Text } from './Text';

type ChipProps = {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
  icon?: ReactNode;
  className?: string;
};

export function Chip({ label, isActive = false, onPress, icon, className }: ChipProps) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      className={cn(
        'h-10 flex-row items-center gap-1.5 rounded-full border px-4',
        isActive ? 'border-ink-900 bg-ink-900' : 'border-line-strong bg-surface',
        className,
      )}
    >
      {icon ? <View>{icon}</View> : null}
      <Text className={cn('font-body-semibold text-sm', isActive ? 'text-white' : 'text-ink-700')}>
        {label}
      </Text>
    </PressableScale>
  );
}
