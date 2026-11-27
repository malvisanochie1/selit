import { helpQuestions } from '@selit/shared';
import { Mail, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

import { PageHeader } from '@/components/layout/PageHeader';
import { Accordion } from '@/components/ui/Accordion';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { env } from '@/config/env';

export const metadata: Metadata = {
  title: 'Help & FAQ',
  description: 'Answers to common questions about buying, selling and finding rooms on Selit.',
};

const FAQ = helpQuestions(env.supportEmail);

export default function HelpPage() {
  return (
    <div className="container-page">
      <PageHeader
        eyebrow="Help"
        title="How can we help?"
        description="Quick answers to the questions students ask most."
        crumbs={[{ href: '/', label: 'Home' }]}
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <Accordion items={FAQ} />
        <aside className="space-y-4">
          <div id="report" className="scroll-mt-28 rounded-3xl border border-line bg-surface p-6">
            <ShieldCheck className="size-7 text-brand-600" />
            <h2 className="mt-4 font-sans text-lg font-semibold text-ink-900">Report a problem</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
              Use the Report button on any listing or profile. For anything else, email our safety
              team with the link.
            </p>
            <ButtonLink
              href={`mailto:${env.supportEmail}?subject=Report`}
              variant="dark"
              className="mt-5"
              fullWidth
            >
              <Mail /> Email the safety team
            </ButtonLink>
          </div>
          <div className="rounded-3xl bg-brand-50 p-6">
            <h2 className="font-sans text-lg font-semibold text-brand-900">Still stuck?</h2>
            <p className="mt-1.5 text-sm text-brand-800">
              Write to{' '}
              <a
                href={`mailto:${env.supportEmail}`}
                className="font-semibold underline-offset-4 hover:underline"
              >
                {env.supportEmail}
              </a>
              . We reply within a day.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
