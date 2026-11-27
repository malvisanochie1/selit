import {
  BadgeCheck,
  Ban,
  Building2,
  Flag,
  Handshake,
  MapPinned,
  ShieldAlert,
  Users,
} from 'lucide-react';
import type { Metadata } from 'next';

import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { env } from '@/config/env';

export const metadata: Metadata = {
  title: 'Safety centre',
  description: 'How to buy, sell and find a room safely on Selit.',
};

const RULES = [
  {
    icon: MapPinned,
    title: 'Meet in public, in daylight',
    text: 'Use busy places: school gates, campus security posts, banks or busy junctions. Never a private house, hotel or lonely road.',
  },
  {
    icon: Ban,
    title: 'Never go to a second location',
    text: 'If a seller says the item is "just nearby" and asks you to follow them somewhere else, say no and leave. This is the most common trap.',
  },
  {
    icon: Handshake,
    title: 'Inspect first, pay last',
    text: 'Check the item works before money changes hands. Never pay a deposit, transport fee or "holding fee" in advance.',
  },
  {
    icon: Users,
    title: 'Bring a friend, tell a friend',
    text: 'Go with someone if you can. Tap “Share my meet-up” on any listing to send a friend who, where and when.',
  },
];

const PROTECTIONS = [
  {
    icon: BadgeCheck,
    title: 'Verified identities',
    text: 'Sellers and agents confirm their NIN with a live selfie that is matched to their ID photo.',
  },
  {
    icon: ShieldAlert,
    title: 'Too-good-to-be-true checks',
    text: 'Listings priced far below normal are held for review before anyone sees them.',
  },
  {
    icon: Building2,
    title: 'Apartments stay fresh',
    text: 'Agents must confirm a room is still free every two weeks, and students can flag rooms that are taken.',
  },
  {
    icon: Flag,
    title: 'Fast reporting',
    text: 'Every listing and profile has a Report button. Our team reviews reports quickly and bans scammers.',
  },
];

export default function SafetyPage() {
  return (
    <div className="container-page">
      <PageHeader
        eyebrow="Safety centre"
        title="Meet strangers with confidence"
        description="Selit connects you with real students and agents. These habits keep every meet-up safe."
        crumbs={[{ href: '/', label: 'Home' }]}
      />

      <section aria-labelledby="rules" className="rounded-[2rem] bg-ink-950 p-6 text-white sm:p-10">
        <h2 id="rules" className="text-2xl font-semibold sm:text-3xl">
          Four rules for every meet-up
        </h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2">
          {RULES.map((rule, index) => (
            <Reveal as="li" key={rule.title} index={index} className="flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-glow">
                <rule.icon className="size-5" />
              </span>
              <div>
                <h3 className="font-sans text-lg font-semibold">{rule.title}</h3>
                <p className="mt-1.5 leading-relaxed text-ink-300">{rule.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section aria-labelledby="protections" className="mt-16">
        <h2 id="protections" className="text-3xl font-semibold text-ink-900">
          How Selit protects you
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROTECTIONS.map((item, index) => (
            <Reveal
              key={item.title}
              index={index}
              className="rounded-3xl border border-line bg-surface p-6"
            >
              <item.icon className="size-7 text-brand-600" strokeWidth={1.8} />
              <h3 className="mt-5 font-sans text-lg font-semibold text-ink-900">{item.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-500">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-6 rounded-[2rem] border border-danger-100 bg-danger-50 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-danger-700">In danger right now?</h2>
          <p className="mt-2 max-w-2xl text-ink-700">
            Leave, go somewhere busy and call the police emergency line <strong>112</strong>. Then
            report the user on Selit so we can stop them reaching anyone else.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="tel:112"
            className="inline-flex h-12 items-center rounded-2xl bg-danger-500 px-6 font-semibold text-white transition-transform active:scale-[0.96]"
          >
            Call 112
          </a>
          <ButtonLink
            href={`mailto:${env.supportEmail}?subject=Safety%20report`}
            variant="secondary"
            size="lg"
          >
            Email our safety team
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
