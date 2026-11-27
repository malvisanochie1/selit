import { messageOf } from '@selit/shared';
import * as Application from 'expo-application';
import * as Updates from 'expo-updates';
import { Fingerprint, KeyRound, Lock, Mail, Trash2 } from 'lucide-react-native';
import { useEffect, useState, type ReactNode } from 'react';
import { Linking, Platform, Switch, View } from 'react-native';

import { PageTitle } from '@/components/layout/PageTitle';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { env } from '@/config/env';
import {
  canUseBiometrics,
  disableBiometricSignIn,
  enableBiometricSignIn,
} from '@/features/auth/biometric';
import { PasswordField } from '@/features/auth/components/PasswordField';
import { useLockStore } from '@/features/auth/lock-store';
import { useSession } from '@/features/auth/session-store';
import { getApi } from '@/lib/api';
import { COLORS, SHADOW } from '@/theme';

function Row({
  icon,
  title,
  description,
  action,
  isFirst = false,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action: ReactNode;
  isFirst?: boolean;
}) {
  return (
    <View
      className={
        isFirst
          ? 'flex-row items-center gap-3 p-4'
          : 'flex-row items-center gap-3 border-t border-line p-4'
      }
    >
      <View className="size-10 items-center justify-center rounded-xl bg-canvas">{icon}</View>
      <View className="flex-1">
        <Text className="font-body-semibold text-ink-900">{title}</Text>
        <Text className="text-sm leading-5 text-ink-500">{description}</Text>
      </View>
      {action}
    </View>
  );
}

export default function SettingsScreen() {
  const { user } = useSession();
  const biometricEnabled = useLockStore((state) => state.biometricEnabled);
  const setBiometricEnabled = useLockStore((state) => state.setBiometricEnabled);
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void canUseBiometrics().then(setHasBiometrics);
  }, []);

  if (!user) return null;
  const mail = (subject: string) =>
    `mailto:${env.supportEmail}?subject=${encodeURIComponent(subject)}`;

  // Turning fingerprint on checks the password first, then stores it behind the fingerprint.
  async function confirmPassword() {
    if (!user) return;
    setIsSaving(true);
    setError('');
    try {
      await getApi().auth.signIn({ email: user.email, password });
      await enableBiometricSignIn({ email: user.email, password });
      setBiometricEnabled(true);
      setIsPasswordOpen(false);
      setPassword('');
    } catch (enableError) {
      setError(messageOf(enableError));
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleBiometrics(next: boolean) {
    if (next) return setIsPasswordOpen(true);
    await disableBiometricSignIn();
    setBiometricEnabled(false);
  }

  return (
    <Screen header={<ScreenHeader />} maxWidth={640}>
      <PageTitle title="Settings and security" />
      <View style={SHADOW.card} className="overflow-hidden rounded-3xl bg-surface">
        {Platform.OS !== 'web' ? (
          <Row
            isFirst
            icon={<Fingerprint size={20} color={COLORS.brand[700]} />}
            title="Fingerprint sign-in"
            description={
              hasBiometrics
                ? 'Sign in and unlock with your fingerprint. Your password still works.'
                : 'Set up a fingerprint or face on this phone first.'
            }
            action={
              <Switch
                value={biometricEnabled}
                disabled={!hasBiometrics}
                onValueChange={(next) => void toggleBiometrics(next)}
                trackColor={{ true: COLORS.brand[500], false: COLORS.ink[200] }}
                thumbColor="#fff"
              />
            }
          />
        ) : null}
        <Row
          isFirst={Platform.OS === 'web'}
          icon={<Lock size={20} color={COLORS.ink[700]} />}
          title="Auto-lock"
          description="Selit locks itself after 5 minutes in the background."
          action={null}
        />
        <Row
          icon={<KeyRound size={20} color={COLORS.ink[700]} />}
          title="Password"
          description="We'll email you a link to choose a new one."
          action={
            <Button
              size="sm"
              variant="secondary"
              onPress={() => void getApi().auth.requestPasswordReset(user.email)}
            >
              Send link
            </Button>
          }
        />
      </View>

      <Text className="mb-2 mt-8 px-1 font-body-bold text-xs uppercase tracking-widest text-ink-400">
        Your data
      </Text>
      <View style={SHADOW.card} className="overflow-hidden rounded-3xl bg-surface">
        <Row
          isFirst
          icon={<Mail size={20} color={COLORS.ink[700]} />}
          title="Get a copy of your data"
          description="We send everything we hold about you within 7 days."
          action={
            <Button
              size="sm"
              variant="secondary"
              onPress={() => void Linking.openURL(mail('Data request'))}
            >
              Ask
            </Button>
          }
        />
        <Row
          icon={<Trash2 size={20} color={COLORS.danger[600]} />}
          title="Delete my account"
          description="Removes your account and listings within 7 days."
          action={
            <Button
              size="sm"
              variant="secondary"
              onPress={() => void Linking.openURL(mail('Delete my account'))}
            >
              Request
            </Button>
          }
        />
      </View>

      <Text className="mt-8 text-center text-xs text-ink-400">
        Selit {Application.nativeApplicationVersion ?? ''}
        {Updates.updateId ? ` · update ${Updates.updateId.slice(0, 8)}` : ''}
      </Text>

      <Sheet
        open={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
        title="Confirm your password"
        description="Then confirm with your fingerprint to switch it on."
        footer={
          <View className="flex-1">
            <Button
              onPress={() => void confirmPassword()}
              isLoading={isSaving}
              disabled={!password}
            >
              Switch on
            </Button>
          </View>
        }
      >
        <View className="gap-4">
          <PasswordField value={password} onChangeText={setPassword} placeholder="Your password" />
          {error ? <Notice tone="danger">{error}</Notice> : null}
        </View>
      </Sheet>
    </Screen>
  );
}
