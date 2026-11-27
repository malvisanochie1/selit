import '../global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { isSampleMode } from '@/config/env';
import { AppLock } from '@/features/auth/components/AppLock';
import { useSessionStore } from '@/features/auth/session-store';
import { queryClient } from '@/lib/query-client';
import { getSupabase } from '@/lib/supabase';
import { COLORS } from '@/theme';
import { FONTS } from '@/theme/fonts';

void SplashScreen.preventAutoHideAsync();

function useSessionBootstrap() {
  const refresh = useSessionStore((state) => state.refresh);
  const setUser = useSessionStore((state) => state.setUser);

  useEffect(() => {
    void refresh();
    if (isSampleMode) return;
    const { data } = getSupabase().auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') setUser(null);
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') void refresh();
    });
    return () => data.subscription.unsubscribe();
  }, [refresh, setUser]);
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(FONTS);
  useSessionBootstrap();

  useEffect(() => {
    if (fontsLoaded || fontError) void SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <View style={{ flex: 1 }} collapsable={false}>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: COLORS.canvas },
              }}
            />
            <AppLock />
          </View>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
