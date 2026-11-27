import { messageOf } from '@selit/shared';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Camera, ScanLine } from 'lucide-react-native';
import { useEffect } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { getApi } from '@/lib/api';
import { pickPhotos, type PickedPhoto } from '@/lib/photos';
import { COLORS } from '@/theme';

type CheckCodePanelProps = {
  photo: PickedPhoto | null;
  onPhoto: (photo: PickedPhoto) => void;
  onCheckId: (checkId: string) => void;
  error?: string;
};

/**
 * Shown to new sellers and for unusually cheap items. The seller writes the
 * code on paper beside the item and takes one photo; only reviewers see it.
 */
export function CheckCodePanel({ photo, onPhoto, onCheckId, error }: CheckCodePanelProps) {
  const check = useQuery({
    queryKey: ['listing-check-code'],
    queryFn: () => getApi().listings.requestCheckCode(),
    staleTime: 25 * 60_000,
    retry: false,
  });

  useEffect(() => {
    if (check.data) onCheckId(check.data.id);
  }, [check.data, onCheckId]);

  async function takePhoto() {
    const [picked] = await pickPhotos('camera', 1);
    if (picked) onPhoto(picked);
  }

  return (
    <View className="gap-4 rounded-3xl border border-amber-300/60 bg-amber-50 p-5">
      <View className="flex-row items-center gap-2">
        <ScanLine size={20} color={COLORS.amber[700]} />
        <Text className="font-display text-lg text-ink-900">Quick item check</Text>
      </View>
      <Text className="text-sm leading-5 text-ink-700">
        Write this code on a piece of paper, place it next to the item, and take one photo. Only our
        reviewers see it.
      </Text>
      {check.isPending ? (
        <Skeleton height={64} radius={18} />
      ) : check.isError ? (
        <Text className="text-sm text-danger-600">{messageOf(check.error)}</Text>
      ) : (
        <View className="items-center rounded-2xl bg-surface py-4">
          <Text className="font-display-bold text-4xl tracking-[6px] text-ink-900">
            {check.data.code}
          </Text>
          <Text className="mt-1 text-xs text-ink-500">
            Valid until{' '}
            {new Date(check.data.expiresAt).toLocaleTimeString('en-NG', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Text>
        </View>
      )}
      {photo ? (
        <View className="flex-row items-center gap-3">
          <Image
            source={{ uri: photo.uri }}
            style={{ width: 64, height: 64, borderRadius: 16 }}
            contentFit="cover"
          />
          <Text className="flex-1 text-sm text-ink-700">Check photo added.</Text>
          <Button size="sm" variant="secondary" onPress={() => void takePhoto()}>
            Retake
          </Button>
        </View>
      ) : (
        <Button
          variant="dark"
          icon={<Camera size={18} color="#fff" />}
          onPress={() => void takePhoto()}
          disabled={!check.data}
        >
          Take the check photo
        </Button>
      )}
      {error ? <Text className="font-body-medium text-sm text-danger-600">{error}</Text> : null}
    </View>
  );
}
