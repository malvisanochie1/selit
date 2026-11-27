import type { ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/cn';

import { Heading, Text } from './Text';

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <View className={cn('items-center rounded-3xl border border-dashed border-line-strong bg-surface px-6 py-10', className)}>
      <View className="size-14 items-center justify-center rounded-2xl bg-brand-50">{icon}</View>
      <Heading className="mt-5 text-center text-xl">{title}</Heading>
      {description ? <Text className="mt-2 text-center text-sm leading-5 text-ink-500">{description}</Text> : null}
      {action ? <View className="mt-6">{action}</View> : null}
    </View>
  );
}
