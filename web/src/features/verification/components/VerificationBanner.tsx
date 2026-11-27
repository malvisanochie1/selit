import { ArrowRight, BadgeCheck, Clock, ShieldAlert } from 'lucide-react';

import { ButtonLink } from '@/components/ui/ButtonLink';
import type { VerificationStatus } from '@/features/auth/auth.types';
import { cn } from '@/lib/cn';

const CONTENT: Record<
  VerificationStatus,
  { icon: React.ReactNode; title: string; text: string; tone: string }
> = {
  unverified: {
    icon: <ShieldAlert />,
    title: 'Get your verified badge',
    text: 'Verified sellers get more replies, and buyers trust them faster. It takes about two minutes.',
    tone: 'bg-ink-950 text-white',
  },
  pending: {
    icon: <Clock />,
    title: 'Verification in review',
    text: 'We are checking your ID and selfie. This usually takes under a day.',
    tone: 'bg-amber-50 text-ink-900 ring-1 ring-amber-100',
  },
  verified: {
    icon: <BadgeCheck />,
    title: 'You are verified',
    text: 'Your green badge shows on every listing and on your profile.',
    tone: 'bg-brand-50 text-ink-900 ring-1 ring-brand-100',
  },
  rejected: {
    icon: <ShieldAlert />,
    title: 'Verification needs another try',
    text: 'Your photos did not match. Retake them in good light, with your full ID in view.',
    tone: 'bg-danger-50 text-ink-900 ring-1 ring-danger-100',
  },
};

export function VerificationBanner({ status }: { status: VerificationStatus }) {
  const content = CONTENT[status];
  const showAction = status === 'unverified' || status === 'rejected';
  return (
    <div
      className={cn(
        'relative flex flex-col gap-5 overflow-hidden rounded-3xl p-6 sm:flex-row sm:items-center',
        content.tone,
      )}
    >
      {status === 'unverified' ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -right-10 size-64 rounded-full bg-brand-500/30 blur-3xl"
        />
      ) : null}
      <span
        className={cn(
          'relative flex size-12 shrink-0 items-center justify-center rounded-2xl [&_svg]:size-6',
          status === 'unverified' ? 'bg-white/10 text-glow' : 'bg-white text-brand-600 shadow-card',
        )}
      >
        {content.icon}
      </span>
      <div className="relative flex-1">
        <p className="font-display text-xl font-semibold">{content.title}</p>
        <p
          className={cn('mt-1 text-sm', status === 'unverified' ? 'text-ink-300' : 'text-ink-600')}
        >
          {content.text}
        </p>
      </div>
      {showAction ? (
        <ButtonLink
          href="/account/verification"
          variant={status === 'unverified' ? 'primary' : 'dark'}
          className="relative"
        >
          {status === 'rejected' ? 'Try again' : 'Verify now'} <ArrowRight />
        </ButtonLink>
      ) : null}
    </div>
  );
}
