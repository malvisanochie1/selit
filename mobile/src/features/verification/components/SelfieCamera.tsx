import { CameraView, useCameraPermissions } from 'expo-camera';
import { Camera } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import type { PickedPhoto } from '@/lib/photos';
import { COLORS } from '@/theme';

const PROMPTS = ['Look straight at the camera', 'Turn your head slightly left', 'Now smile'];

/**
 * A live selfie in three quick frames, taken with the front camera only. The
 * gallery is never offered here, so an old photo can't be used.
 */
export function SelfieCamera({ onDone }: { onDone: (frames: PickedPhoto[]) => void }) {
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);
  const [frames, setFrames] = useState<PickedPhoto[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);

  if (!permission?.granted) {
    return (
      <View className="items-center gap-4 rounded-3xl bg-surface p-6">
        <View className="size-14 items-center justify-center rounded-2xl bg-brand-50">
          <Camera size={26} color={COLORS.brand[700]} />
        </View>
        <Text className="text-center leading-6 text-ink-600">
          Selit needs the front camera for a live selfie. The photos are only seen by our reviewers
          and deleted after.
        </Text>
        <Button onPress={() => void requestPermission()}>Allow camera</Button>
      </View>
    );
  }

  async function capture() {
    if (!camera.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const picture = await camera.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });
      const next = [...frames, { uri: picture.uri, width: picture.width, height: picture.height }];
      setFrames(next);
      if (next.length === PROMPTS.length) onDone(next);
    } finally {
      setIsCapturing(false);
    }
  }

  return (
    <View className="gap-4">
      <View className="aspect-[3/4] w-full overflow-hidden rounded-[32px] bg-ink-900">
        <CameraView ref={camera} facing="front" style={{ flex: 1 }} mirror />
        <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
          <View
            style={{ width: '62%', aspectRatio: 0.78 }}
            className="rounded-[999px] border-4 border-white/80"
          />
        </View>
        <View className="absolute bottom-4 w-full items-center">
          <View className="rounded-full bg-ink-900/75 px-4 py-2">
            <Text className="font-body-semibold text-sm text-white">
              {PROMPTS[Math.min(frames.length, PROMPTS.length - 1)]}
            </Text>
          </View>
        </View>
      </View>
      <View className="flex-row justify-center gap-2">
        {PROMPTS.map((prompt, index) => (
          <View
            key={prompt}
            className={
              index < frames.length
                ? 'h-2 w-8 rounded-full bg-brand-500'
                : 'h-2 w-8 rounded-full bg-ink-200'
            }
          />
        ))}
      </View>
      <Button
        size="lg"
        onPress={() => void capture()}
        isLoading={isCapturing}
        icon={<Camera size={18} color="#fff" />}
      >
        {`Take photo ${Math.min(frames.length + 1, PROMPTS.length)} of ${PROMPTS.length}`}
      </Button>
    </View>
  );
}
