import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Heading, Text } from '@/components/ui/Text';
import { SHADOW } from '@/theme';

export function FormSection({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <View style={SHADOW.card} className="rounded-3xl bg-surface p-5">
      <View className="mb-5 flex-row items-start gap-3">
        <View className="size-8 items-center justify-center rounded-xl bg-ink-900">
          <Text className="font-body-bold text-sm text-white">{step}</Text>
        </View>
        <View className="flex-1">
          <Heading className="text-lg">{title}</Heading>
          {description ? (
            <Text className="mt-0.5 text-sm leading-5 text-ink-500">{description}</Text>
          ) : null}
        </View>
      </View>
      <View className="gap-5">{children}</View>
    </View>
  );
}
