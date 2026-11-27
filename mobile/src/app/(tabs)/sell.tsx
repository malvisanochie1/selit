import { router } from 'expo-router';
import { Building2, ChevronRight, Package, ShieldCheck } from 'lucide-react-native';
import { View } from 'react-native';

import { PageTitle } from '@/components/layout/PageTitle';
import { Screen } from '@/components/layout/Screen';
import { Appear } from '@/components/motion/Appear';
import { PressableScale } from '@/components/motion/PressableScale';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { Text } from '@/components/ui/Text';
import { useSession } from '@/features/auth/session-store';
import { COLORS, SHADOW } from '@/theme';

const OPTIONS = [
  {
    href: '/sell/item' as const,
    icon: Package,
    title: 'Sell an item',
    text: 'Hostel items, furniture, phones, books. Free, and live in about two minutes.',
  },
  {
    href: '/sell/apartment' as const,
    icon: Building2,
    title: 'List a room',
    text: 'For ID-verified agents and landlords. Students see the rent upfront.',
  },
];

export default function SellScreen() {
  const { isSignedIn } = useSession();
  return (
    <Screen>
      <PageTitle title="What are you listing?" description="Listing is free. Buyers reach you on WhatsApp or by phone." />
      {!isSignedIn ? (
        <Notice
          title="Sign in to list"
          className="mb-5"
          action={
            <Button size="sm" onPress={() => router.push('/sign-in')}>
              Sign in or create an account
            </Button>
          }
        >
          Every listing belongs to a real member, so buyers know who they are meeting.
        </Notice>
      ) : null}
      <View className="gap-4">
        {OPTIONS.map((option, index) => (
          <Appear key={option.href} index={index}>
            <PressableScale
              onPress={() => router.push(isSignedIn ? option.href : '/sign-in')}
              accessibilityRole="link"
              accessibilityLabel={option.title}
              innerStyle={SHADOW.card}
              className="flex-row items-center gap-4 rounded-3xl bg-surface p-5"
              scaleTo={0.98}
            >
              <View className="size-14 items-center justify-center rounded-2xl bg-brand-50">
                <option.icon size={26} color={COLORS.brand[700]} />
              </View>
              <View className="flex-1">
                <Text className="font-display text-xl text-ink-900">{option.title}</Text>
                <Text className="mt-1 text-sm leading-5 text-ink-500">{option.text}</Text>
              </View>
              <ChevronRight size={20} color={COLORS.ink[400]} />
            </PressableScale>
          </Appear>
        ))}
      </View>
      <View className="mt-6 flex-row items-start gap-3 rounded-3xl bg-brand-50 p-5">
        <ShieldCheck size={20} color={COLORS.brand[700]} />
        <Text className="flex-1 text-sm leading-5 text-brand-800">
          New sellers and unusually cheap items get a quick check before going live. It keeps bait listings off Selit.
        </Text>
      </View>
    </Screen>
  );
}
