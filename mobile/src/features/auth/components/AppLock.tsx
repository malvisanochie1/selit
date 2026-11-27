import { messageOf } from '@selit/shared';
import { Fingerprint, Lock } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Platform, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/Button';
import { Heading, Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { getApi } from '@/lib/api';
import { COLORS, EASE_OUT } from '@/theme';

import { confirmWithBiometrics } from '../biometric';
import { LOCK_AFTER_MS, useLockStore } from '../lock-store';
import { useSession } from '../session-store';
import { useSignOut } from '../use-auth';

/**
 * Covers the app after five minutes in the background. Mounted once at the
 * root and kept mounted; it only fades in and out.
 */
export function AppLock() {
  const { user, isSignedIn } = useSession();
  const { isLocked, biometricEnabled, lock, unlock, markBackgrounded } = useLockStore();
  const signOut = useSignOut();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const visible = useSharedValue(0);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const subscription = AppState.addEventListener('change', (state) => {
      const { backgroundedAt } = useLockStore.getState();
      if (state === 'background') markBackgrounded();
      if (state === 'active' && backgroundedAt && Date.now() - backgroundedAt > LOCK_AFTER_MS) {
        lock();
      }
    });
    return () => subscription.remove();
  }, [lock, markBackgrounded]);

  const shouldShow = isLocked && isSignedIn;

  useEffect(() => {
    visible.value = withTiming(shouldShow ? 1 : 0, { duration: 500, easing: EASE_OUT });
  }, [shouldShow, visible]);

  const tryBiometrics = useCallback(async () => {
    if (await confirmWithBiometrics('Unlock Selit')) unlock();
  }, [unlock]);

  useEffect(() => {
    if (shouldShow && biometricEnabled) void tryBiometrics();
  }, [shouldShow, biometricEnabled, tryBiometrics]);

  const style = useAnimatedStyle(() => ({ opacity: visible.value }));

  async function unlockWithPassword() {
    if (!user) return;
    setIsChecking(true);
    setError('');
    try {
      await getApi().auth.signIn({ email: user.email, password });
      setPassword('');
      unlock();
    } catch (unlockError) {
      setError(messageOf(unlockError));
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <Animated.View
      pointerEvents={shouldShow ? 'auto' : 'none'}
      collapsable={false}
      style={[
        { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 60, elevation: 60 },
        style,
      ]}
    >
      <View className="flex-1 items-center justify-center bg-canvas px-[8%]">
        <View style={{ width: '100%', maxWidth: 420 }} className="items-center">
          <Logo size={40} />
          <View className="mt-10 size-16 items-center justify-center rounded-3xl bg-brand-50">
            <Lock size={28} color={COLORS.brand[700]} />
          </View>
          <Heading className="mt-5 text-center text-2xl">
            Welcome back{user ? `, ${user.fullName.split(' ')[0]}` : ''}
          </Heading>
          <Text className="mt-2 text-center text-sm text-ink-500">
            Selit locked itself while you were away.
          </Text>
          <View className="mt-8 w-full gap-3">
            <TextField
              placeholder="Your password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              value={password}
              onChangeText={setPassword}
              error={error}
              onSubmitEditing={unlockWithPassword}
              trailing={
                biometricEnabled ? (
                  <Fingerprint
                    size={22}
                    color={COLORS.brand[600]}
                    onPress={() => void tryBiometrics()}
                    accessibilityLabel="Unlock with fingerprint"
                  />
                ) : undefined
              }
            />
            <Button
              size="lg"
              onPress={unlockWithPassword}
              isLoading={isChecking}
              disabled={!password}
            >
              Unlock
            </Button>
            <Button
              variant="ghost"
              onPress={() => {
                unlock();
                signOut.mutate();
              }}
            >
              Sign out instead
            </Button>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
