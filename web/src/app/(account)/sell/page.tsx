import { ArrowRight, Building2, Package } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { AreaHeader } from '@/components/layout/AreaHeader';
import { Reveal } from '@/components/motion/Reveal';

export const metadata: Metadata = { title: 'Sell on Selit' };

const OPTIONS = [
  {
    href: '/sell/item',
    icon: Package,
    title: 'Sell an item',
    text: 'Mattresses, pots, phones, books, anything you no longer need. Free to list.',
    tint: 'bg-brand-500 text-white shadow-glow',
  },
  {
    href: '/sell/apartment',
    icon: Building2,
    title: 'List a room or apartment',
    text: 'For agents, landlords and students looking for a roommate. Requires ID verification.',
    tint: 'bg-ink-900 text-white',
  },
];

export default function SellPage() {
  return (
    <>
      <AreaHeader
        title="What are you listing?"
        description="Pick one to get started. It takes about two minutes."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {OPTIONS.map((option, index) => (
          <Reveal key={option.href} index={index}>
            <Link
              href={option.href}
              className="group flex h-full flex-col rounded-[1.75rem] border border-line bg-surface p-7 transition-[transform,box-shadow] duration-700 ease-out-soft hover:-translate-y-1 hover:shadow-lift"
            >
              <span
                className={`flex size-14 items-center justify-center rounded-2xl ${option.tint}`}
              >
                <option.icon className="size-7" />
              </span>
              <h2 className="mt-8 text-2xl font-semibold text-ink-900">{option.title}</h2>
              <p className="mt-2 flex-1 text-ink-500">{option.text}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-brand-700">
                Continue{' '}
                <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </>
  );
}
