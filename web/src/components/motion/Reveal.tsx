'use client';

import * as m from 'motion/react-m';

import { DURATION, EASE_OUT, staggerDelay } from './motion.constants';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  index?: number;
  delay?: number;
  distance?: number;
  as?: 'div' | 'section' | 'li' | 'article';
};

/** Fades content up the first time it scrolls into view. */
export function Reveal({
  children,
  className,
  index = 0,
  delay = 0,
  distance = 18,
  as = 'div',
}: RevealProps) {
  const Component = m[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: DURATION.appear, ease: EASE_OUT, delay: delay + staggerDelay(index) }}
    >
      {children}
    </Component>
  );
}
