'use client';

import { Plus } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useId, useState } from 'react';

import { EASE_OUT } from '@/components/motion/motion.constants';
import { cn } from '@/lib/cn';

export type AccordionItem = { question: string; answer: React.ReactNode };

export function Accordion({
  items,
  className,
}: {
  items: readonly AccordionItem[];
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div
      className={cn('divide-y divide-line rounded-3xl border border-line bg-surface', className)}
    >
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-${index}`;
        return (
          <div key={item.question}>
            <h3 className="font-sans text-base">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full cursor-pointer items-center gap-4 px-5 py-5 text-left font-semibold text-ink-900 sm:px-6"
              >
                <span className="flex-1">{item.question}</span>
                <Plus
                  className={cn(
                    'size-5 shrink-0 text-ink-400 transition-transform duration-500 ease-out-soft',
                    isOpen && 'rotate-45 text-brand-600',
                  )}
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <m.div
                  id={panelId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 leading-relaxed text-ink-600 sm:px-6">
                    {item.answer}
                  </div>
                </m.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
