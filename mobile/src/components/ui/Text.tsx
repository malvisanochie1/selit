import { Text as NativeText, type TextProps } from 'react-native';

import { cn } from '@/lib/cn';

/** Body text in the Selit typeface. Use font-* classes for weight, never fontWeight. */
export function Text({ className, ...props }: TextProps & { className?: string }) {
  return <NativeText {...props} className={cn('font-body text-base text-ink-700', className)} />;
}

export function Heading({ className, ...props }: TextProps & { className?: string }) {
  return (
    <NativeText
      {...props}
      accessibilityRole="header"
      className={cn('font-display text-2xl tracking-tight text-ink-900', className)}
    />
  );
}
