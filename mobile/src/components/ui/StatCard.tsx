import { formatCompact } from '@selit/shared';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/cn';
import { SHADOW } from '@/theme';

import { Text } from './Text';

const TONES = { brand: 'bg-brand-50', amber: 'bg-amber-50', info: 'bg-info-50', neutral: 'bg-ink-100' } as const;

export function StatCard({
  label,
  value,
  icon,
  tone = 'brand',
}: {
  label: string;
  value: number;
  icon: ReactNode;
  tone?: keyof typeof TONES;
}) {
  return (
    <View style={SHADOW.card} className="flex-1 rounded-3xl bg-surface p-4">
      <View className="flex-row items-start justify-between">
        <Text className="font-body-semibold text-sm text-ink-500">{label}</Text>
        <View className={cn('size-9 items-center justify-center rounded-xl', TONES[tone])}>{icon}</View>
      </View>
      <Text className="mt-4 font-display-bold text-3xl text-ink-900">{formatCompact(value)}</Text>
    </View>
  );
}
