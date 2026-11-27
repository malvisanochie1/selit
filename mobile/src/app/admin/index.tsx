import { useQuery } from '@tanstack/react-query';
import { router, type Href } from 'expo-router';
import {
  BadgeCheck,
  Building2,
  ChevronRight,
  Clock,
  Flag,
  Package,
  Shapes,
  Users,
} from 'lucide-react-native';
import { View } from 'react-native';

import { PageTitle } from '@/components/layout/PageTitle';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Appear } from '@/components/motion/Appear';
import { PressableScale } from '@/components/motion/PressableScale';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatCard } from '@/components/ui/StatCard';
import { Text } from '@/components/ui/Text';
import { getApi } from '@/lib/api';
import { COLORS, SHADOW } from '@/theme';

const QUEUES = [
  { href: '/admin/listings', icon: Clock, title: 'Listings to review', count: 'pendingListings' },
  {
    href: '/admin/apartments',
    icon: Building2,
    title: 'Apartments to review',
    count: 'pendingApartments',
  },
  {
    href: '/admin/verifications',
    icon: BadgeCheck,
    title: 'Identity checks',
    count: 'pendingVerifications',
  },
  { href: '/admin/reports', icon: Flag, title: 'Open reports', count: 'openReports' },
] as const;

const MANAGE: { href: Href; icon: typeof Users; title: string }[] = [
  { href: '/admin/users', icon: Users, title: 'Members' },
  { href: '/admin/categories', icon: Shapes, title: 'Categories' },
];

export default function AdminOverviewScreen() {
  const {
    data: stats,
    isPending,
    refetch,
    isRefetching,
  } = useQuery({ queryKey: ['admin', 'stats'], queryFn: () => getApi().admin.stats() });

  return (
    <Screen header={<ScreenHeader />} onRefresh={() => void refetch()} isRefreshing={isRefetching}>
      <PageTitle
        title="Admin"
        description="Keep Selit safe and tidy. Clear the review queues first."
      />
      {isPending || !stats ? (
        <Skeleton height={220} />
      ) : (
        <View className="gap-3">
          <View className="flex-row gap-3">
            <StatCard
              label="Members"
              value={stats.members}
              tone="info"
              icon={<Users size={16} color={COLORS.info[700]} />}
            />
            <StatCard
              label="Verified"
              value={stats.verified}
              icon={<BadgeCheck size={16} color={COLORS.brand[700]} />}
            />
          </View>
          <View className="flex-row gap-3">
            <StatCard
              label="Live listings"
              value={stats.activeListings}
              icon={<Package size={16} color={COLORS.brand[700]} />}
            />
            <StatCard
              label="Apartments"
              value={stats.availableApartments}
              tone="amber"
              icon={<Building2 size={16} color={COLORS.amber[700]} />}
            />
          </View>
        </View>
      )}

      <Text className="mb-2 mt-8 px-1 font-body-bold text-xs uppercase tracking-widest text-ink-400">
        Review queues
      </Text>
      <View className="gap-3">
        {QUEUES.map((queue, index) => (
          <Appear key={queue.href} index={index}>
            <PressableScale
              onPress={() => router.push(queue.href)}
              innerStyle={SHADOW.card}
              scaleTo={0.98}
              className="flex-row items-center gap-4 rounded-3xl bg-surface p-4"
            >
              <View className="size-11 items-center justify-center rounded-2xl bg-brand-50">
                <queue.icon size={20} color={COLORS.brand[700]} />
              </View>
              <Text className="flex-1 font-body-semibold text-ink-900">{queue.title}</Text>
              <Text className="font-display-bold text-2xl text-ink-900">
                {stats ? stats[queue.count] : '–'}
              </Text>
              <ChevronRight size={18} color={COLORS.ink[300]} />
            </PressableScale>
          </Appear>
        ))}
      </View>

      <Text className="mb-2 mt-8 px-1 font-body-bold text-xs uppercase tracking-widest text-ink-400">
        Manage
      </Text>
      <View className="flex-row gap-3">
        {MANAGE.map((item) => (
          <View key={item.title} className="flex-1">
            <PressableScale
              onPress={() => router.push(item.href)}
              innerStyle={SHADOW.card}
              className="items-start gap-3 rounded-3xl bg-surface p-4"
            >
              <item.icon size={20} color={COLORS.ink[700]} />
              <Text className="font-body-semibold text-ink-900">{item.title}</Text>
            </PressableScale>
          </View>
        ))}
      </View>
    </Screen>
  );
}
