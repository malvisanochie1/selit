import { COLORS, MOTION } from '@selit/shared';
import { Easing } from 'react-native-reanimated';

export { COLORS };

export const EASE_OUT = Easing.bezier(...MOTION.easeOut);
export const EASE_IN_OUT = Easing.bezier(...MOTION.easeInOut);

export const DURATION = {
  appear: MOTION.appearMs,
  stagger: MOTION.staggerMs,
  pressIn: 200,
  release: 440,
  tab: 520,
} as const;

/** Soft card shadow; put it on the inner content view, never an animated wrapper. */
export const SHADOW = {
  card: {
    shadowColor: COLORS.ink[900],
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  float: {
    shadowColor: COLORS.ink[950],
    shadowOpacity: 0.18,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
} as const;

/** Widest the content grows on tablets and desktop. */
export const MAX_CONTENT_WIDTH = 1180;
