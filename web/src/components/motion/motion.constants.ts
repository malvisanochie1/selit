/** Calm, unhurried motion: things glide into place and never bounce. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const DURATION = {
  quick: 0.24,
  base: 0.45,
  appear: 0.7,
  slow: 1,
} as const;

export const STAGGER_SECONDS = 0.08;
export const MAX_STAGGERED_ITEMS = 8;

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.appear, ease: EASE_OUT } },
} as const;

export function staggerDelay(index: number) {
  return Math.min(index, MAX_STAGGERED_ITEMS) * STAGGER_SECONDS;
}
