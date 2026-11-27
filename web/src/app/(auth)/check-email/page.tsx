import { MailCheck } from 'lucide-react';
import type { Metadata } from 'next';

import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { ResendConfirmation } from '@/features/auth/components/ResendConfirmation';

export const metadata: Metadata = { title: 'Check your email' };

type CheckEmailPageProps = { searchParams: Promise<{ email?: string }> };

export default async function CheckEmailPage({ searchParams }: CheckEmailPageProps) {
  const { email } = await searchParams;
  return (
    <Reveal className="text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
        <MailCheck className="size-8" />
      </span>
      <h1 className="mt-6 text-4xl font-semibold text-ink-900">Check your email</h1>
      <p className="mt-3 text-ink-500">
        We sent a confirmation link{email ? ' to ' : ''}
        {email ? <strong className="text-ink-800">{email}</strong> : null}. Tap it to activate your
        account, then sign in.
      </p>
      <p className="mt-2 text-sm text-ink-400">
        Can&apos;t find it? Check your spam or promotions folder.
      </p>
      {email ? <ResendConfirmation email={email} /> : null}
      <ButtonLink href="/sign-in" size="lg" className="mt-8">
        Go to sign in
      </ButtonLink>
    </Reveal>
  );
}
