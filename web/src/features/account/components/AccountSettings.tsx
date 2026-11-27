'use client';

import { Download, KeyRound, LogOut, Mail, Trash2 } from 'lucide-react';

import { AreaHeader } from '@/components/layout/AreaHeader';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { env } from '@/config/env';
import { useSession, useSignOut } from '@/features/auth/hooks/use-session';

function Row({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-canvas text-ink-600 [&_svg]:size-5">
        {icon}
      </span>
      <div className="flex-1">
        <p className="font-semibold text-ink-900">{title}</p>
        <p className="mt-0.5 text-sm text-ink-500">{description}</p>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

export function AccountSettings() {
  const { user } = useSession();
  const signOut = useSignOut();
  if (!user) return null;

  const mail = (subject: string) =>
    `mailto:${env.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Account email: ${user.email}`)}`;

  return (
    <>
      <AreaHeader
        title="Settings"
        description="Manage how you sign in and what happens to your data."
      />
      <div className="max-w-3xl space-y-6">
        <section className="divide-y divide-line rounded-3xl border border-line bg-surface">
          <Row
            icon={<Mail />}
            title="Email"
            description={user.email}
            action={<span className="text-sm text-ink-400">Used to sign in</span>}
          />
          <Row
            icon={<KeyRound />}
            title="Password"
            description="Change it any time with a reset link sent to your email."
            action={
              <ButtonLink href="/forgot-password" variant="secondary" size="sm">
                Change password
              </ButtonLink>
            }
          />
          <Row
            icon={<LogOut />}
            title="Sign out"
            description="Sign out of Selit on this device."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => signOut.mutate()}
                isLoading={signOut.isPending}
              >
                Sign out
              </Button>
            }
          />
        </section>

        <section className="divide-y divide-line rounded-3xl border border-line bg-surface">
          <Row
            icon={<Download />}
            title="Download your data"
            description="Get a copy of your profile, listings and reviews."
            action={
              <ButtonLink href={mail('Data request')} variant="secondary" size="sm">
                Request a copy
              </ButtonLink>
            }
          />
          <Row
            icon={<Trash2 />}
            title="Delete account"
            description="Removes your profile and listings within 7 days. This can't be undone."
            action={
              <ButtonLink
                href={mail('Delete my account')}
                variant="ghost"
                size="sm"
                className="text-danger-600 hover:bg-danger-50 hover:text-danger-700"
              >
                Delete account
              </ButtonLink>
            }
          />
        </section>
      </div>
    </>
  );
}
