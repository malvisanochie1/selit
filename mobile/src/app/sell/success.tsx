import { router, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, Clock } from 'lucide-react-native';
import { View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Appear } from '@/components/motion/Appear';
import { Button } from '@/components/ui/Button';
import { Heading, Text } from '@/components/ui/Text';
import { COLORS } from '@/theme';

export default function SellSuccessScreen() {
  const { id, status, kind } = useLocalSearchParams<{
    id: string;
    status?: string;
    kind?: 'apartment';
  }>();
  const isPending = status === 'pending';
  const isApartment = kind === 'apartment';

  return (
    <Screen maxWidth={520}>
      <Appear className="mt-16 items-center">
        <View
          className={
            isPending
              ? 'size-20 items-center justify-center rounded-[28px] bg-amber-50'
              : 'size-20 items-center justify-center rounded-[28px] bg-brand-50'
          }
        >
          {isPending ? (
            <Clock size={38} color={COLORS.amber[600]} />
          ) : (
            <CheckCircle2 size={38} color={COLORS.brand[600]} />
          )}
        </View>
        <Heading className="mt-6 text-center text-3xl">
          {isPending ? 'Almost live' : 'Your listing is live'}
        </Heading>
        <Text className="mt-3 text-center leading-6 text-ink-500">
          {isPending
            ? 'Our team takes a quick look first, usually within a few hours. You can see its status under My listings.'
            : 'Students nearby can now find it. Keep your phone close; replies come on WhatsApp.'}
        </Text>
        <View className="mt-8 w-full gap-3">
          <Button
            size="lg"
            onPress={() => router.replace(isApartment ? `/apartment/${id}` : `/listing/${id}`)}
          >
            View listing
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onPress={() => router.replace(isApartment ? '/my/apartments' : '/my/listings')}
          >
            {isApartment ? 'My apartments' : 'My listings'}
          </Button>
        </View>
      </Appear>
    </Screen>
  );
}
