import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Heading, Text } from '@/components/ui/Text';

/** The large title and supporting line at the top of a section screen. */
export function PageTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <View className="mb-6 mt-2 flex-row items-end gap-4">
      <View className="flex-1">
        <Heading className="text-3xl">{title}</Heading>
        {description ? (
          <Text className="mt-1.5 text-sm leading-5 text-ink-500">{description}</Text>
        ) : null}
      </View>
      {action}
    </View>
  );
}
