'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useState } from 'react';

import { EASE_OUT } from '@/components/motion/motion.constants';
import { cn } from '@/lib/cn';

import { ListingImage } from './ListingImage';

type ListingGalleryProps = {
  images: string[];
  title: string;
  category: string;
  overlay?: React.ReactNode;
  fallbackIcon?: React.ComponentProps<typeof ListingImage>['fallbackIcon'];
};

const SWIPE_THRESHOLD = 60;

export function ListingGallery({
  images,
  title,
  category,
  overlay,
  fallbackIcon,
}: ListingGalleryProps) {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const count = images.length;

  function go(step: number) {
    if (count < 2) return;
    setState(([current]) => [(current + step + count) % count, step]);
  }

  return (
    <div>
      <div className="relative aspect-[4/3.6] overflow-hidden rounded-[1.75rem] bg-canvas ring-1 ring-line sm:aspect-[4/3]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <m.div
            key={index}
            custom={direction}
            className="absolute inset-0"
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            drag={count > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_THRESHOLD) go(1);
              else if (info.offset.x > SWIPE_THRESHOLD) go(-1);
            }}
          >
            <ListingImage
              src={images[index]}
              alt={`${title}, photo ${index + 1} of ${Math.max(count, 1)}`}
              category={category}
              fallbackIcon={fallbackIcon}
              priority
              sizes="(min-width: 1024px) 680px, 100vw"
              className="pointer-events-none"
            />
          </m.div>
        </AnimatePresence>
        {overlay}
        {count > 1 ? (
          <>
            {[-1, 1].map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => go(step)}
                aria-label={step < 0 ? 'Previous photo' : 'Next photo'}
                className={cn(
                  'absolute top-1/2 hidden size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink-800 shadow-card backdrop-blur transition-transform active:scale-90 sm:flex',
                  step < 0 ? 'left-4' : 'right-4',
                )}
              >
                {step < 0 ? (
                  <ChevronLeft className="size-5" />
                ) : (
                  <ChevronRight className="size-5" />
                )}
              </button>
            ))}
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5">
              {images.map((image, dot) => (
                <span
                  key={image}
                  className={cn(
                    'h-1.5 rounded-full bg-white shadow transition-all duration-500 ease-out-soft',
                    dot === index ? 'w-6' : 'w-1.5 opacity-60',
                  )}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div className="mt-3 no-scrollbar flex gap-2.5 overflow-x-auto">
          {images.map((image, thumb) => (
            <button
              key={image}
              type="button"
              onClick={() => setState(([current]) => [thumb, thumb > current ? 1 : -1])}
              aria-label={`Show photo ${thumb + 1}`}
              aria-current={thumb === index}
              className={cn(
                'relative size-20 shrink-0 cursor-pointer overflow-hidden rounded-2xl ring-2 transition-[box-shadow,opacity] duration-300',
                thumb === index
                  ? 'ring-brand-500'
                  : 'opacity-70 ring-transparent hover:opacity-100',
              )}
            >
              <ListingImage
                src={image}
                alt=""
                category={category}
                fallbackIcon={fallbackIcon}
                sizes="80px"
                compact
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
