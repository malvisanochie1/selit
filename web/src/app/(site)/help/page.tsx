import { Mail, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/PageHeader';
import { Accordion } from '@/components/ui/Accordion';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { env } from '@/config/env';

export const metadata: Metadata = {
  title: 'Help & FAQ',
  description: 'Answers to common questions about buying, selling and finding rooms on Selit.',
};

const FAQ = [
  {
    question: 'Does Selit handle payments?',
    answer:
      'No. Selit connects you with the seller or agent. You chat on WhatsApp or call, meet in a public place, inspect, and then pay them directly. Never pay before you inspect.',
  },
  {
    question: 'Is it free to list an item?',
    answer: 'Yes. Listing items on Selit is free.',
  },
  {
    question: 'Why do I need to sign in to see a phone number?',
    answer:
      'It stops scammers and bots from collecting sellers’ numbers. Signing in takes a minute and keeps everyone’s contact details safe.',
  },
  {
    question: 'How does verification work?',
    answer: (
      <>
        You enter your NIN, take a photo of your ID and a short live selfie. We match your face to
        your ID and your name to your account. Verified sellers get a green badge.{' '}
        <Link href="/account/verification" className="font-semibold text-brand-700 hover:underline">
          Get verified
        </Link>
        .
      </>
    ),
  },
  {
    question: 'Why was my listing held for review?',
    answer:
      'Listings that look unusual, such as a price far below what similar items sell for, are checked by our team before they go live. Most are approved within a few hours.',
  },
  {
    question: 'My school isn’t listed. What do I do?',
    answer:
      'Type your school’s full name when you create a listing and use it. We add new schools regularly; you can also email us to add it.',
  },
  {
    question: 'How do I delete my account?',
    answer: `Email ${env.supportEmail} from the address on your account and we will delete it and your listings within 7 days.`,
  },
];

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
