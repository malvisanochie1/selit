import { Handshake, MessageCircle, Search } from 'lucide-react';

import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

const STEPS = [
  {
    icon: Search,
    title: 'Find it near you',
    text: 'Search by school, category and budget. Every listing shows the price, condition and a public meet-up spot.',
  },
  {
    icon: MessageCircle,
    title: 'Chat on WhatsApp',
    text: 'Sign in and tap WhatsApp or Call to reach the seller or agent directly. No middlemen adding their own price.',
  },
  {
    icon: Handshake,
    title: 'Meet, inspect, then pay',
    text: 'Meet in a busy public place, check the item or the room, and only pay when you are happy.',
  },
];

export function HowItWorks() {
  return (
    <section className="container-page py-14 sm:py-24">
      <SectionHeading align="center" eyebrow="How it works" title="Three steps, no runaround" />
      <ol className="mt-14 grid gap-5 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <Reveal
            as="li"
            key={step.title}
            index={index}
            className="relative rounded-[1.75rem] border border-line bg-surface p-7"
          >
            <span className="absolute top-6 right-7 font-display text-6xl leading-none font-bold text-ink-100">
              {index + 1}
            </span>
            <span className="relative flex size-12 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-glow">
              <step.icon className="size-6" />
            </span>
            <h3 className="relative mt-8 text-2xl font-semibold text-ink-900">{step.title}</h3>
            <p className="relative mt-3 leading-relaxed text-ink-500">{step.text}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
