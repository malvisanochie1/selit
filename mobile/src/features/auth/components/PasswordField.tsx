import { Eye, EyeOff, Fingerprint } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, type TextInputProps } from 'react-native';

import { TextField } from '@/components/ui/TextField';
import { COLORS } from '@/theme';

type PasswordFieldProps = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
  /** Shows the fingerprint icon inside the field, next to the eye toggle. */
  onFingerprint?: () => void;
};

export function PasswordField({ onFingerprint, ...props }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <TextField
      {...props}
      secureTextEntry={!isVisible}
      autoCapitalize="none"
      autoCorrect={false}
      trailing={
        <>
          {onFingerprint ? (
            <Pressable
              onPress={onFingerprint}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Sign in with fingerprint"
              className="p-1"
            >
              <Fingerprint size={22} color={COLORS.brand[600]} />
            </Pressable>
          ) : null}
          <Pressable
            onPress={() => setIsVisible((visible) => !visible)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={isVisible ? 'Hide password' : 'Show password'}
            className="p-1"
          >
            {isVisible ? (
              <EyeOff size={20} color={COLORS.ink[400]} />
            ) : (
              <Eye size={20} color={COLORS.ink[400]} />
            )}
          </Pressable>
        </>
      }
    />
  );
}
