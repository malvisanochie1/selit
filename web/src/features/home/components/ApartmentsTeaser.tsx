'use client';

import { ArrowRight, Building2, Clock, ShieldCheck } from 'lucide-react';

import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Skeleton } from '@/components/ui/Skeleton';
import { ApartmentCard } from '@/features/apartments/components/ApartmentCard';
import { useApartments } from '@/features/apartments/hooks/use-apartments';

const POINTS = [
  { icon: ShieldCheck, text: 'Only ID-verified agents can list a home' },
  { icon: Clock, text: 'Listings expire unless the agent confirms they are still free' },
  { icon: Building2, text: 'Search by school, budget and room type in one place' },
];

export function ApartmentsTeaser() {
  const { data, isPending } = useApartments({ limit: 3 });

  return (
    <section className="py-6 sm:py-10">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-ink-950 px-6 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 -right-24 size-[30rem] rounded-full bg-brand-500/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 left-10 size-[24rem] rounded-full bg-amber-500/10 blur-3xl"
          />

          <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <Reveal>
              <p className="mb-3 text-xs font-bold tracking-[0.18em] text-glow uppercase">
                Apartments
              </p>
              <h2 className="text-3xl leading-[1.05] font-semibold sm:text-5xl">
                Find a room without the agent runaround.
              </h2>
              <p className="mt-4 max-w-md text-lg text-ink-300">
                Every vacant self-contain and flat near your school, with the rent upfront.
              </p>
              <ul className="mt-8 space-y-3">
                {POINTS.map((point) => (
                  <li key={point.text} className="flex items-start gap-3 text-ink-200">
                    <point.icon className="mt-0.5 size-5 shrink-0 text-glow" />
                    {point.text}
                  </li>
                ))}
              </ul>
              <ButtonLink href="/apartments" variant="primary" size="lg" className="mt-9">
                Browse apartments
                <ArrowRight />
              </ButtonLink>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {isPending
                ? Array.from({ length: 2 }, (_, index) => (
                    <Skeleton key={index} className="h-80 rounded-3xl bg-white/10 opacity-40" />
                  ))
                : (data?.items ?? []).slice(0, 2).map((apartment, index) => (
                    <Reveal key={apartment.id} index={index} className="flex">
                      <ApartmentCard apartment={apartment} className="w-full text-ink-900" />
                    </Reveal>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
