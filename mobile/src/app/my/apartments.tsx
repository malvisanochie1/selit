import {
  apartmentTypeLabel,
  daysUntilRenewal,
  formatNaira,
  messageOf,
  type Apartment,
} from '@selit/shared';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Building2, CheckCircle2, Eye, Plus, RefreshCw, RotateCcw } from 'lucide-react-native';
import { View } from 'react-native';

import { PageTitle } from '@/components/layout/PageTitle';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { PressableScale } from '@/components/motion/PressableScale';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { useApartmentAction, useApartments } from '@/features/apartments/hooks';
import { useSession } from '@/features/auth/session-store';
import { cn } from '@/lib/cn';
import { COLORS, SHADOW } from '@/theme';

const STATUS: Record<Apartment['status'], { tone: BadgeTone; label: string }> = {
  available: { tone: 'brand', label: 'Available' },
  pending: { tone: 'amber', label: 'In review' },
  taken: { tone: 'neutral', label: 'Taken' },
  rejected: { tone: 'danger', label: 'Not approved' },
  removed: { tone: 'danger', label: 'Removed' },
};

function ApartmentRow({ apartment }: { apartment: Apartment }) {
  const action = useApartmentAction(apartment.id);
  const daysLeft = daysUntilRenewal(apartment.lastRenewedAt);
  const isLive = apartment.status === 'available' || apartment.status === 'taken';
  const badge = STATUS[apartment.status];

  return (
    <View style={SHADOW.card} className="gap-3 rounded-3xl bg-surface p-4">
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
          <View className="flex-row flex-wrap items-center gap-2">
            <Badge tone={badge.tone}>{badge.label}</Badge>
            {isLive ? (
              <Text
                className={cn(
                  'text-xs',
                  daysLeft <= 3 ? 'font-body-semibold text-danger-600' : 'text-ink-400',
                )}
              >
                {daysLeft === 0 ? 'Hidden until you confirm' : `Confirm within ${daysLeft}d`}
              </Text>
            ) : null}
          </View>
          <Text numberOfLines={1} className="mt-1 font-body-semibold text-ink-900">
            {apartment.title}
          </Text>
          <View className="mt-0.5 flex-row items-center gap-3">
            <Text className="font-body-semibold text-sm text-ink-800">
              {formatNaira(apartment.rentPerYear)}/yr
            </Text>
            <Text className="text-sm text-ink-500">{apartmentTypeLabel(apartment.type)}</Text>
            <View className="flex-row items-center gap-1">
              <Eye size={13} color={COLORS.ink[400]} />
              <Text className="text-sm text-ink-500">{apartment.viewsCount}</Text>
            </View>
          </View>
        </View>
      </PressableScale>
      {isLive ? (
        <View className="flex-row gap-2">
          <View className="flex-1">
            <Button
              size="sm"
              icon={<RefreshCw size={15} color="#fff" />}
              isLoading={action.isPending && action.variables === 'renew'}
              onPress={() => action.mutate('renew')}
            >
              Still available
            </Button>
          </View>
          <View className="flex-1">
            <Button
              size="sm"
              variant="secondary"
              icon={
                apartment.status === 'taken' ? (
                  <RotateCcw size={15} color={COLORS.ink[900]} />
                ) : (
                  <CheckCircle2 size={15} color={COLORS.ink[900]} />
                )
              }
              onPress={() =>
                action.mutate(apartment.status === 'taken' ? 'mark-available' : 'mark-taken')
              }
            >
              {apartment.status === 'taken' ? 'Available again' : 'Mark taken'}
            </Button>
          </View>
        </View>
      ) : null}
      {action.isError ? (
        <Text className="text-sm text-danger-600">{messageOf(action.error)}</Text>
      ) : null}
    </View>
  );
}

/** Agents confirm each room every 14 days, or it drops out of the feed. */
export default function MyApartmentsScreen() {
  const { user } = useSession();
  const { data, isPending, isError, error, refetch, isRefetching } = useApartments(
    { agentId: user?.id, includeAll: true, limit: 50 },
    Boolean(user),
  );

  return (
    <Screen header={<ScreenHeader />} onRefresh={() => void refetch()} isRefreshing={isRefetching}>
      <PageTitle
        title="My apartments"
        description="Tap “Still available” at least every 14 days so students only see rooms that are really free."
        action={
          <IconButton
            accessibilityLabel="List a room"
            icon={<Plus size={20} color={COLORS.ink[900]} />}
            onPress={() => router.push('/sell/apartment')}
          />
        }
      />
      {isPending ? (
        <Skeleton height={240} />
      ) : isError ? (
        <EmptyState
          icon={<Building2 size={24} color={COLORS.brand[700]} />}
          title="Couldn't load your apartments"
          description={messageOf(error)}
        />
      ) : data.items.length === 0 ? (
        <EmptyState
          icon={<Building2 size={24} color={COLORS.brand[700]} />}
          title="No apartments yet"
          description="Verified agents and landlords can list rooms near any school."
          action={<Button onPress={() => router.push('/sell/apartment')}>List a room</Button>}
        />
      ) : (
        <View className="gap-3">
          {data.items.map((apartment) => (
            <ApartmentRow key={apartment.id} apartment={apartment} />
          ))}
        </View>
      )}
    </Screen>
  );
}
