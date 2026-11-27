import { messageOf, PASSWORD_RULES } from '@selit/shared';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { Text } from '@/components/ui/Text';
import { isSampleMode } from '@/config/env';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { PasswordField } from '@/features/auth/components/PasswordField';
import { PasswordStrength } from '@/features/auth/components/PasswordStrength';
import { useSessionStore } from '@/features/auth/session-store';
import { getApi } from '@/lib/api';
import { getSupabase } from '@/lib/supabase';
import { COLORS } from '@/theme';

/** The reset email opens this screen; its one-time code starts a session first. */
function useRecoverySession() {
  const url = Linking.useLinkingURL();
  const [state, setState] = useState<'checking' | 'ready' | 'expired'>(
    isSampleMode ? 'ready' : 'checking',
  );

  useEffect(() => {
    if (isSampleMode) return;
    const code = url ? Linking.parse(url).queryParams?.code : undefined;
    if (typeof code !== 'string') {
      void getSupabase()
        .auth.getSession()
        .then(({ data }) => setState(data.session ? 'ready' : 'expired'));
      return;
    }
    void getSupabase()
      .auth.exchangeCodeForSession(code)
      .then(({ error }) => setState(error ? 'expired' : 'ready'));
  }, [url]);

  return state;
}

export default function ResetPasswordScreen() {
  const session = useRecoverySession();
  const refresh = useSessionStore((state) => state.refresh);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [state, setState] = useState<'idle' | 'saving' | 'done'>('idle');

  async function save() {
    const parsed = PASSWORD_RULES.safeParse(password);
    if (!parsed.success)
      return setError(parsed.error.issues[0]?.message ?? 'Choose a stronger password.');
    setState('saving');
    setError('');
    try {
      await getApi().auth.updatePassword(password);
      await refresh();
      setState('done');
    } catch (saveError) {
      setError(messageOf(saveError));
      setState('idle');
    }
  }

  if (state === 'done') {
    return (
      <AuthShell title="Password changed">
        <View className="items-center gap-4">
          <CheckCircle2 size={48} color={COLORS.brand[500]} />
          <Text className="text-center text-ink-600">
            You&apos;re signed in with your new password.
          </Text>
          <Button size="lg" onPress={() => router.replace('/')}>
            Continue
          </Button>
        </View>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Choose a new password"
      description="Make it something you don't use anywhere else."
    >
      {session === 'expired' ? (
        <Notice
          tone="danger"
          title="This reset link has expired"
          action={
            <Button size="sm" onPress={() => router.replace('/forgot-password')}>
              Request a new link
            </Button>
          }
        >
          Links work once and for one hour.
        </Notice>
      ) : (
        <View className="gap-5">
          {error ? <Notice tone="danger">{error}</Notice> : null}
          <View className="gap-2">
            <PasswordField
              label="New password"
              value={password}
              onChangeText={setPassword}
              autoComplete="new-password"
            />
            <PasswordStrength password={password} />
          </View>
          <Button size="lg" onPress={save} isLoading={state === 'saving' || session === 'checking'}>
            Save password
          </Button>
        </View>
      )}
    </AuthShell>
  );
}
