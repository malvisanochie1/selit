import { findCategory, messageOf } from '@selit/shared';
import { useQuery } from '@tanstack/react-query';
import { Pause, Play, Shapes } from 'lucide-react-native';
import { View } from 'react-native';

import { PageTitle } from '@/components/layout/PageTitle';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { useAdminAction } from '@/features/admin/hooks';
import { CATEGORY_ICONS, CATEGORY_TONES } from '@/features/listings/category-style';
import { getApi } from '@/lib/api';
import { cn } from '@/lib/cn';
import { COLORS, SHADOW } from '@/theme';

export default function AdminCategoriesScreen() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => getApi().admin.categoryStats(),
  });
  const toggle = useAdminAction(({ slug, paused }: { slug: string; paused: boolean }) =>
    getApi().admin.setCategoryStatus(slug, paused ? 'active' : 'paused'),
  );
  const max = Math.max(1, ...(data ?? []).map((category) => category.total));

  return (
    <Screen header={<ScreenHeader />}>
      <PageTitle
        title="Categories"
        description="See where listings are, and pause a category if it is being abused."
      />
      {isPending ? (
        <Skeleton height={400} />
      ) : isError ? (
        <EmptyState
          icon={<Shapes size={24} color={COLORS.brand[700]} />}
          title="Couldn't load categories"
          description={messageOf(error)}
        />
      ) : (
        <View style={SHADOW.card} className="overflow-hidden rounded-3xl bg-surface">
          {data.map((category, index) => {
            const match = findCategory(category.slug);
            const Icon = CATEGORY_ICONS[match?.icon ?? 'Shapes'];
            const tone = CATEGORY_TONES[match?.tone ?? 'brand'];
            const isPaused = category.status === 'paused';
            return (
              <View
                key={category.slug}
                className={cn(
                  'flex-row items-center gap-3 p-4',
                  index > 0 && 'border-t border-line',
                )}
              >
                <View className={cn('size-10 items-center justify-center rounded-xl', tone.box)}>
                  <Icon size={18} color={tone.color} />
                </View>
                <View className="flex-1 gap-1.5">
                  <View className="flex-row items-center gap-2">
                    <Text className="font-body-semibold text-ink-900">{category.name}</Text>
                    {isPaused ? <Badge tone="amber">Paused</Badge> : null}
                  </View>
                  <View className="h-1.5 overflow-hidden rounded-full bg-ink-100">
                    <View
                      style={{ width: `${(category.total / max) * 100}%` }}
                      className="h-full rounded-full bg-brand-500"
                    />
                  </View>
                  <Text className="text-xs text-ink-500">
                    {category.total} listings · {category.active} live · {category.pending} in
                    review
                  </Text>
                </View>
                <IconButton
                  accessibilityLabel={
                    isPaused ? `Reopen ${category.name}` : `Pause ${category.name}`
                  }
                  icon={
                    isPaused ? (
                      <Play size={16} color={COLORS.brand[700]} />
                    ) : (
                      <Pause size={16} color={COLORS.ink[700]} />
                    )
                  }
                  onPress={() => toggle.mutate({ slug: category.slug, paused: isPaused })}
                />
              </View>
            );
          })}
        </View>
      )}
    </Screen>
  );
}
