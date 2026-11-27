'use client';

import { animate, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { EASE_OUT } from './motion.constants';

type CountUpProps = {
  to: number;
  suffix?: string;
  decimals?: number;
  durationSeconds?: number;
};

export function CountUp({ to, suffix = '', decimals = 0, durationSeconds = 1.6 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, to, {
      duration: durationSeconds,
      ease: EASE_OUT,
      onUpdate: setValue,
    });
    return () => controls.stop();
  }, [isInView, to, durationSeconds]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString('en-NG', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
