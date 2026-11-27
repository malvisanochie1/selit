'use client';

import { messageOf, PASSWORD_RULES } from '@selit/shared';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Notice } from '@/components/ui/Notice';

import { updatePassword } from '../auth.api';
import { useSession } from '../hooks/use-session';
import { PasswordField } from './PasswordField';
import { PasswordStrength } from './PasswordStrength';

export function ResetPasswordForm() {
  const { user, isLoading } = useSession();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [state, setState] = useState<'idle' | 'saving' | 'done'>('idle');

  if (!isLoading && !user && state !== 'done') {
    return (
      <Notice tone="danger" title="This reset link has expired">
        Open the link from your email again, or request a new one.
      </Notice>
    );
  }
  if (state === 'done') {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-12 text-brand-500" />
        <p className="mt-4 text-ink-600">Your password has been changed. You&apos;re signed in.</p>
        <ButtonLink href="/account" size="lg" className="mt-6">
          Go to your account
        </ButtonLink>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        const parsed = PASSWORD_RULES.safeParse(password);
        if (!parsed.success)
          return setError(parsed.error.issues[0]?.message ?? 'Choose a stronger password.');
        setState('saving');
        setError('');
        try {
          await updatePassword(password);
          setState('done');
        } catch (resetError) {
          setError(messageOf(resetError));
          setState('idle');
        }
      }}
    >
      {error ? <Notice tone="danger">{error}</Notice> : null}
      <div>
        <PasswordField
          id="password"
          label="New password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <PasswordStrength password={password} />
      </div>
      <Button type="submit" size="lg" fullWidth isLoading={state === 'saving'}>
        Save new password
      </Button>
    </form>
  );
}
