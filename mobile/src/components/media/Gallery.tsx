import { Image } from 'expo-image';
import { useState, type ReactNode } from 'react';
import { ScrollView, View, type LayoutChangeEvent } from 'react-native';

import { cn } from '@/lib/cn';

/** Swipeable photos with soft position dots. */
export function Gallery({
  images,
  fallback,
  aspect = 1,
}: {
  images: string[];
  fallback: ReactNode;
  aspect?: number;
}) {
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);

  return (
    <View
      onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
      style={{ aspectRatio: aspect }}
      className="w-full overflow-hidden rounded-[28px] bg-surface"
    >
      {images.length === 0 || width === 0 ? (
        fallback
      ) : (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) =>
            setIndex(Math.round(event.nativeEvent.contentOffset.x / width))
          }
        >
          {images.map((uri, imageIndex) => (
            <Image
              key={uri}
              source={{ uri }}
              style={{ width, height: width / aspect }}
              contentFit="cover"
              transition={400}
              priority={imageIndex === 0 ? 'high' : 'normal'}
              accessibilityLabel={`Photo ${imageIndex + 1} of ${images.length}`}
            />
          ))}
        </ScrollView>
      )}
      {images.length > 1 ? (
        <View className="absolute bottom-3 w-full flex-row justify-center gap-1.5">
          {images.map((uri, dot) => (
            <View
              key={uri}
              className={cn(
                'h-1.5 rounded-full',
                dot === index ? 'w-5 bg-white' : 'w-1.5 bg-white/60',
              )}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
