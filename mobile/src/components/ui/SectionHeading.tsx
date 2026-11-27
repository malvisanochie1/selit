import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Heading, Text } from './Text';

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <View className="mb-4 flex-row items-end justify-between gap-4">
      <View className="flex-1">
        {eyebrow ? (
          <Text className="mb-1 font-body-bold text-xs uppercase tracking-widest text-brand-700">
            {eyebrow}
          </Text>
        ) : null}
        <Heading className="text-2xl">{title}</Heading>
      </View>
      {action}
    </View>
  );
}
