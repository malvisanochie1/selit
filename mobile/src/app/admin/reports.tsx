import {
  formatRelativeTime,
  messageOf,
  reportReasonLabel,
  type Report,
  type ReportStatus,
  type ReportTarget,
} from '@selit/shared';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Check, Flag, Search, X } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { PageTitle } from '@/components/layout/PageTitle';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { PressableScale } from '@/components/motion/PressableScale';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { useAdminAction } from '@/features/admin/hooks';
import { getApi } from '@/lib/api';
import { COLORS, SHADOW } from '@/theme';

const TONES = {
  open: 'danger',
  reviewing: 'amber',
  actioned: 'brand',
  dismissed: 'neutral',
} as const;

function targetHref(report: Report) {
  if (report.targetType === 'listing') return `/listing/${report.targetId}` as const;
  if (report.targetType === 'apartment') return `/apartment/${report.targetId}` as const;
  return `/seller/${report.targetId}` as const;
}

export default function AdminReportsScreen() {
  const [target, setTarget] = useState<ReportTarget>('listing');
  const [status, setStatus] = useState<ReportStatus | 'all'>('open');
  const { data, isPending, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['admin', 'reports', target, status],
    queryFn: () =>
      getApi().admin.reports({ target, status: status === 'all' ? undefined : status, page: 1 }),
    placeholderData: keepPreviousData,
  });
  const update = useAdminAction(({ report, next }: { report: Report; next: ReportStatus }) =>
    getApi().admin.setReportStatus(report, next),
  );

  return (
    <Screen header={<ScreenHeader />} onRefresh={() => void refetch()} isRefreshing={isRefetching}>
      <PageTitle
        title="Reports"
        description="Three open reports take a listing off the feed until you decide."
      />
      <SegmentedTabs
        value={target}
        onChange={setTarget}
        options={[
          { value: 'listing', label: 'Listings' },
          { value: 'apartment', label: 'Rooms' },
          { value: 'user', label: 'Members' },
        ]}
      />
      <SegmentedTabs
        className="mb-4 mt-2"
        value={status}
        onChange={setStatus}
        options={[
          { value: 'open', label: 'Open' },
          { value: 'reviewing', label: 'Reviewing' },
          { value: 'all', label: 'All' },
        ]}
      />
      {isPending ? (
        <Skeleton height={300} />
      ) : isError ? (
        <EmptyState
          icon={<Flag size={24} color={COLORS.brand[700]} />}
          title="Couldn't load reports"
          description={messageOf(error)}
        />
      ) : data.items.length === 0 ? (
        <EmptyState
          icon={<Check size={24} color={COLORS.brand[700]} />}
          title="No reports here"
          description="Nothing needs your attention."
        />
      ) : (
        <View className="gap-3">
          {data.items.map((report) => (
            <View key={report.id} style={SHADOW.card} className="gap-3 rounded-3xl bg-surface p-4">
              <PressableScale onPress={() => router.push(targetHref(report))} scaleTo={0.98}>
                <View className="flex-row items-center gap-2">
                  <Badge tone={TONES[report.status]}>{report.status}</Badge>
                  <Text className="text-xs text-ink-400">
                    by {report.reporterName} · {formatRelativeTime(report.createdAt)}
                  </Text>
                </View>
                <Text numberOfLines={1} className="mt-2 font-body-semibold text-ink-900">
                  {report.targetTitle}
                </Text>
                <Text className="mt-0.5 text-sm text-danger-600">
                  {reportReasonLabel(report.reason)}
                </Text>
                {report.details ? (
                  <Text className="mt-1 text-sm leading-5 text-ink-600">“{report.details}”</Text>
                ) : null}
              </PressableScale>
              <View className="flex-row flex-wrap gap-2">
                {report.status === 'open' ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={<Search size={15} color={COLORS.ink[900]} />}
                    onPress={() => update.mutate({ report, next: 'reviewing' })}
                  >
                    Reviewing
                  </Button>
                ) : null}
                <Button
                  size="sm"
                  icon={<Check size={15} color="#fff" />}
                  onPress={() => update.mutate({ report, next: 'actioned' })}
                >
                  Actioned
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  icon={<X size={15} color={COLORS.ink[600]} />}
                  onPress={() => update.mutate({ report, next: 'dismissed' })}
                >
                  Dismiss
                </Button>
              </View>
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}
