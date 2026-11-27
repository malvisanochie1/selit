import { messageOf, passwordResetSchema } from '@selit/shared';
import { router } from 'expo-router';
import { Mail, MailCheck } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { getApi } from '@/lib/api';
import { COLORS } from '@/theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  async function send() {
    const parsed = passwordResetSchema.safeParse({ email });
    if (!parsed.success) return setError('Enter a valid email address.');
    setState('sending');
    setError('');
    try {
      await getApi().auth.requestPasswordReset(parsed.data.email);
      setState('sent');
    } catch (sendError) {
      setError(messageOf(sendError));
      setState('idle');
    }
  }

  if (state === 'sent') {
    return (
      <AuthShell title="Check your email">
        <View className="items-center gap-4">
          <View className="size-16 items-center justify-center rounded-3xl bg-brand-50">
            <MailCheck size={30} color={COLORS.brand[600]} />
          </View>
          <Text className="text-center leading-6 text-ink-600">
            If an account exists for {email}, a reset link is on its way. Open it on this phone. It
            expires in one hour.
          </Text>
          <Button variant="secondary" onPress={() => router.replace('/sign-in')}>
            Back to sign in
          </Button>
        </View>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset your password"
      description="We'll email you a link to choose a new one."
    >
      <View className="gap-5">
        {error ? <Notice tone="danger">{error}</Notice> : null}
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          leadingIcon={<Mail size={18} color={COLORS.ink[400]} />}
          onSubmitEditing={send}
        />
        <Button size="lg" onPress={send} isLoading={state === 'sending'}>
          Send reset link
        </Button>
      </View>
    </AuthShell>
  );
}
