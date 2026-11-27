import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/cn';

const ITEM_TIPS = [
  'Meet in a busy public place like the school gate, in daylight.',
  'Inspect the item fully before you pay. Never pay in advance.',
  'Never follow a seller to a second location, even if they say the item is "just nearby".',
  'Tell a friend where you are going. Use “Share my meet-up”.',
];

const APARTMENT_TIPS = [
  'Never pay an inspection fee, deposit or rent before you see the room in person.',
  'Inspect during the day, and go with a friend.',
  'Confirm the agent’s name matches their verified profile on Selit.',
  'Pay rent only after you meet the landlord or get a written agreement.',
];

type SafetyTipsProps = {
  variant?: 'item' | 'apartment';
  className?: string;
};

export function SafetyTips({ variant = 'item', className }: SafetyTipsProps) {
  const tips = variant === 'apartment' ? APARTMENT_TIPS : ITEM_TIPS;
  return (
    <section
      aria-labelledby={`safety-${variant}`}
      className={cn('rounded-3xl border border-amber-300/50 bg-amber-50/70 p-5', className)}
    >
      <h2
        id={`safety-${variant}`}
        className="flex items-center gap-2 font-sans text-sm font-bold text-amber-700"
      >
        <ShieldCheck className="size-5" />
        Stay safe
      </h2>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-700">
        {tips.map((tip) => (
          <li key={tip} className="flex gap-2.5">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500" />
            {tip}
          </li>
        ))}
      </ul>
      <Link
        href="/safety"
        className="mt-3 inline-block text-sm font-semibold text-amber-700 underline-offset-4 hover:underline"
      >
        Read the full safety guide
      </Link>
    </section>
  );
}
