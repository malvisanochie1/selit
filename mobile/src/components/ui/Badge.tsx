import type { ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/cn';

import { Text } from './Text';

export type BadgeTone = 'brand' | 'amber' | 'danger' | 'neutral' | 'dark' | 'info';

const TONES: Record<BadgeTone, { box: string; text: string }> = {
  brand: { box: 'bg-brand-50', text: 'text-brand-700' },
  amber: { box: 'bg-amber-50', text: 'text-amber-700' },
  danger: { box: 'bg-danger-50', text: 'text-danger-700' },
  neutral: { box: 'bg-ink-100', text: 'text-ink-700' },
  dark: { box: 'bg-ink-900/85', text: 'text-white' },
  info: { box: 'bg-info-50', text: 'text-info-700' },
};

export function Badge({
  children,
  tone = 'neutral',
  icon,
  className,
}: {
  children: string;
  tone?: BadgeTone;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <View
      className={cn(
        'flex-row items-center gap-1 self-start rounded-full px-2.5 py-1',
        TONES[tone].box,
        className,
      )}
    >
      {icon}
      <Text className={cn('font-body-semibold text-xs', TONES[tone].text)}>{children}</Text>
    </View>
  );
}
