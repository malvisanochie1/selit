import { helpQuestions } from '@selit/shared';
import { ChevronDown, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';

import { PageTitle } from '@/components/layout/PageTitle';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { env } from '@/config/env';
import { COLORS, SHADOW } from '@/theme';

export default function HelpScreen() {
  const [open, setOpen] = useState<number | null>(0);
  const questions = helpQuestions(env.supportEmail);

  return (
    <Screen header={<ScreenHeader />}>
      <PageTitle
        title="How can we help?"
        description="Quick answers to the questions students ask most."
      />
      <View style={SHADOW.card} className="overflow-hidden rounded-3xl bg-surface">
        {questions.map((item, index) => {
          const isOpen = open === index;
          return (
            <View key={item.question} className={index ? 'border-t border-line' : undefined}>
              <Pressable
                onPress={() => setOpen(isOpen ? null : index)}
                accessibilityRole="button"
                accessibilityState={{ expanded: isOpen }}
                className="flex-row items-center gap-3 px-5 py-4"
              >
                <Text className="flex-1 font-body-semibold text-ink-900">{item.question}</Text>
                <View style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}>
                  <ChevronDown size={18} color={COLORS.ink[400]} />
                </View>
              </Pressable>
              {isOpen ? (
                <Text className="px-5 pb-5 leading-6 text-ink-600">{item.answer}</Text>
              ) : null}
            </View>
          );
        })}
      </View>
      <View className="mt-8 rounded-3xl border border-line bg-surface p-6">
        <Text className="font-display text-lg text-ink-900">Still stuck?</Text>
        <Text className="mt-1 text-sm leading-5 text-ink-500">
          Email us and a real person replies, usually the same day.
        </Text>
        <Button
          className="mt-4"
          variant="dark"
          icon={<Mail size={16} color="#fff" />}
          onPress={() => void Linking.openURL(`mailto:${env.supportEmail}`)}
        >
          {env.supportEmail}
        </Button>
      </View>
    </Screen>
  );
}
