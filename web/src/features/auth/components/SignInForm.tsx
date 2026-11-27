'use client';

import { fieldErrorsOf, messageOf, signInSchema } from '@selit/shared';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { TextField } from '@/components/ui/TextField';
import { isSampleMode } from '@/config/env';
import { safeRedirectPath } from '@/lib/safe-redirect';

import { useSignIn } from '../hooks/use-session';
import { PasswordField } from './PasswordField';

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const signIn = useSignIn();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const next = safeRedirectPath(params.get('next'));

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = signInSchema.safeParse({
      email: form.get('email'),
      password: form.get('password'),
    });
    if (!parsed.success) return setErrors(fieldErrorsOf(parsed.error));
    setErrors({});
    signIn.mutate(parsed.data, {
      onSuccess: () => {
        router.replace(next);
        router.refresh();
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {isSampleMode ? (
        <Notice tone="info" title="Demo mode">
          Any email and password works. Use an email starting with “admin” to see the admin area.
        </Notice>
      ) : null}
      {params.get('link') === 'expired' ? (
        <Notice tone="warning" title="That link has expired">
          Sign in below, or request a new link.
        </Notice>
      ) : null}
      {signIn.isError ? <Notice tone="danger">{messageOf(signIn.error)}</Notice> : null}
      <TextField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        inputMode="email"
        leadingIcon={<Mail />}
        placeholder="you@example.com"
        error={errors.email}
      />
      <div>
        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          error={errors.password}
        />
        <Link
          href="/forgot-password"
          className="mt-2 inline-block text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          Forgot password?
        </Link>
      </div>
      <Button type="submit" size="lg" fullWidth isLoading={signIn.isPending}>
        Sign in
      </Button>
      <p className="text-center text-sm text-ink-500">
        New to Selit?{' '}
        <Link
          href={`/sign-up${params.get('next') ? `?next=${encodeURIComponent(next)}` : ''}`}
          className="font-semibold text-brand-700 hover:text-brand-800"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
