'use client';

import { Heart } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useState } from 'react';

import { EASE_OUT } from '@/components/motion/motion.constants';
import { cn } from '@/lib/cn';

import { useSavedListings } from './use-saved-listings';

const BURST = [
  { x: -18, y: -34, emoji: '💕', delay: 0 },
  { x: 2, y: -48, emoji: '💖', delay: 0.06 },
  { x: 20, y: -32, emoji: '💗', delay: 0.12 },
];

type SaveButtonProps = {
  listingId: string;
  title: string;
  variant?: 'overlay' | 'outline';
  className?: string;
};

/** Saves an item to this device. Saving pops a heart with a few small hearts drifting up. */
export function SaveButton({ listingId, title, variant = 'overlay', className }: SaveButtonProps) {
  const { isSaved, toggle } = useSavedListings();
  const [burstKey, setBurstKey] = useState(0);
  const saved = isSaved(listingId);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved` : `Save ${title}`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (toggle(listingId)) setBurstKey((key) => key + 1);
      }}
      className={cn(
        'relative flex size-10 cursor-pointer items-center justify-center rounded-full transition-[background-color,transform] duration-[440ms] ease-out-soft active:scale-90',
        variant === 'overlay'
          ? 'bg-white/90 text-ink-800 shadow-card backdrop-blur hover:bg-white'
          : 'border border-line-strong bg-surface text-ink-700 hover:border-ink-300',
        className,
      )}
    >
      <m.span
        key={saved ? `on-${burstKey}` : 'off'}
        initial={saved ? { scale: 0.4 } : false}
        animate={{ scale: [0.4, 1.3, 1] }}
        transition={{ duration: 0.55, ease: EASE_OUT, times: [0, 0.55, 1] }}
        className="flex"
      >
        <Heart className={cn('size-[1.15rem]', saved && 'fill-danger-500 text-danger-500')} />
      </m.span>
      <AnimatePresence>
        {burstKey > 0 && saved ? (
          <span key={burstKey} className="pointer-events-none absolute inset-0" aria-hidden="true">
            {BURST.map((piece) => (
              <m.span
                key={piece.emoji}
                className="absolute top-1/2 left-1/2 -mt-2 -ml-2 text-sm"
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
                animate={{ opacity: [0, 1, 0], x: piece.x, y: piece.y, scale: [0.4, 1, 0.9] }}
                transition={{ duration: 1.3, delay: piece.delay, ease: EASE_OUT }}
              >
                {piece.emoji}
              </m.span>
            ))}
          </span>
        ) : null}
      </AnimatePresence>
    </button>
  );
}
