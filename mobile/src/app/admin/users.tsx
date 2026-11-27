import { formatDate, messageOf, type AccountStatus, type AdminUser } from '@selit/shared';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { BadgeCheck, Search, Users } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { PageTitle } from '@/components/layout/PageTitle';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { PressableScale } from '@/components/motion/PressableScale';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { useAdminAction } from '@/features/admin/hooks';
import { useSession } from '@/features/auth/session-store';
import { getApi } from '@/lib/api';
import { COLORS, SHADOW } from '@/theme';

const STATUS_TONES = { active: 'brand', watchlist: 'amber', banned: 'danger' } as const;

function MemberRow({ member, isSelf }: { member: AdminUser; isSelf: boolean }) {
  const setStatus = useAdminAction((status: AccountStatus) =>
    getApi().admin.setUserStatus(member.id, status),
  );
  return (
    <View style={SHADOW.card} className="gap-3 rounded-3xl bg-surface p-4">
      <PressableScale
        onPress={() => router.push(`/seller/${member.id}`)}
        scaleTo={0.98}
        className="flex-row items-center gap-3"
      >
        <Avatar name={member.fullName} src={member.profileImageUrl} size="sm" />
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text numberOfLines={1} className="font-body-semibold text-ink-900">
              {member.fullName}
            </Text>
            {member.verificationStatus === 'verified' ? (
              <BadgeCheck size={14} color={COLORS.brand[600]} />
            ) : null}
          </View>
          <Text numberOfLines={1} className="text-xs text-ink-500">
            {member.email} · {member.role} · joined {formatDate(member.createdAt)}
          </Text>
        </View>
        <Badge tone={STATUS_TONES[member.status]}>{member.status}</Badge>
      </PressableScale>
      {!isSelf ? (
        <View className="flex-row gap-2">
          {member.status !== 'active' ? (
            <Button size="sm" variant="secondary" onPress={() => setStatus.mutate('active')}>
              Restore
            </Button>
          ) : (
            <Button size="sm" variant="secondary" onPress={() => setStatus.mutate('watchlist')}>
              Watch
            </Button>
          )}
          {member.status !== 'banned' ? (
            <Button size="sm" variant="danger" onPress={() => setStatus.mutate('banned')}>
              Ban
            </Button>
          ) : null}
        </View>
      ) : null}
      {setStatus.isError ? (
        <Text className="text-sm text-danger-600">{messageOf(setStatus.error)}</Text>
      ) : null}
    </View>
  );
}

export default function AdminUsersScreen() {
  const { user } = useSession();
  const [status, setStatus] = useState<AccountStatus | 'all'>('all');
  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');
  const { data, isPending, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['admin', 'users', status, search],
    queryFn: () =>
      getApi().admin.users({
        status: status === 'all' ? undefined : status,
        search: search || undefined,
        page: 1,
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <Screen header={<ScreenHeader />} onRefresh={() => void refetch()} isRefreshing={isRefetching}>
      <PageTitle
        title="Members"
        description="Banning hides everything a member posted and stops them signing in to act."
      />
      <TextField
        value={draft}
        onChangeText={setDraft}
        placeholder="Search name or email"
        returnKeyType="search"
        onSubmitEditing={() => setSearch(draft.trim())}
        leadingIcon={<Search size={18} color={COLORS.ink[400]} />}
      />
      <SegmentedTabs
        className="mb-4 mt-3"
        value={status}
        onChange={setStatus}
        options={[
          { value: 'all', label: 'All' },
          { value: 'watchlist', label: 'Watch' },
          { value: 'banned', label: 'Banned' },
        ]}
      />
      {isPending ? (
        <Skeleton height={300} />
      ) : isError ? (
        <EmptyState
          icon={<Users size={24} color={COLORS.brand[700]} />}
          title="Couldn't load members"
          description={messageOf(error)}
        />
      ) : data.items.length === 0 ? (
        <EmptyState icon={<Users size={24} color={COLORS.brand[700]} />} title="No members match" />
      ) : (
        <View className="gap-3">
          {data.items.map((member) => (
            <MemberRow key={member.id} member={member} isSelf={member.id === user?.id} />
          ))}
        </View>
      )}
    </Screen>
  );
}
