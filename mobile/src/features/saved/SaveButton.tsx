import { Heart } from 'lucide-react-native';

import { IconButton } from '@/components/ui/IconButton';
import { COLORS } from '@/theme';

import { useIsSaved, useSavedStore } from './saved-store';

export function SaveButton({
  listingId,
  tone = 'glass',
}: {
  listingId: string;
  tone?: 'glass' | 'surface';
}) {
  const isSaved = useIsSaved(listingId);
  const toggle = useSavedStore((state) => state.toggle);
  return (
    <IconButton
      tone={tone}
      accessibilityLabel={isSaved ? 'Remove from saved' : 'Save'}
      onPress={() => toggle(listingId)}
      className="size-10 rounded-full"
      icon={
        <Heart
          size={18}
          color={isSaved ? COLORS.danger[500] : COLORS.ink[700]}
          fill={isSaved ? COLORS.danger[500] : 'transparent'}
        />
      }
    />
  );
}
