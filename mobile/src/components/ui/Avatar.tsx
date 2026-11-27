import { initialsOf } from '@selit/shared';
import { Image } from 'expo-image';
import { View } from 'react-native';

import { cn } from '@/lib/cn';

import { Text } from './Text';

const SIZES = { sm: 36, md: 48, lg: 72, xl: 96 } as const;

export function Avatar({
  name,
  src,
  size = 'md',
  className,
}: {
  name: string;
  src?: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const dimension = SIZES[size];
  return (
    <View
      style={{ width: dimension, height: dimension, borderRadius: dimension / 2 }}
      className={cn('items-center justify-center overflow-hidden bg-brand-100', className)}
    >
      {src ? (
        <Image
          source={{ uri: src }}
          style={{ width: dimension, height: dimension }}
          contentFit="cover"
          transition={300}
        />
      ) : (
        <Text style={{ fontSize: dimension * 0.36 }} className="font-display-bold text-brand-800">
          {initialsOf(name) || 'S'}
        </Text>
      )}
    </View>
  );
}
