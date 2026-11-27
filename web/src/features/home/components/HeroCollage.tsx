'use client';

import { BadgeCheck, BedDouble, Building2, CheckCheck, MapPin, ShieldCheck } from 'lucide-react';
import * as m from 'motion/react-m';

import { EASE_OUT } from '@/components/motion/motion.constants';
import { Avatar } from '@/components/ui/Avatar';

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 40, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 1, ease: EASE_OUT, delay },
});

/** A calm, drifting preview of what people find on Selit. */
export function HeroCollage() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto h-[30rem] w-full max-w-[32rem] select-none lg:h-[34rem]"
    >
      <m.div {...enter(0.35)} className="absolute top-6 left-0 w-[64%]">
        <div className="animate-drift overflow-hidden rounded-[1.75rem] bg-surface shadow-float ring-1 ring-line">
          <div className="relative flex aspect-[4/3] items-center justify-center bg-[radial-gradient(120%_100%_at_20%_10%,var(--color-brand-100),var(--color-canvas)_55%,var(--color-amber-50))]">
            <span className="flex size-20 items-center justify-center rounded-[1.6rem] bg-brand-50 text-brand-700 shadow-card">
              <BedDouble className="size-9" strokeWidth={1.6} />
            </span>
            <span className="absolute top-3 left-3 rounded-full bg-ink-900/80 px-2.5 py-1 text-xs font-semibold text-white">
              Good
            </span>
          </div>
          <div className="p-4">
            <p className="font-display text-2xl font-bold text-ink-900">₦28,000</p>
            <p className="mt-1 text-sm font-medium text-ink-700">6×4 foam mattress, 8 inches</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-ink-500">
              <MapPin className="size-3.5" /> DSPG · Main gate
              <BadgeCheck className="size-3.5 text-brand-600" />
            </p>
          </div>
        </div>
      </m.div>

      <m.div {...enter(0.55)} className="absolute top-0 right-0 w-[52%]">
        <div className="animate-drift overflow-hidden rounded-[1.75rem] bg-ink-900 text-white shadow-float [animation-delay:-3s]">
          <div className="flex aspect-[5/3] items-center justify-center bg-[radial-gradient(120%_120%_at_80%_0%,rgb(142_224_91/0.35),transparent_60%)]">
            <Building2 className="size-12 text-glow" strokeWidth={1.4} />
          </div>
          <div className="p-4">
            <p className="text-xs font-semibold tracking-wide text-ink-300 uppercase">
              Self-contain
            </p>
            <p className="mt-1 font-display text-xl font-bold">
              ₦180,000<span className="font-sans text-sm font-medium text-ink-300"> / yr</span>
            </p>
            <p className="mt-1 text-xs text-ink-300">5 min walk to DSPG back gate</p>
          </div>
        </div>
      </m.div>

      <m.div {...enter(0.8)} className="absolute right-2 bottom-24 w-[58%] lg:bottom-28">
        <div className="animate-drift space-y-2 [animation-delay:-5s]">
          <div className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-md bg-[#dcf8c6] px-3.5 py-2 text-sm text-ink-900 shadow-card">
            Hi! Is the mattress still available?
          </div>
          <div className="w-fit max-w-[90%] rounded-2xl rounded-bl-md bg-surface px-3.5 py-2 text-sm text-ink-900 shadow-card ring-1 ring-line">
            Yes 🙂 Meet at the main gate by 4?
            <CheckCheck className="ml-1.5 inline size-4 text-info-500" />
          </div>
        </div>
      </m.div>

      <m.div {...enter(1)} className="absolute bottom-6 left-4">
        <div className="flex animate-drift items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-float ring-1 ring-line [animation-delay:-2s]">
          <Avatar name="Ada Okafor" size={40} />
          <div>
            <p className="flex items-center gap-1 text-sm font-semibold text-ink-900">
              Ada Okafor <BadgeCheck className="size-4 text-brand-600" />
            </p>
            <p className="flex items-center gap-1 text-xs text-ink-500">
              <ShieldCheck className="size-3.5 text-brand-600" /> ID verified seller
            </p>
          </div>
        </div>
      </m.div>
    </div>
  );
}
