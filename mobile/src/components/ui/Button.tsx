import type { ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { PressableScale } from '@/components/motion/PressableScale';
import { cn } from '@/lib/cn';
import { COLORS } from '@/theme';

import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, { box: string; text: string; spinner: string }> = {
  primary: { box: 'bg-brand-600', text: 'text-white', spinner: '#ffffff' },
  dark: { box: 'bg-ink-900', text: 'text-white', spinner: '#ffffff' },
  secondary: {
    box: 'border border-line-strong bg-surface',
    text: 'text-ink-900',
    spinner: COLORS.ink[900],
  },
  ghost: { box: 'bg-transparent', text: 'text-ink-700', spinner: COLORS.ink[700] },
  danger: { box: 'bg-danger-500', text: 'text-white', spinner: '#ffffff' },
};

const SIZES: Record<Size, { box: string; text: string }> = {
  sm: { box: 'h-10 rounded-xl px-4', text: 'text-sm' },
  md: { box: 'h-12 rounded-2xl px-5', text: 'text-base' },
  lg: { box: 'h-14 rounded-2xl px-6', text: 'text-base' },
};

type ButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  accessibilityLabel?: string;
};

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  trailingIcon,
  isLoading = false,
  disabled = false,
  fullWidth = false,
  className,
  accessibilityLabel,
}: ButtonProps) {
  const styles = VARIANTS[variant];
  const isDisabled = disabled || isLoading;
  return (
    <PressableScale
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      style={fullWidth ? { alignSelf: 'stretch' } : undefined}
      className={cn(
        'flex-row items-center justify-center gap-2',
        styles.box,
        SIZES[size].box,
        isDisabled && 'opacity-60',
        className,
      )}
    >
      {isLoading ? (
        <ActivityIndicator color={styles.spinner} size="small" />
      ) : icon ? (
        <View>{icon}</View>
      ) : null}
      {typeof children === 'string' ? (
        <Text className={cn('font-body-semibold', styles.text, SIZES[size].text)} numberOfLines={1}>
          {children}
        </Text>
      ) : (
        children
      )}
      {trailingIcon && !isLoading ? <View>{trailingIcon}</View> : null}
    </PressableScale>
  );
}
