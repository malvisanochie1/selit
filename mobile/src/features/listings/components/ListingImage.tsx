import { findCategory } from '@selit/shared';
import { Image } from 'expo-image';
import { useState } from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/cn';

import { CATEGORY_ICONS, CATEGORY_TONES } from '../category-style';

/** The item's photo, or a calm category illustration when there isn't one. */
export function ListingImage({
  uri,
  category,
  compact = false,
  className,
}: {
  uri?: string;
  category: string;
  compact?: boolean;
  className?: string;
}) {
  const [hasFailed, setHasFailed] = useState(false);
  const match = findCategory(category);

  if (!uri || hasFailed) {
    const Icon = match ? CATEGORY_ICONS[match.icon] : CATEGORY_ICONS.Shapes;
    const tone = CATEGORY_TONES[match?.tone ?? 'brand'];
    return (
      <View
        className={cn('absolute inset-0 items-center justify-center bg-brand-50/60', className)}
      >
        <View
          className={cn(
            'items-center justify-center',
            compact ? 'size-9 rounded-xl' : 'size-16 rounded-3xl',
            tone.box,
          )}
        >
          <Icon size={compact ? 16 : 28} color={tone.color} strokeWidth={1.75} />
        </View>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      contentFit="cover"
      transition={400}
      onError={() => setHasFailed(true)}
      accessibilityIgnoresInvertColors
    />
  );
}
