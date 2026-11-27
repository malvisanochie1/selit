import {
  formatRelativeTime,
  idTypeLabel,
  messageOf,
  type VerificationRequest,
} from '@selit/shared';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import {
  AlertTriangle,
  BadgeCheck,
  Check,
  IdCard,
  ScanFace,
  ShieldCheck,
  X,
} from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { PageTitle } from '@/components/layout/PageTitle';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { useAdminAction } from '@/features/admin/hooks';
import { getApi } from '@/lib/api';
import { COLORS, SHADOW } from '@/theme';

function Evidence({ uri, label, icon }: { uri: string; label: string; icon: React.ReactNode }) {
  return (
    <View className="w-32 gap-1">
      <View className="aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl bg-canvas">
        {uri ? (
          <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        ) : (
          icon
        )}
      </View>
      <Text className="text-xs font-body-semibold text-ink-600">{label}</Text>
    </View>
  );
}

function RequestCard({ request }: { request: VerificationRequest }) {
  const [note, setNote] = useState('');
  const decide = useAdminAction((decision: 'verified' | 'rejected') =>
    getApi().admin.decideVerification(request.id, decision, note),
  );

  return (
    <View style={SHADOW.card} className="gap-4 rounded-3xl bg-surface p-5">
      <View>
        <Text className="font-body-semibold text-ink-900">{request.fullName}</Text>
        <Text className="text-sm text-ink-500">
          {request.email} · {idTypeLabel(request.idType)} ending {request.idNumberLast4} ·{' '}
          {formatRelativeTime(request.submittedAt)}
        </Text>
      </View>
      {request.warning ? (
        <Badge tone="danger" icon={<AlertTriangle size={12} color={COLORS.danger[700]} />}>
          {request.warning}
        </Badge>
      ) : (
        <Badge>Compare the face and the name</Badge>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-3">
          <Evidence
            uri={request.idPhotoUrl}
            label="ID photo"
            icon={<IdCard size={28} color={COLORS.ink[300]} />}
          />
          {(request.selfieUrls.length ? request.selfieUrls : ['']).map((uri, index) => (
            <Evidence
              key={uri || index}
              uri={uri}
              label={`Selfie ${index + 1}`}
              icon={<ScanFace size={28} color={COLORS.ink[300]} />}
            />
          ))}
        </View>
      </ScrollView>
      <Text className="text-xs text-ink-500">
        Photos are deleted as soon as you approve or reject.
      </Text>
      <TextField
        value={note}
        onChangeText={setNote}
        maxLength={200}
        placeholder="Note to the member if you reject (optional)"
      />
      <View className="flex-row gap-2">
        <View className="flex-1">
          <Button
            variant="secondary"
            icon={<X size={16} color={COLORS.ink[900]} />}
            disabled={decide.isPending}
            onPress={() => decide.mutate('rejected')}
          >
            Reject
          </Button>
        </View>
        <View className="flex-1">
          <Button
            icon={<Check size={16} color="#fff" />}
            isLoading={decide.isPending}
            onPress={() => decide.mutate('verified')}
          >
            Approve
          </Button>
        </View>
      </View>
      {decide.isError ? (
        <Text className="text-sm text-danger-600">{messageOf(decide.error)}</Text>
      ) : null}
    </View>
  );
}

export default function AdminVerificationsScreen() {
  const { data, isPending, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['admin', 'verifications'],
    queryFn: () => getApi().admin.verifications(1),
  });

  return (
    <Screen header={<ScreenHeader />} onRefresh={() => void refetch()} isRefreshing={isRefetching}>
      <PageTitle
        title="Verifications"
        description="Approve only when the selfie clearly matches the ID and the names agree. When unsure, reject with a note."
      />
      {isPending ? (
        <Skeleton height={320} />
      ) : isError ? (
        <EmptyState
          icon={<ShieldCheck size={24} color={COLORS.brand[700]} />}
          title="Couldn't load the queue"
          description={messageOf(error)}
        />
      ) : data.items.length === 0 ? (
        <EmptyState
          icon={<BadgeCheck size={24} color={COLORS.brand[700]} />}
          title="Queue is empty"
          description="New identity checks appear here."
        />
      ) : (
        <View className="gap-4">
          {data.items.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </View>
      )}
    </Screen>
  );
}
