import { SAFETY_PROTECTIONS, SAFETY_RULES } from '@selit/shared';
import {
  Ban,
  BadgeCheck,
  Building2,
  Flag,
  Handshake,
  MapPinned,
  ShieldAlert,
  Users,
} from 'lucide-react-native';
import { Linking, View } from 'react-native';

import { PageTitle } from '@/components/layout/PageTitle';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Appear } from '@/components/motion/Appear';
import { Button } from '@/components/ui/Button';
import { Heading, Text } from '@/components/ui/Text';
import { env } from '@/config/env';
import { COLORS } from '@/theme';

const RULE_ICONS = [MapPinned, Ban, Handshake, Users];
const PROTECTION_ICONS = [BadgeCheck, ShieldAlert, Building2, Flag];

export default function SafetyScreen() {
  return (
    <Screen header={<ScreenHeader />}>
      <PageTitle
        title="Safety guide"
        description="How to buy, sell and find a room safely. Read it once; it could save you."
      />
      <View className="gap-3">
        {SAFETY_RULES.map((rule, index) => {
          const Icon = RULE_ICONS[index];
          return (
            <Appear key={rule.title} index={index}>
              <View className="flex-row gap-4 rounded-3xl border border-line bg-surface p-5">
                <View className="size-11 items-center justify-center rounded-2xl bg-amber-50">
                  <Icon size={20} color={COLORS.amber[700]} />
                </View>
                <View className="flex-1">
                  <Text className="font-display text-lg text-ink-900">{rule.title}</Text>
                  <Text className="mt-1 text-sm leading-5 text-ink-600">{rule.text}</Text>
                </View>
              </View>
            </Appear>
          );
        })}
      </View>
      <Heading className="mb-4 mt-10 text-2xl">What Selit does</Heading>
      <View className="gap-3">
        {SAFETY_PROTECTIONS.map((item, index) => {
          const Icon = PROTECTION_ICONS[index];
          return (
            <View key={item.title} className="flex-row gap-4 rounded-3xl bg-brand-50 p-5">
              <Icon size={20} color={COLORS.brand[700]} />
              <View className="flex-1">
                <Text className="font-body-semibold text-ink-900">{item.title}</Text>
                <Text className="mt-1 text-sm leading-5 text-ink-600">{item.text}</Text>
              </View>
            </View>
          );
        })}
      </View>
      <View className="mt-10 rounded-3xl bg-ink-900 p-6">
        <Heading className="text-xl text-white">In danger right now?</Heading>
        <Text className="mt-2 leading-6 text-ink-300">
          Leave, go somewhere busy and call the police on 112. Then report the person on Selit so we
          can ban them.
        </Text>
        <View className="mt-5 flex-row gap-3">
          <View className="flex-1">
            <Button variant="danger" onPress={() => void Linking.openURL('tel:112')}>
              Call 112
            </Button>
          </View>
          <View className="flex-1">
            <Button
              variant="secondary"
              onPress={() => void Linking.openURL(`mailto:${env.supportEmail}?subject=Safety`)}
            >
              Email us
            </Button>
          </View>
        </View>
      </View>
    </Screen>
  );
}
