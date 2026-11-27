import { useState, type ReactNode } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { cn } from '@/lib/cn';
import { COLORS } from '@/theme';

import { Text } from './Text';

type TextFieldProps = TextInputProps & {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailing?: ReactNode;
  optional?: boolean;
  multiline?: boolean;
  containerClassName?: string;
};

export function TextField({
  label,
  hint,
  error,
  leadingIcon,
  trailing,
  optional,
  multiline,
  containerClassName,
  ...props
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View className={cn('gap-2', containerClassName)}>
      {label ? (
        <Text className="font-body-semibold text-sm text-ink-800">
          {label}
          {optional ? <Text className="font-body text-sm text-ink-400"> (optional)</Text> : null}
        </Text>
      ) : null}
      <View
        className={cn(
          'flex-row items-center gap-3 rounded-2xl border bg-surface px-4',
          multiline ? 'min-h-28 items-start py-3' : 'h-14',
          error ? 'border-danger-500' : isFocused ? 'border-brand-500' : 'border-line-strong',
        )}
      >
        {leadingIcon ? <View className="shrink-0">{leadingIcon}</View> : null}
        <TextInput
          placeholderTextColor={COLORS.ink[400]}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...props}
          onFocus={(event) => {
            setIsFocused(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            props.onBlur?.(event);
          }}
          style={{ minWidth: 0 }}
          className={cn('flex-1 font-body text-base text-ink-900', multiline ? 'min-h-24' : 'h-full')}
        />
        {trailing ? <View className="shrink-0 flex-row items-center gap-1">{trailing}</View> : null}
      </View>
      {error ? (
        <Text className="font-body-medium text-sm text-danger-600">{error}</Text>
      ) : hint ? (
        <Text className="text-sm text-ink-500">{hint}</Text>
      ) : null}
    </View>
  );
}
