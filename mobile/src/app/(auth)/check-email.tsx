import { messageOf } from '@selit/shared';
import { router, useLocalSearchParams } from 'expo-router';
import { MailCheck } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { getApi } from '@/lib/api';
import { COLORS } from '@/theme';

export default function CheckEmailScreen() {
  const { email = '' } = useLocalSearchParams<{ email?: string }>();
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  async function resend() {
    setState('sending');
    setError('');
    try {
      await getApi().auth.resendConfirmation(email);
      setState('sent');
    } catch (resendError) {
      setError(messageOf(resendError));
      setState('idle');
    }
  }

  return (
    <AuthShell title="Check your email">
      <View className="items-center gap-4">
        <View className="size-16 items-center justify-center rounded-3xl bg-brand-50">
          <MailCheck size={30} color={COLORS.brand[600]} />
        </View>
        <Text className="text-center leading-6 text-ink-600">
          We sent a confirmation link{email ? ` to ${email}` : ''}. Tap it on this phone to activate
          your account, then sign in.
        </Text>
        <Text className="text-center text-sm text-ink-400">
          Can&apos;t find it? Check your spam or promotions folder.
        </Text>
        <Button size="lg" onPress={() => router.replace('/sign-in')}>
          Go to sign in
        </Button>
        {email ? (
          <Button
            variant="ghost"
            onPress={resend}
            isLoading={state === 'sending'}
            disabled={state === 'sent'}
          >
            {state === 'sent' ? 'Sent. Check your inbox' : 'Send the link again'}
          </Button>
        ) : null}
        {error ? <Text className="text-sm text-danger-600">{error}</Text> : null}
      </View>
    </AuthShell>
  );
}
