import { ArrowRight, Camera, Tag, Users } from 'lucide-react';

import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/ButtonLink';

const STEPS = [
  { icon: Camera, text: 'Snap a few photos' },
  { icon: Tag, text: 'Set a fair price' },
  { icon: Users, text: 'Students nearby reach out' },
];

export function SellCta() {
  return (
    <section className="container-page py-10">
      <Reveal className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 px-6 py-14 text-white sm:px-12 lg:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-glow/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 left-1/3 size-72 rounded-full bg-amber-400/25 blur-3xl"
        />
        <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl leading-[1.05] font-semibold sm:text-5xl">
              Graduating? Turn your hostel things into cash.
            </h2>
            <p className="mt-4 text-lg text-brand-50/90">
              Listing is free and takes about two minutes. The next set of freshers is already
              looking.
            </p>
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
              {STEPS.map((step) => (
                <li
                  key={step.text}
                  className="flex items-center gap-2 text-sm font-semibold text-white/95"
                >
                  <step.icon className="size-4" />
                  {step.text}
                </li>
              ))}
            </ul>
          </div>
          <ButtonLink href="/sell" variant="accent" size="lg" className="self-start lg:self-center">
            List an item for free <ArrowRight />
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
