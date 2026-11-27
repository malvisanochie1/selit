'use client';

import { ApiError, fieldErrorsOf, messageOf, signUpSchema } from '@selit/shared';
import { Mail, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { TextField } from '@/components/ui/TextField';
import { safeRedirectPath } from '@/lib/safe-redirect';

import { useSignUp } from '../hooks/use-session';
import { PasswordField } from './PasswordField';
import { PasswordStrength } from './PasswordStrength';

type Intent = 'buyer' | 'seller';

export function SignUpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const signUp = useSignUp();
  const [intent, setIntent] = useState<Intent>('buyer');
  const [password, setPassword] = useState('');
  const [hasAgreed, setHasAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const next = safeRedirectPath(params.get('next'), intent === 'seller' ? '/sell' : '/account');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = signUpSchema.safeParse({
      fullName: form.get('fullName'),
      email: form.get('email'),
      password,
      accountType: intent,
    });
    if (!parsed.success) return setErrors(fieldErrorsOf(parsed.error));
    if (!hasAgreed) return setErrors({ terms: 'Please accept the terms to continue.' });
    setErrors({});
    signUp.mutate(parsed.data, {
      onSuccess: (data) => {
        if (data.needsEmailConfirmation) {
          router.replace(`/check-email?email=${encodeURIComponent(parsed.data.email)}`);
          return;
        }
        router.replace(next);
        router.refresh();
      },
      onError: (error) => {
        if (error instanceof ApiError) setErrors(error.fieldErrors);
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {signUp.isError ? <Notice tone="danger">{messageOf(signUp.error)}</Notice> : null}
      <div>
        <p className="mb-2 text-sm font-semibold text-ink-800">I mainly want to</p>
        <SegmentedTabs
          label="What do you want to do?"
          value={intent}
          onChange={setIntent}
          options={[
            { value: 'buyer', label: 'Buy and find rooms' },
            { value: 'seller', label: 'Sell my things' },
          ]}
          className="w-full [&>button]:flex-1"
        />
        <p className="mt-2 text-xs text-ink-500">You can always do both later.</p>
      </div>
      <TextField
        id="fullName"
        label="Full name"
        autoComplete="name"
        leadingIcon={<UserRound />}
        placeholder="As it appears on your ID"
        error={errors.fullName}
      />
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
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          hint="At least 8 characters, with a letter and a number."
          error={errors.password}
        />
        <PasswordStrength password={password} />
      </div>
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-600">
          <input
            type="checkbox"
            checked={hasAgreed}
            onChange={(event) => setHasAgreed(event.target.checked)}
            className="mt-0.5 size-4.5 shrink-0 accent-brand-500"
          />
          <span>
            I agree to the{' '}
            <Link
              href="/legal/terms"
              className="font-semibold text-ink-900 underline-offset-4 hover:underline"
            >
              terms
            </Link>{' '}
            and{' '}
            <Link
              href="/legal/community-guidelines"
              className="font-semibold text-ink-900 underline-offset-4 hover:underline"
            >
              community rules
            </Link>
            .
          </span>
        </label>
        {errors.terms ? (
          <p className="mt-1.5 text-sm font-medium text-danger-600">{errors.terms}</p>
        ) : null}
      </div>
      <Button type="submit" size="lg" fullWidth isLoading={signUp.isPending}>
        Create account
      </Button>
      <p className="text-center text-sm text-ink-500">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-semibold text-brand-700 hover:text-brand-800">
          Sign in
        </Link>
      </p>
    </form>
  );
}
