import {
  apartmentTypeLabel,
  formatNaira,
  formatRelativeTime,
  messageOf,
  type ApartmentStatus,
} from '@selit/shared';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { BadgeCheck, Building2, Check, Trash2, X } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { PageTitle } from '@/components/layout/PageTitle';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { PressableScale } from '@/components/motion/PressableScale';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { useAdminAction } from '@/features/admin/hooks';
import { getApi } from '@/lib/api';
import { COLORS, SHADOW } from '@/theme';

type Filter = ApartmentStatus | 'all';
const FILTERS: { value: Filter; label: string }[] = [
  { value: 'pending', label: 'Awaiting review' },
  { value: 'available', label: 'Available' },
  { value: 'taken', label: 'Taken' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'all', label: 'All' },
];
const TONES = {
  available: 'brand',
  pending: 'amber',
  taken: 'neutral',
  rejected: 'danger',
  removed: 'danger',
} as const;

type Decision = { id: string; next: ApartmentStatus; confirmed?: boolean };

export default function AdminApartmentsScreen() {
  const [status, setStatus] = useState<Filter>('pending');
  const { data, isPending, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['admin', 'apartments', status],
    queryFn: () => getApi().admin.apartments(status, 1),
    placeholderData: keepPreviousData,
  });
  const moderate = useAdminAction(({ id, next, confirmed }: Decision) =>
    getApi().admin.setApartmentStatus(id, next, confirmed),
  );

  return (
    <Screen header={<ScreenHeader />} onRefresh={() => void refetch()} isRefreshing={isRefetching}>
      <PageTitle
        title="Apartments"
        description="Approve only when the photos look real and the agent is verified. Confirm after a visit or a call."
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row gap-2">
          {FILTERS.map((filter) => (
            <Chip
              key={filter.value}
              label={filter.label}
              isActive={status === filter.value}
              onPress={() => setStatus(filter.value)}
            />
          ))}
        </View>
      </ScrollView>
      {moderate.isError ? (
        <Text className="mb-3 text-sm text-danger-600">{messageOf(moderate.error)}</Text>
      ) : null}
      {isPending ? (
        <Skeleton height={300} />
      ) : isError ? (
        <EmptyState
          icon={<Building2 size={24} color={COLORS.brand[700]} />}
          title="Couldn't load apartments"
          description={messageOf(error)}
        />
      ) : data.items.length === 0 ? (
        <EmptyState
          icon={<Check size={24} color={COLORS.brand[700]} />}
          title="All clear"
          description="Nothing in this queue right now."
        />
      ) : (
        <View className="gap-3">
          {data.items.map((apartment) => (
            <View
              key={apartment.id}
              style={SHADOW.card}
              className="gap-3 rounded-3xl bg-surface p-4"
            >
              <PressableScale
                onPress={() => router.push(`/apartment/${apartment.id}`)}
                scaleTo={0.98}
                className="flex-row items-center gap-3"
              >
                <View className="size-16 overflow-hidden rounded-2xl bg-brand-50">
                  {apartment.images[0] ? (
                    <Image
                      source={{ uri: apartment.images[0] }}
                      style={{ width: '100%', height: '100%' }}
                      contentFit="cover"
                    />
                  ) : null}
                </View>
                <View className="flex-1">
                  <View className="flex-row gap-1.5">
                    <Badge tone={TONES[apartment.status]}>{apartment.status}</Badge>
                    {apartment.isConfirmed ? <Badge tone="info">Confirmed</Badge> : null}
                  </View>
                  <Text numberOfLines={1} className="mt-1 font-body-semibold text-ink-900">
                    {apartment.title}
                  </Text>
                  <View className="flex-row items-center gap-1">
                    <Text numberOfLines={1} className="flex-1 text-xs text-ink-500">
                      {formatNaira(apartment.rentPerYear)} · {apartmentTypeLabel(apartment.type)} ·{' '}
                      {apartment.agent.fullName} · {formatRelativeTime(apartment.createdAt)}
                    </Text>
                    {apartment.agent.isVerified ? (
                      <BadgeCheck size={14} color={COLORS.brand[600]} />
                    ) : null}
                  </View>
                </View>
              </PressableScale>
              <View className="flex-row flex-wrap gap-2">
                {apartment.status === 'pending' || apartment.status === 'rejected' ? (
                  <Button
                    size="sm"
                    icon={<Check size={15} color="#fff" />}
                    onPress={() => moderate.mutate({ id: apartment.id, next: 'available' })}
                  >
                    Approve
                  </Button>
                ) : null}
                {apartment.status === 'available' && !apartment.isConfirmed ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={<BadgeCheck size={15} color={COLORS.ink[900]} />}
                    onPress={() =>
                      moderate.mutate({ id: apartment.id, next: 'available', confirmed: true })
                    }
                  >
                    Confirm
                  </Button>
                ) : null}
                {apartment.status === 'pending' ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={<X size={15} color={COLORS.ink[900]} />}
                    onPress={() => moderate.mutate({ id: apartment.id, next: 'rejected' })}
                  >
                    Reject
                  </Button>
                ) : null}
                {apartment.status !== 'removed' ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<Trash2 size={15} color={COLORS.danger[600]} />}
                    onPress={() => moderate.mutate({ id: apartment.id, next: 'removed' })}
                  >
                    <Text className="font-body-semibold text-sm text-danger-600">Remove</Text>
                  </Button>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}
