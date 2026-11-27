import palette from './palette.json';

/**
 * The Selit palette. Web mirrors it as CSS tokens; mobile reads the JSON
 * directly in its Tailwind config, so both apps stay identical.
 */
export const COLORS = palette;

/** Calm, decelerating motion used everywhere. */
export const MOTION = {
  easeOut: [0.22, 1, 0.36, 1] as const,
  easeInOut: [0.65, 0, 0.35, 1] as const,
  appearMs: 700,
  staggerMs: 90,
  pressScale: 0.96,
} as const;
