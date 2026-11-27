import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Logo } from '@/components/layout/Logo';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Appear } from '@/components/motion/Appear';
import { Heading, Text } from '@/components/ui/Text';

/** The calm, centred frame shared by every sign-in screen. */
export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Screen header={<ScreenHeader />} maxWidth={480}>
      <Appear>
        <View className="mt-2">
          <Logo size={36} />
          <Heading className="mt-8 text-[32px] leading-10">{title}</Heading>
          {description ? <Text className="mt-2 leading-6 text-ink-500">{description}</Text> : null}
        </View>
      </Appear>
      <Appear index={1} className="mt-8">
        {children}
      </Appear>
    </Screen>
  );
}
