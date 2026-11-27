import { Image } from 'expo-image';
import { Camera, ImagePlus, X } from 'lucide-react-native';
import { Platform, Pressable, View } from 'react-native';

import { PressableScale } from '@/components/motion/PressableScale';
import { Text } from '@/components/ui/Text';
import { pickPhotos, type PickedPhoto } from '@/lib/photos';
import { cn } from '@/lib/cn';
import { COLORS } from '@/theme';

/** A photo already uploaded (when editing) or a new one picked on this phone. */
export type PhotoItem =
  { kind: 'existing'; url: string; path: string } | { kind: 'new'; photo: PickedPhoto };

type PhotoPickerProps = {
  photos: PhotoItem[];
  onChange: (photos: PhotoItem[]) => void;
  max: number;
  error?: string;
  hint?: string;
};

function uriOf(item: PhotoItem) {
  return item.kind === 'existing' ? item.url : item.photo.uri;
}

export function PhotoPicker({ photos, onChange, max, error, hint }: PhotoPickerProps) {
  const remaining = max - photos.length;

  async function add(source: 'camera' | 'library') {
    const picked = await pickPhotos(source, remaining);
    if (picked.length)
      onChange(
        [...photos, ...picked.map((photo) => ({ kind: 'new' as const, photo }))].slice(0, max),
      );
  }

  return (
    <View className="gap-3">
      <View className="flex-row flex-wrap" style={{ marginHorizontal: -5 }}>
        {photos.map((item, index) => (
          <View key={uriOf(item)} style={{ width: '33.333%', padding: 5 }}>
            <View className="aspect-square overflow-hidden rounded-2xl bg-canvas">
              <Image
                source={{ uri: uriOf(item) }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
              {index === 0 ? (
                <View className="absolute bottom-1.5 left-1.5 rounded-full bg-ink-900/80 px-2 py-0.5">
                  <Text className="font-body-semibold text-[10px] text-white">Cover</Text>
                </View>
              ) : null}
              <Pressable
                onPress={() => onChange(photos.filter((_, position) => position !== index))}
                accessibilityRole="button"
                accessibilityLabel="Remove photo"
                hitSlop={6}
                className="absolute right-1.5 top-1.5 size-7 items-center justify-center rounded-full bg-white/90"
              >
                <X size={14} color={COLORS.ink[900]} />
              </Pressable>
            </View>
          </View>
        ))}
        {remaining > 0 ? (
          <>
            {Platform.OS !== 'web' ? (
              <View style={{ width: '33.333%', padding: 5 }}>
                <PressableScale
                  onPress={() => void add('camera')}
                  accessibilityRole="button"
                  accessibilityLabel="Take a photo"
                  className="aspect-square items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-line-strong bg-surface"
                >
                  <Camera size={22} color={COLORS.brand[600]} />
                  <Text className="font-body-semibold text-xs text-ink-600">Camera</Text>
                </PressableScale>
              </View>
            ) : null}
            <View style={{ width: '33.333%', padding: 5 }}>
              <PressableScale
                onPress={() => void add('library')}
                accessibilityRole="button"
                accessibilityLabel="Choose photos"
                className={cn(
                  'aspect-square items-center justify-center gap-1 rounded-2xl border-2 border-dashed bg-surface',
                  error ? 'border-danger-500' : 'border-line-strong',
                )}
              >
                <ImagePlus size={22} color={COLORS.brand[600]} />
                <Text className="font-body-semibold text-xs text-ink-600">Gallery</Text>
              </PressableScale>
            </View>
          </>
        ) : null}
      </View>
      {error ? (
        <Text className="font-body-medium text-sm text-danger-600">{error}</Text>
      ) : (
        <Text className="text-sm text-ink-500">
          {hint ?? `Add up to ${max} clear photos in daylight. They're resized on your phone.`}
        </Text>
      )}
    </View>
  );
}
