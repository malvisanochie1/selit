import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/ButtonLink';

export const metadata: Metadata = {
  title: 'About',
  description: 'Why we built Selit, the student marketplace for Nigeria.',
};

const VALUES = [
  {
    title: 'Fair prices',
    text: 'Students sell to students directly, without middlemen adding their own markup.',
  },
  {
    title: 'Safety first',
    text: 'Verified identities, public meet-ups and fast reporting, built in from day one.',
  },
  {
    title: 'Made for campus life',
    text: 'Hostel items, rooms and textbooks: the things students actually need, near where they study.',
  },
];

export default function AboutPage() {
  return (
    <div className="container-page">
      <PageHeader
        eyebrow="About Selit"
        title="Built by students who couldn't find a room."
        crumbs={[{ href: '/', label: 'Home' }]}
      />
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <Reveal className="space-y-5 text-lg leading-relaxed text-ink-700">
          <p>
            When we came back to Ogwashi-Uku for our HND, finding an apartment was hard. The few
            agents we found had very few houses, and we only discovered vacant rooms after we had
            already paid for a bad one, because we didn&apos;t know the agents holding them.
          </p>
          <p>
            A year later a friend needed a bed frame, buckets and a cooking pot. Graduating students
            had all of these to sell, but the only listings we could find had extra money added by
            middlemen.
          </p>
          <p>
            So we built Selit: one place where students find second-hand essentials and rooms near
            their campus, contact the owner directly, and meet safely. We are starting in Delta
            State and growing to every campus in Nigeria.
          </p>
          <ButtonLink href="/search" size="lg" className="mt-3">
            Start browsing <ArrowRight />
          </ButtonLink>
        </Reveal>
        <div className="space-y-4">
          {VALUES.map((value, index) => (
            <Reveal
              key={value.title}
              index={index}
              className="rounded-3xl border border-line bg-surface p-6"
            >
              <h2 className="font-sans text-lg font-semibold text-ink-900">{value.title}</h2>
              <p className="mt-1.5 text-ink-500">{value.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
