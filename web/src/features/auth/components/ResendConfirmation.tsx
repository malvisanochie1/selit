'use client';

import { messageOf } from '@selit/shared';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';

import { resendConfirmation } from '../auth.api';

/** Sends the confirmation email again, at most once a minute. */
export function ResendConfirmation({ email }: { email: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  async function resend() {
    setState('sending');
    setError('');
    try {
      await resendConfirmation(email);
      setState('sent');
      setTimeout(() => setState('idle'), 60_000);
    } catch (resendError) {
      setError(messageOf(resendError));
      setState('idle');
    }
  }

  return (
    <div className="mt-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={resend}
        isLoading={state === 'sending'}
        disabled={state === 'sent'}
      >
        {state === 'sent' ? 'Sent. Check your inbox' : 'Send the link again'}
      </Button>
      {error ? <p className="mt-2 text-sm text-danger-600">{error}</p> : null}
    </div>
  );
}
