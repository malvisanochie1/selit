import { Tabs } from 'expo-router';

import { TabBar } from '@/components/layout/TabBar';
import { COLORS } from '@/theme';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, lazy: false, sceneStyle: { backgroundColor: COLORS.canvas } }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="browse" />
      <Tabs.Screen name="sell" />
      <Tabs.Screen name="apartments" />
      <Tabs.Screen name="account" />
    </Tabs>
  );
}
