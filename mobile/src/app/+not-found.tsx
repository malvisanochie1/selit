import { router } from 'expo-router';
import { Compass } from 'lucide-react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { COLORS } from '@/theme';

export default function NotFoundScreen() {
  return (
    <Screen>
      <EmptyState
        className="mt-20"
        icon={<Compass size={26} color={COLORS.brand[700]} />}
        title="This page wandered off"
        description="The link may be old, or the listing was removed."
        action={<Button onPress={() => router.replace('/')}>Go home</Button>}
      />
    </Screen>
  );
}
