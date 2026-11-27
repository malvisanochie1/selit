import { ArrowRight, BadgeCheck, Flag, MapPinned, Share2 } from 'lucide-react';

import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/ButtonLink';

const FEATURES = [
  {
    icon: BadgeCheck,
    title: 'Verified identities',
    text: 'Sellers and agents confirm their NIN with a live selfie before they can post.',
  },
  {
    icon: MapPinned,
    title: 'Public meet-up spots',
    text: 'Item sales happen at busy public places like school gates, never private addresses.',
  },
  {
    icon: Share2,
    title: 'Share your meet-up',
    text: 'One tap sends a friend who you are meeting, where and when.',
  },
  {
    icon: Flag,
    title: 'Report in two taps',
    text: 'Suspicious listing? Report it and our team acts fast.',
  },
];

export function SafetyBand() {
  return (
    <section className="py-14 sm:py-20">
      <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <Reveal>
          <p className="mb-3 text-xs font-bold tracking-[0.18em] text-brand-600 uppercase">
            Safety first
          </p>
          <h2 className="text-3xl leading-[1.05] font-semibold text-ink-900 sm:text-5xl">
            Built so you can meet strangers with confidence.
          </h2>
          <p className="mt-5 text-lg text-ink-500">
            Bad actors hate leaving a real identity behind. Every layer of Selit is designed to keep
            you safe before, during and after a meet-up.
          </p>
          <ButtonLink href="/safety" variant="dark" size="lg" className="mt-8">
            Visit the safety centre <ArrowRight />
          </ButtonLink>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((feature, index) => (
            <Reveal
              key={feature.title}
              index={index}
              className="rounded-[1.75rem] bg-surface p-6 shadow-card ring-1 ring-line/70"
            >
              <feature.icon className="size-7 text-brand-600" strokeWidth={1.8} />
              <h3 className="mt-5 text-xl font-semibold text-ink-900">{feature.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-500">{feature.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
