import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { cn } from '@/lib/cn';
import { COLORS, MAX_CONTENT_WIDTH } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  header?: ReactNode;
  /** Pinned below the content, e.g. a contact bar. */
  footer?: ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  maxWidth?: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  contentClassName?: string;
};

/** Safe-area page with a centred, width-capped column that works on phones, tablets and desktop. */
export function Screen({
  children,
  header,
  footer,
  scroll = true,
  edges = ['top'],
  maxWidth = MAX_CONTENT_WIDTH,
  onRefresh,
  isRefreshing = false,
  contentClassName,
}: ScreenProps) {
  const column = (
    <View
      style={{ width: '100%', maxWidth, alignSelf: 'center', paddingHorizontal: '5%' }}
      className={contentClassName}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView edges={edges} className="flex-1 bg-canvas">
      {header}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {scroll ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 120 }}
            refreshControl={
              onRefresh ? (
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                  tintColor={COLORS.brand[600]}
                  colors={[COLORS.brand[600]]}
                />
              ) : undefined
            }
          >
            {column}
          </ScrollView>
        ) : (
          <View className={cn('flex-1')}>{column}</View>
        )}
        {footer}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
