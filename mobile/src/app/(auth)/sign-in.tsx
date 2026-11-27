import { fieldErrorsOf, messageOf, signInSchema } from '@selit/shared';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { isSampleMode } from '@/config/env';
import { biometricOwner, readBiometricCredentials } from '@/features/auth/biometric';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { useSessionStore } from '@/features/auth/session-store';
import { PasswordField } from '@/features/auth/components/PasswordField';
import { useSignIn } from '@/features/auth/use-auth';
import { getSupabase } from '@/lib/supabase';
import { COLORS } from '@/theme';

export default function SignInScreen() {
  const signIn = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fingerprintEmail, setFingerprintEmail] = useState<string | null>(null);

  const { code } = useLocalSearchParams<{ code?: string }>();
  const refresh = useSessionStore((state) => state.refresh);
  const [linkState, setLinkState] = useState<'none' | 'confirming' | 'expired'>(
    code && !isSampleMode ? 'confirming' : 'none',
  );

  useEffect(() => {
    void biometricOwner().then(setFingerprintEmail);
  }, []);

  // The confirmation email opens the app here with a one-time code.
  useEffect(() => {
    if (!code || isSampleMode) return;
    void getSupabase()
      .auth.exchangeCodeForSession(code)
      .then(async ({ error }) => {
        if (error) return setLinkState('expired');
        await refresh();
        router.replace('/');
      });
  }, [code, refresh]);

  function finish() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  function submit() {
    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) return setErrors(fieldErrorsOf(parsed.error));
    setErrors({});
    signIn.mutate(parsed.data, { onSuccess: finish });
  }

  async function signInWithFingerprint() {
    const credentials = await readBiometricCredentials();
    if (credentials) signIn.mutate(credentials, { onSuccess: finish });
  }

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to contact sellers, list your things and keep your saved items."
    >
      <View className="gap-5">
        {isSampleMode ? (
          <Notice title="Demo mode">
            Any email and password works. Use an email starting with “admin” to see the admin area.
          </Notice>
        ) : null}
        {linkState === 'confirming' ? <Notice title="Confirming your email…" /> : null}
        {linkState === 'expired' ? (
          <Notice tone="warning" title="That link has expired">
            Sign in below. If your email isn&apos;t confirmed yet, we&apos;ll send a new link.
          </Notice>
        ) : null}
        {signIn.isError ? <Notice tone="danger">{messageOf(signIn.error)}</Notice> : null}
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          error={errors.email}
          leadingIcon={<Mail size={18} color={COLORS.ink[400]} />}
        />
        <View className="gap-2">
          <PasswordField
            label="Password"
            value={password}
            onChangeText={setPassword}
            autoComplete="current-password"
            textContentType="password"
            error={errors.password}
            onSubmitEditing={submit}
            onFingerprint={fingerprintEmail ? () => void signInWithFingerprint() : undefined}
          />
          <Link
            href="/forgot-password"
            className="self-start font-body-semibold text-sm text-brand-700"
          >
            Forgot password?
          </Link>
        </View>
        <Button size="lg" onPress={submit} isLoading={signIn.isPending}>
          Sign in
        </Button>
        <Text className="text-center text-sm text-ink-500">
          New to Selit?{' '}
          <Link href="/sign-up" replace className="font-body-semibold text-brand-700">
            Create an account
          </Link>
        </Text>
      </View>
    </AuthShell>
  );
}
