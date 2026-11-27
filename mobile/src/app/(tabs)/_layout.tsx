import { router, Tabs } from 'expo-router';
import { useEffect } from 'react';

import { TabBar } from '@/components/layout/TabBar';
import { useOnboardingStore } from '@/features/onboarding/onboarding-store';
import { COLORS } from '@/theme';

export default function TabsLayout() {
  const isHydrated = useOnboardingStore((state) => state.isHydrated);
  const hasSeenOnboarding = useOnboardingStore((state) => state.hasSeenOnboarding);

  // First launch shows the short welcome carousel.
  useEffect(() => {
    if (isHydrated && !hasSeenOnboarding) router.replace('/onboarding');
  }, [isHydrated, hasSeenOnboarding]);

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        lazy: false,
        sceneStyle: { backgroundColor: COLORS.canvas },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="browse" />
      <Tabs.Screen name="sell" />
      <Tabs.Screen name="apartments" />
      <Tabs.Screen name="account" />
    </Tabs>
  );
}
