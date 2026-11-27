import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/cn';

export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" accessibilityElementsHidden>
      <Defs>
        <LinearGradient id="selit-bag" x1="6" y1="12" x2="34" y2="36" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#8ee05b" />
          <Stop offset="0.45" stopColor="#3fb962" />
          <Stop offset="1" stopColor="#126f32" />
        </LinearGradient>
      </Defs>
      <Path d="M14 14v-3a6 6 0 0 1 12 0v3" fill="none" stroke="#0d1b34" strokeWidth={2.6} strokeLinecap="round" />
      <Rect x="6" y="12.5" width="28" height="23.5" rx="7.5" fill="url(#selit-bag)" />
      <Path
        d="M24.6 19.6c-1-1.4-2.6-2.2-4.5-2.2-2.6 0-4.3 1.4-4.3 3.3 0 4.6 9.1 2.6 9.1 7.4 0 2-1.9 3.5-4.8 3.5-2.1 0-3.9-.8-5-2.4"
        fill="none"
        stroke="#fff"
        strokeWidth={2.8}
        strokeLinecap="round"
      />
      <Circle cx="31.5" cy="10.5" r="3" fill="#f5b21b" />
    </Svg>
  );
}

export function Logo({ tone = 'dark', size = 34 }: { tone?: 'dark' | 'light'; size?: number }) {
  return (
    <View className="flex-row items-center gap-2" accessibilityLabel="Selit">
      <LogoMark size={size} />
      <Text
        style={{ fontSize: size * 0.78, letterSpacing: -1 }}
        className={cn('font-display-bold', tone === 'dark' ? 'text-ink-900' : 'text-white')}
      >
        Selit
      </Text>
    </View>
  );
}
