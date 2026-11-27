import {
  findSchoolByName,
  formatNaira,
  formatRelativeTime,
  messageOf,
  type ModeratedListingStatus,
} from '@selit/shared';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Check, Package, Trash2, X } from 'lucide-react-native';
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
import { ListingImage } from '@/features/listings/components/ListingImage';
import { getApi } from '@/lib/api';
import { COLORS, SHADOW } from '@/theme';

type Filter = ModeratedListingStatus | 'all';
const FILTERS: { value: Filter; label: string }[] = [
  { value: 'pending', label: 'Awaiting review' },
  { value: 'active', label: 'Live' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'removed', label: 'Removed' },
  { value: 'all', label: 'All' },
];
const TONES = {
  active: 'brand',
  pending: 'amber',
  rejected: 'danger',
  removed: 'danger',
  sold: 'neutral',
} as const;

export default function AdminListingsScreen() {
  const [status, setStatus] = useState<Filter>('pending');
  const { data, isPending, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['admin', 'listings', status],
    queryFn: () => getApi().admin.listings(status, 1),
    placeholderData: keepPreviousData,
  });
  const moderate = useAdminAction(({ id, next }: { id: string; next: ModeratedListingStatus }) =>
    getApi().admin.setListingStatus(id, next),
  );

  return (
    <Screen header={<ScreenHeader />} onRefresh={() => void refetch()} isRefreshing={isRefetching}>
      <PageTitle
        title="Listings"
        description="Approve real items, reject bait and remove anything that breaks the rules."
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
          icon={<Package size={24} color={COLORS.brand[700]} />}
          title="Couldn't load listings"
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
          {data.items.map((listing) => (
            <View key={listing.id} style={SHADOW.card} className="gap-3 rounded-3xl bg-surface p-4">
              <PressableScale
                onPress={() => router.push(`/listing/${listing.id}`)}
                scaleTo={0.98}
                className="flex-row items-center gap-3"
              >
                <View className="size-16 overflow-hidden rounded-2xl bg-canvas">
                  <ListingImage uri={listing.images[0]} category={listing.category} compact />
                </View>
                <View className="flex-1">
                  <Badge tone={TONES[listing.status]}>{listing.status}</Badge>
                  <Text numberOfLines={1} className="mt-1 font-body-semibold text-ink-900">
                    {listing.title}
                  </Text>
                  <Text numberOfLines={1} className="text-xs text-ink-500">
                    {formatNaira(listing.price)} · {listing.seller?.fullName ?? 'Unknown'} ·{' '}
                    {findSchoolByName(listing.school)?.shortName || listing.school} ·{' '}
                    {formatRelativeTime(listing.createdAt)}
                  </Text>
                </View>
              </PressableScale>
              {listing.reviewReason ? (
                <Text className="text-sm text-amber-700">Flagged: {listing.reviewReason}</Text>
              ) : null}
              <View className="flex-row flex-wrap gap-2">
                {listing.status !== 'active' ? (
                  <Button
                    size="sm"
                    icon={<Check size={15} color="#fff" />}
                    onPress={() => moderate.mutate({ id: listing.id, next: 'active' })}
                  >
                    Approve
                  </Button>
                ) : null}
                {listing.status === 'pending' ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={<X size={15} color={COLORS.ink[900]} />}
                    onPress={() => moderate.mutate({ id: listing.id, next: 'rejected' })}
                  >
                    Reject
                  </Button>
                ) : null}
                {listing.status !== 'removed' ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<Trash2 size={15} color={COLORS.danger[600]} />}
                    onPress={() => moderate.mutate({ id: listing.id, next: 'removed' })}
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
