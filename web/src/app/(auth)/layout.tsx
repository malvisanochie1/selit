import { BadgeCheck, MapPinned, ShieldCheck } from 'lucide-react';

import { Logo } from '@/components/layout/Logo';
import { SampleModeBanner } from '@/components/layout/SampleModeBanner';

const POINTS = [
  { icon: BadgeCheck, text: 'Real students, verified sellers' },
  { icon: MapPinned, text: 'Meet at public spots near campus' },
  { icon: ShieldCheck, text: 'Numbers stay private until you sign in' },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SampleModeBanner />
      <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
        <main id="main" className="flex flex-col px-[max(1.25rem,6%)] py-6 sm:py-8">
          <Logo />
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
            {children}
          </div>
        </main>
        <aside className="relative hidden overflow-hidden bg-ink-950 p-12 text-white lg:flex lg:flex-col lg:justify-end">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 -right-32 size-[34rem] rounded-full bg-brand-500/30 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-10 -left-20 size-[22rem] rounded-full bg-amber-500/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent)] bg-[size:24px_24px]"
          />
          <div className="relative max-w-lg">
            <p className="font-display text-5xl leading-[1.02] font-semibold tracking-tight">
              The marketplace that knows your campus.
            </p>
            <ul className="mt-10 space-y-4">
              {POINTS.map((point) => (
                <li key={point.text} className="flex items-center gap-3 text-lg text-ink-200">
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-white/10 text-glow">
                    <point.icon className="size-5" />
                  </span>
                  {point.text}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
