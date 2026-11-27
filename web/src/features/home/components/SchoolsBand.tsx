import { SCHOOLS, schoolsInState } from '@selit/shared';
import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

import { CountUp } from '@/components/motion/CountUp';
import { Marquee } from '@/components/motion/Marquee';
import { Reveal } from '@/components/motion/Reveal';

const STATS = [
  { value: SCHOOLS.length, suffix: '+', label: 'schools listed' },
  { value: 37, suffix: '', label: 'states and the FCT' },
  { value: 0, suffix: '', label: 'naira to list an item', prefix: '₦' },
];

export function SchoolsBand() {
  const deltaSchools = schoolsInState('Delta');
  return (
    <section className="overflow-hidden py-14 sm:py-20">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold tracking-[0.18em] text-brand-600 uppercase">
            Schools
          </p>
          <h2 className="text-3xl leading-[1.05] font-semibold text-ink-900 sm:text-5xl">
            Delta State first. Every campus next.
          </h2>
        </Reveal>
        <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-4 text-center">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-display text-4xl font-bold text-ink-900 sm:text-6xl">
                {stat.prefix}
                <CountUp to={stat.value} suffix={stat.suffix} />
              </dd>
              <dd className="mt-1 text-sm text-ink-500 sm:text-base">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
      <Marquee className="mt-14">
        {deltaSchools.map((school) => (
          <Link
            key={school.slug}
            href={`/schools/${school.slug}`}
            className="flex shrink-0 items-center gap-2.5 rounded-full border border-line bg-surface px-5 py-3 text-sm font-semibold text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700"
          >
            <GraduationCap className="size-4 text-brand-600" />
            {school.name}
          </Link>
        ))}
      </Marquee>
    </section>
  );
}
