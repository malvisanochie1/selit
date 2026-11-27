import { APARTMENT_SAFETY_TIPS, ITEM_SAFETY_TIPS } from '@selit/shared';
import { ShieldCheck } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { COLORS } from '@/theme';

export function SafetyTips({ variant = 'item' }: { variant?: 'item' | 'apartment' }) {
  const tips = variant === 'apartment' ? APARTMENT_SAFETY_TIPS : ITEM_SAFETY_TIPS;
  return (
    <View className="rounded-3xl border border-amber-300/50 bg-amber-50/70 p-5">
      <View className="flex-row items-center gap-2">
        <ShieldCheck size={20} color={COLORS.amber[700]} />
        <Text className="font-display text-lg text-ink-900">Stay safe</Text>
      </View>
      <View className="mt-3 gap-2.5">
        {tips.map((tip) => (
          <View key={tip} className="flex-row gap-2.5">
            <View className="mt-2 size-1.5 rounded-full bg-amber-600" />
            <Text className="flex-1 text-sm leading-5 text-ink-700">{tip}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
