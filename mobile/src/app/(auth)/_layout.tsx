import { Stack } from 'expo-router';

import { COLORS } from '@/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
        contentStyle: { backgroundColor: COLORS.canvas },
      }}
    />
  );
}
