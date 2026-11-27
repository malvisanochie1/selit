import { AlertTriangle, CheckCircle2, Info, OctagonAlert } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/cn';
import { COLORS } from '@/theme';

import { Text } from './Text';

type Tone = 'info' | 'success' | 'warning' | 'danger';

const TONES: Record<Tone, { box: string; text: string; color: string; Icon: typeof Info }> = {
  info: { box: 'border-info-500/20 bg-info-50', text: 'text-info-700', color: COLORS.info[700], Icon: Info },
  success: { box: 'border-brand-200 bg-brand-50', text: 'text-brand-800', color: COLORS.brand[700], Icon: CheckCircle2 },
  warning: { box: 'border-amber-300/60 bg-amber-50', text: 'text-amber-700', color: COLORS.amber[700], Icon: AlertTriangle },
  danger: { box: 'border-danger-100 bg-danger-50', text: 'text-danger-700', color: COLORS.danger[700], Icon: OctagonAlert },
};

export function Notice({
  tone = 'info',
  title,
  children,
  action,
  className,
}: {
  tone?: Tone;
  title?: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  const { box, text, color, Icon } = TONES[tone];
  return (
    <View
      accessibilityRole={tone === 'danger' ? 'alert' : 'summary'}
      className={cn('flex-row gap-3 rounded-2xl border p-4', box, className)}
    >
      <Icon size={20} color={color} />
      <View className="flex-1 gap-1">
        {title ? <Text className={cn('font-body-semibold', text)}>{title}</Text> : null}
        {typeof children === 'string' ? <Text className={cn('text-sm leading-5', text)}>{children}</Text> : children}
        {action ? <View className="mt-2">{action}</View> : null}
      </View>
    </View>
  );
}
