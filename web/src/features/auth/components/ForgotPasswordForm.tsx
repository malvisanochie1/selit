'use client';

import { messageOf, passwordResetSchema } from '@selit/shared';
import { Mail, MailCheck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { TextField } from '@/components/ui/TextField';

import { requestPasswordReset } from '../auth.api';

export function ForgotPasswordForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  if (state === 'sent') {
    return (
      <div className="text-center">
        <MailCheck className="mx-auto size-12 text-brand-500" />
        <p className="mt-4 text-ink-600">
          If an account exists for that email, a reset link is on its way. It expires in one hour.
        </p>
        <Link href="/sign-in" className="mt-6 inline-block font-semibold text-brand-700">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        const parsed = passwordResetSchema.safeParse({
          email: new FormData(event.currentTarget).get('email'),
        });
        if (!parsed.success) return setError('Enter a valid email address.');
        setState('sending');
        setError('');
        try {
          await requestPasswordReset(parsed.data.email);
          setState('sent');
        } catch (requestError) {
          setError(messageOf(requestError));
          setState('idle');
        }
      }}
    >
      {error ? <Notice tone="danger">{error}</Notice> : null}
      <TextField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        leadingIcon={<Mail />}
      />
      <Button type="submit" size="lg" fullWidth isLoading={state === 'sending'}>
        Send reset link
      </Button>
      <p className="text-center text-sm">
        <Link href="/sign-in" className="font-semibold text-brand-700">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
