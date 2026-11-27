import {
  formatNaira,
  formatRelativeTime,
  messageOf,
  type Listing,
  type ListingStatus,
} from '@selit/shared';
import { router } from 'expo-router';
import { CheckCircle2, Eye, Package, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { PageTitle } from '@/components/layout/PageTitle';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { PressableScale } from '@/components/motion/PressableScale';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { Sheet } from '@/components/ui/Sheet';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatCard } from '@/components/ui/StatCard';
import { Text } from '@/components/ui/Text';
import { useSession } from '@/features/auth/session-store';
import { ListingImage } from '@/features/listings/components/ListingImage';
import { useDeleteListing, useListings, useUpdateListing } from '@/features/listings/hooks';
import { COLORS } from '@/theme';

type Filter = 'all' | 'active' | 'pending' | 'sold';

const STATUS: Record<ListingStatus, { tone: BadgeTone; label: string }> = {
  active: { tone: 'brand', label: 'Live' },
  pending: { tone: 'amber', label: 'In review' },
  sold: { tone: 'neutral', label: 'Sold' },
  rejected: { tone: 'danger', label: 'Not approved' },
  removed: { tone: 'danger', label: 'Removed' },
};

function ListingRow({ listing, onDelete }: { listing: Listing; onDelete: () => void }) {
  const update = useUpdateListing();
  const canToggle = listing.status === 'active' || listing.status === 'sold';
  const badge = STATUS[listing.status];

  return (
    <View className="gap-3 border-t border-line p-4">
      <PressableScale
        onPress={() => router.push(`/listing/${listing.id}`)}
        scaleTo={0.98}
        className="flex-row items-center gap-3"
      >
        <View className="size-16 overflow-hidden rounded-2xl bg-canvas">
          <ListingImage uri={listing.images[0]} category={listing.category} compact />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Badge tone={badge.tone}>{badge.label}</Badge>
            <Text className="text-xs text-ink-400">{formatRelativeTime(listing.createdAt)}</Text>
          </View>
          <Text numberOfLines={1} className="mt-1 font-body-semibold text-ink-900">
            {listing.title}
          </Text>
          <View className="mt-0.5 flex-row items-center gap-3">
            <Text className="font-body-semibold text-sm text-ink-800">
              {formatNaira(listing.price)}
            </Text>
            <View className="flex-row items-center gap-1">
              <Eye size={13} color={COLORS.ink[400]} />
              <Text className="text-sm text-ink-500">{listing.viewsCount}</Text>
            </View>
          </View>
        </View>
      </PressableScale>
      {listing.status === 'rejected' && listing.reviewReason ? (
        <Text className="text-sm text-danger-600">
          {listing.reviewReason}. Edit it and it goes back for review.
        </Text>
      ) : null}
      <View className="flex-row gap-2">
        {canToggle ? (
          <View className="flex-1">
            <Button
              size="sm"
              variant="secondary"
              isLoading={update.isPending}
              icon={
                listing.status === 'sold' ? (
                  <RotateCcw size={15} color={COLORS.ink[900]} />
                ) : (
                  <CheckCircle2 size={15} color={COLORS.ink[900]} />
                )
              }
              onPress={() =>
                update.mutate({
                  id: listing.id,
                  update: { status: listing.status === 'sold' ? 'active' : 'sold' },
                })
              }
            >
              {listing.status === 'sold' ? 'Relist' : 'Mark sold'}
            </Button>
          </View>
        ) : null}
        <IconButton
          accessibilityLabel={`Edit ${listing.title}`}
          className="size-10 rounded-xl"
          icon={<Pencil size={16} color={COLORS.ink[700]} />}
          onPress={() => router.push(`/sell/item?id=${listing.id}`)}
        />
        <IconButton
          accessibilityLabel={`Delete ${listing.title}`}
          className="size-10 rounded-xl"
          icon={<Trash2 size={16} color={COLORS.danger[600]} />}
          onPress={onDelete}
        />
      </View>
    </View>
  );
}

export default function MyListingsScreen() {
  const { user } = useSession();
  const { data, isPending, isError, error, refetch, isRefetching } = useListings(
    { sellerId: user?.id, status: 'all', limit: 100 },
    Boolean(user),
  );
  const remove = useDeleteListing();
  const [filter, setFilter] = useState<Filter>('all');
  const [toDelete, setToDelete] = useState<Listing | null>(null);
  const all = useMemo(() => data?.items ?? [], [data]);
  const shown = filter === 'all' ? all : all.filter((listing) => listing.status === filter);
  const views = all.reduce((sum, listing) => sum + listing.viewsCount, 0);

  return (
    <Screen header={<ScreenHeader />} onRefresh={() => void refetch()} isRefreshing={isRefetching}>
      <PageTitle
        title="My listings"
        description="Mark items as sold as soon as they go, so buyers don't message you for nothing."
        action={
          <IconButton
            accessibilityLabel="New listing"
            icon={<Plus size={20} color={COLORS.ink[900]} />}
            onPress={() => router.push('/sell/item')}
          />
        }
      />
      <View className="flex-row gap-3">
        <StatCard
          label="Live"
          value={all.filter((listing) => listing.status === 'active').length}
          icon={<Package size={16} color={COLORS.brand[700]} />}
        />
        <StatCard
          label="Total views"
          value={views}
          tone="info"
          icon={<Eye size={16} color={COLORS.info[700]} />}
        />
      </View>
      <SegmentedTabs
        className="mt-5"
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: 'All' },
          { value: 'active', label: 'Live' },
          { value: 'pending', label: 'Review' },
          { value: 'sold', label: 'Sold' },
        ]}
      />
      <View className="mt-4">
        {isPending ? (
          <Skeleton height={300} />
        ) : isError ? (
          <EmptyState
            icon={<Package size={24} color={COLORS.brand[700]} />}
            title="Couldn't load your listings"
            description={messageOf(error)}
          />
        ) : shown.length === 0 ? (
          <EmptyState
            icon={<Package size={24} color={COLORS.brand[700]} />}
            title={filter === 'all' ? 'No listings yet' : 'Nothing here'}
            description="Listing is free and takes about two minutes."
            action={<Button onPress={() => router.push('/sell/item')}>Sell an item</Button>}
          />
        ) : (
          <View className="overflow-hidden rounded-3xl bg-surface" style={{ borderTopWidth: 0 }}>
            {shown.map((listing) => (
              <ListingRow
                key={listing.id}
                listing={listing}
                onDelete={() => setToDelete(listing)}
              />
            ))}
          </View>
        )}
      </View>

      <Sheet
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Delete this listing?"
        description={toDelete?.title}
        footer={
          <>
            <View className="flex-1">
              <Button variant="secondary" onPress={() => setToDelete(null)}>
                Keep it
              </Button>
            </View>
            <View className="flex-1">
              <Button
                variant="danger"
                isLoading={remove.isPending}
                onPress={() =>
                  toDelete && remove.mutate(toDelete.id, { onSuccess: () => setToDelete(null) })
                }
              >
                Delete
              </Button>
            </View>
          </>
        }
      >
        <Text className="text-ink-600">
          It disappears for everyone, along with its photos. If it sold, mark it sold instead.
        </Text>
      </Sheet>
    </Screen>
  );
}
