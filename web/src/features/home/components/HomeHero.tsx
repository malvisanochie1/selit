'use client';

import * as m from 'motion/react-m';

import { EASE_OUT } from '@/components/motion/motion.constants';

import { HeroCollage } from './HeroCollage';
import { HeroSearch } from './HeroSearch';

const LINE_ONE = ['Buy,', 'sell', 'and', 'find', 'a', 'room'];
const LINE_TWO = ['near', 'your', 'campus.'];

function Word({ word, index, className }: { word: string; index: number; className?: string }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
      <m.span
        className={`inline-block ${className ?? ''}`}
        initial={{ y: '105%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.08 + index * 0.06 }}
      >
        {word}
      </m.span>
    </span>
  );
}

export function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_70%,transparent)]"
      >
        <div className="absolute -top-48 -right-40 size-[38rem] rounded-full bg-brand-200/45 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-[30rem] rounded-full bg-amber-100/70 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(var(--color-line-strong)_1px,transparent_1px)] [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)] bg-[size:22px_22px] opacity-60" />
      </div>

      <div className="relative container-page grid items-center gap-10 pt-8 pb-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:pt-14 lg:pb-24">
        <div>
          <m.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-brand-200 bg-surface/80 py-1.5 pr-4 pl-2 text-sm font-semibold text-brand-800 backdrop-blur"
          >
            <span className="relative flex size-2.5">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-500" />
              <span className="relative size-2.5 rounded-full bg-brand-500" />
            </span>
            Now live in Ogwashi-Uku, Delta State
          </m.p>

          <h1 className="text-[2.75rem] leading-[0.98] font-semibold tracking-[-0.035em] text-ink-900 sm:text-6xl lg:text-[4.4rem]">
            <span className="block">
              {LINE_ONE.map((word, index) => (
                <span key={`${word}-${index}`}>
                  <Word word={word} index={index} />{' '}
                </span>
              ))}
            </span>
            <span className="block">
              {LINE_TWO.map((word, index) => (
                <span key={word}>
                  <Word
                    word={word}
                    index={LINE_ONE.length + index}
                    className="bg-gradient-to-r from-brand-600 via-brand-500 to-[#5fc93f] bg-clip-text text-transparent"
                  />{' '}
                </span>
              ))}
            </span>
          </h1>

          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.55 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600"
          >
            Pick up a mattress from a graduating student, sell your old phone, or find a
            self-contain without walking from agent to agent. Selit connects students across
            Nigeria.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.7 }}
            className="mt-8 max-w-2xl"
          >
            <HeroSearch />
          </m.div>
        </div>

        <HeroCollage />
      </div>
    </section>
  );
}
