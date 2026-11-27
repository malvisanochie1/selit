import { View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/cn';

function scoreOf(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Za-z]/.test(password) && /\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password) || /[A-Z]/.test(password)) score += 1;
  return score;
}

const LEVELS = [
  { label: 'Too short', bar: 'bg-danger-500' },
  { label: 'Weak', bar: 'bg-danger-500' },
  { label: 'Fair', bar: 'bg-amber-500' },
  { label: 'Good', bar: 'bg-brand-400' },
  { label: 'Strong', bar: 'bg-brand-600' },
];

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const score = scoreOf(password);
  const level = LEVELS[score];
  return (
    <View className="flex-row items-center gap-3">
      <View className="flex-1 flex-row gap-1">
        {[1, 2, 3, 4].map((step) => (
          <View
            key={step}
            className={cn('h-1.5 flex-1 rounded-full', step <= score ? level.bar : 'bg-ink-100')}
          />
        ))}
      </View>
      <Text className="w-16 text-right font-body-semibold text-xs text-ink-500">{level.label}</Text>
    </View>
  );
}
