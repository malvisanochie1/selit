import { messageOf, REPORT_REASONS, type ReportReason, type ReportTarget } from '@selit/shared';
import { router } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { Sheet } from '@/components/ui/Sheet';
import { Heading, Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { useSession } from '@/features/auth/session-store';
import { getApi } from '@/lib/api';
import { cn } from '@/lib/cn';
import { COLORS } from '@/theme';

type ReportSheetProps = {
  open: boolean;
  onClose: () => void;
  targetType: ReportTarget;
  targetId: string;
  targetLabel: string;
};

export function ReportSheet({ open, onClose, targetType, targetId, targetLabel }: ReportSheetProps) {
  const { isSignedIn } = useSession();
  const [reason, setReason] = useState<ReportReason | ''>('');
  const [details, setDetails] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  function close() {
    onClose();
    setTimeout(() => {
      setState('idle');
      setReason('');
      setDetails('');
      setError('');
    }, 400);
  }

  async function send() {
    if (!isSignedIn) {
      close();
      router.push('/sign-in');
      return;
    }
    if (!reason) return setError('Choose what is wrong so we can act quickly.');
    setState('sending');
    setError('');
    try {
      await getApi().reports.submit({ targetType, targetId, reason, details: details.trim() });
      setState('sent');
    } catch (sendError) {
      setError(messageOf(sendError));
      setState('idle');
    }
  }

  return (
    <Sheet
      open={open}
      onClose={close}
      title={state === 'sent' ? 'Thanks for telling us' : `Report ${targetType === 'user' ? 'this member' : `this ${targetType}`}`}
      description={state === 'sent' ? undefined : targetLabel}
      footer={
        state === 'sent' ? (
          <View className="flex-1">
            <Button onPress={close}>Done</Button>
          </View>
        ) : (
          <View className="flex-1">
            <Button variant="danger" onPress={send} isLoading={state === 'sending'}>
              {isSignedIn ? 'Send report' : 'Sign in to report'}
            </Button>
          </View>
        )
      }
    >
      {state === 'sent' ? (
        <View className="items-center py-6">
          <CheckCircle2 size={48} color={COLORS.brand[500]} />
          <Heading className="mt-4 text-center text-lg">Our team will look at it</Heading>
          <Text className="mt-2 text-center text-sm text-ink-500">
            When several people report the same thing, it comes off the feed straight away.
          </Text>
        </View>
      ) : (
        <View className="gap-2">
          {REPORT_REASONS.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setReason(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ checked: reason === option.value }}
              className={cn(
                'flex-row items-center gap-3 rounded-2xl border px-4 py-3.5',
                reason === option.value ? 'border-danger-500 bg-danger-50' : 'border-line',
              )}
            >
              <View
                className={cn(
                  'size-5 items-center justify-center rounded-full border-2',
                  reason === option.value ? 'border-danger-500' : 'border-ink-300',
                )}
              >
                {reason === option.value ? <View className="size-2.5 rounded-full bg-danger-500" /> : null}
              </View>
              <Text className="flex-1 text-ink-800">{option.label}</Text>
            </Pressable>
          ))}
          <TextField
            containerClassName="mt-3"
            label="Anything else we should know?"
            optional
            multiline
            maxLength={1000}
            value={details}
            onChangeText={setDetails}
          />
          {error ? <Notice tone="danger" className="mt-2">{error}</Notice> : null}
        </View>
      )}
    </Sheet>
  );
}
