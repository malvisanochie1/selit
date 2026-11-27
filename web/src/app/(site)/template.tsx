'use client';

import * as m from 'motion/react-m';

import { EASE_OUT } from '@/components/motion/motion.constants';

/** Each page glides in softly on navigation. */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      {children}
    </m.div>
  );
}
