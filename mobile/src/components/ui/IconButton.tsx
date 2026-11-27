import type { ReactNode } from 'react';

import { PressableScale } from '@/components/motion/PressableScale';
import { cn } from '@/lib/cn';

type IconButtonProps = {
  icon: ReactNode;
  onPress?: () => void;
  accessibilityLabel: string;
  tone?: 'surface' | 'glass' | 'plain';
  className?: string;
};

const TONES = {
  surface: 'border border-line bg-surface',
  glass: 'bg-white/90',
  plain: 'bg-transparent',
};

/** A 44 px touch target holding one icon. */
export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  tone = 'surface',
  className,
}: IconButtonProps) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      className={cn('size-11 items-center justify-center rounded-2xl', TONES[tone], className)}
    >
      {icon}
    </PressableScale>
  );
}
