import {
  apartmentTypeLabel,
  daysSince,
  findSchoolByName,
  formatNaira,
  messageOf,
  RENEWAL_DAYS,
} from '@selit/shared';
import { router, useLocalSearchParams } from 'expo-router';
import {
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Flag,
  MapPin,
  RefreshCw,
  Share2,
  ThumbsUp,
  UserX,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Share, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Gallery } from '@/components/media/Gallery';
import { Appear } from '@/components/motion/Appear';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { Notice } from '@/components/ui/Notice';
import { Skeleton } from '@/components/ui/Skeleton';
import { Heading, Text } from '@/components/ui/Text';
import { env } from '@/config/env';
import { useApartment, useApartmentAction } from '@/features/apartments/hooks';
import { useSession } from '@/features/auth/session-store';
import { ContactActions } from '@/features/safety/components/ContactActions';
import { ReportSheet } from '@/features/safety/components/ReportSheet';
import { SafetyTips } from '@/features/safety/components/SafetyTips';
import { getApi } from '@/lib/api';
import { COLORS, SHADOW } from '@/theme';

export default function ApartmentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, isSignedIn } = useSession();
  const { data: apartment, isPending, isError, error, refetch, isRefetching } = useApartment(id);
  const action = useApartmentAction(id);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState<'confirm-real' | 'report-taken' | null>(null);

  useEffect(() => {
    void getApi().apartments.recordView(id);
  }, [id]);

  const link = `${env.siteUrl}/apartments/${id}`;
  const header = (
    <ScreenHeader
      actions={
        apartment ? (
          <IconButton
            accessibilityLabel="Share"
            icon={<Share2 size={18} color={COLORS.ink[900]} />}
            onPress={() =>
              void Share.share({
                message: `${apartment.title} · ${formatNaira(apartment.rentPerYear)}/year\n${link}`,
              })
            }
          />
        ) : undefined
      }
    />
  );

  if (isPending) {
    return (
      <Screen header={header}>
        <View className="gap-4">
          <Skeleton height={280} radius={28} />
          <Skeleton height={28} width="70%" />
          <Skeleton height={160} />
        </View>
      </Screen>
    );
  }

  if (isError || !apartment) {
    return (
      <Screen header={header}>
        <EmptyState
          className="mt-6"
          icon={<Building2 size={26} color={COLORS.brand[700]} />}
          title="This room isn't listed any more"
          description={messageOf(error)}
          action={<Button onPress={() => router.replace('/apartments')}>See other rooms</Button>}
        />
      </Screen>
    );
  }

  const isOwn = user?.id === apartment.agent.id;
  const renewedDays = daysSince(apartment.lastRenewedAt);
  const school = findSchoolByName(apartment.school);
  const firstYear = apartment.rentPerYear + apartment.agencyFee + apartment.cautionFee;
  const costs = [
    { label: 'Rent per year', value: apartment.rentPerYear },
    { label: 'Agency fee', value: apartment.agencyFee },
    { label: 'Caution fee (refundable)', value: apartment.cautionFee },
  ];

  function sendFeedback(kind: 'confirm-real' | 'report-taken') {
    if (!isSignedIn) return router.push('/sign-in');
    action.mutate(kind, { onSuccess: () => setFeedbackSent(kind) });
  }

  return (
    <Screen header={header} onRefresh={() => void refetch()} isRefreshing={isRefetching}>
      <Appear>
        <Gallery
          images={apartment.images}
          aspect={4 / 3}
          fallback={
            <View className="flex-1 items-center justify-center bg-brand-50">
              <Building2 size={40} color={COLORS.brand[600]} strokeWidth={1.5} />
            </View>
          }
        />
      </Appear>

      <Appear index={1} className="mt-5">
        <View className="flex-row flex-wrap gap-2">
          <Badge tone={apartment.status === 'available' ? 'brand' : 'neutral'}>
            {apartment.status === 'available'
              ? 'Available'
              : apartment.status === 'taken'
                ? 'Taken'
                : 'In review'}
          </Badge>
          {apartment.isConfirmed ? (
            <Badge tone="info" icon={<BadgeCheck size={12} color={COLORS.info[700]} />}>
              Confirmed by Selit
            </Badge>
          ) : null}
          <Badge>{apartmentTypeLabel(apartment.type)}</Badge>
        </View>
        <Heading className="mt-3 text-3xl leading-9">{apartment.title}</Heading>
        <View className="mt-2 flex-row items-baseline gap-1.5">
          <Text className="font-display-bold text-4xl text-brand-700">
            {formatNaira(apartment.rentPerYear)}
          </Text>
          <Text className="text-ink-500">/ year</Text>
        </View>
        <View className="mt-3 flex-row items-center gap-1.5">
          <MapPin size={15} color={COLORS.ink[400]} />
          <Text className="flex-1 text-sm text-ink-600">
            {apartment.area} · {apartment.distanceToCampus}
            {school ? ` · ${school.shortName || school.name}` : ''}
          </Text>
        </View>
        <View className="mt-2 flex-row items-center gap-1.5">
          <Clock
            size={15}
            color={renewedDays > RENEWAL_DAYS - 3 ? COLORS.amber[600] : COLORS.brand[600]}
          />
          <Text className="text-sm text-ink-600">
            {renewedDays === 0
              ? 'Agent confirmed it is free today'
              : `Agent confirmed it is free ${renewedDays}d ago`}
            {apartment.visitorConfirmations
              ? ` · ${apartment.visitorConfirmations} visitors say it's real`
              : ''}
          </Text>
        </View>
      </Appear>

      <View style={SHADOW.card} className="mt-6 rounded-3xl bg-surface p-5">
        <Text className="font-display text-lg text-ink-900">What you pay</Text>
        <View className="mt-3 gap-2.5">
          {costs.map((cost) => (
            <View key={cost.label} className="flex-row justify-between">
              <Text className="text-sm text-ink-600">{cost.label}</Text>
              <Text className="font-body-semibold text-sm text-ink-900">
                {cost.value ? formatNaira(cost.value) : 'None'}
              </Text>
            </View>
          ))}
          <View className="mt-1 flex-row justify-between border-t border-line pt-3">
            <Text className="font-body-semibold text-ink-900">First year in total</Text>
            <Text className="font-display-bold text-lg text-ink-900">{formatNaira(firstYear)}</Text>
          </View>
        </View>
      </View>

      <View className="mt-5 flex-row items-center gap-3 rounded-3xl border border-line bg-surface p-4">
        <Avatar name={apartment.agent.fullName} src={apartment.agent.profileImageUrl} />
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text numberOfLines={1} className="font-body-semibold text-ink-900">
              {apartment.agent.fullName}
            </Text>
            {apartment.agent.isVerified ? (
              <BadgeCheck size={16} color={COLORS.brand[600]} accessibilityLabel="Verified" />
            ) : null}
          </View>
          <Text className="text-xs text-ink-500">
            {apartment.agent.agencyName || 'Agent'} ·{' '}
            {apartment.agent.isVerified ? 'ID verified' : 'Not verified yet'}
          </Text>
        </View>
      </View>

      <View className="mt-5">
        {isOwn ? (
          <View className="gap-3">
            <Notice title="Keep it fresh">
              {`Tap “Still available” at least every ${RENEWAL_DAYS} days, or the room stops showing to students.`}
            </Notice>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Button
                  icon={<RefreshCw size={16} color="#fff" />}
                  isLoading={action.isPending && action.variables === 'renew'}
                  onPress={() => action.mutate('renew')}
                >
                  Still available
                </Button>
              </View>
              <View className="flex-1">
                <Button
                  variant="secondary"
                  icon={<Check size={16} color={COLORS.ink[900]} />}
                  onPress={() =>
                    action.mutate(apartment.status === 'taken' ? 'mark-available' : 'mark-taken')
                  }
                >
                  {apartment.status === 'taken' ? 'Available again' : 'Mark taken'}
                </Button>
              </View>
            </View>
          </View>
        ) : (
          <ContactActions
            phone={apartment.agent.whatsApp}
            isSignedIn={isSignedIn}
            message={`Hi ${apartment.agent.fullName.split(' ')[0]}, I saw "${apartment.title}" on Selit for ${formatNaira(apartment.rentPerYear)}/year. Is it still available? When can I inspect it?`}
          />
        )}
        {action.isError ? (
          <Text className="mt-2 text-sm text-danger-600">{messageOf(action.error)}</Text>
        ) : null}
      </View>

      <View className="mt-6 rounded-3xl border border-line bg-surface p-5">
        <Text className="font-display text-lg text-ink-900">About this room</Text>
        <Text className="mt-2 leading-6 text-ink-700">{apartment.description}</Text>
        {apartment.amenities.length ? (
          <View className="mt-4 flex-row flex-wrap gap-2 border-t border-line pt-4">
            {apartment.amenities.map((amenity) => (
              <View
                key={amenity}
                className="flex-row items-center gap-1.5 rounded-full bg-canvas px-3 py-1.5"
              >
                <CheckCircle2 size={14} color={COLORS.brand[600]} />
                <Text className="text-sm text-ink-700">{amenity}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      {!isOwn ? (
        <View className="mt-5 gap-3">
          <View className="rounded-3xl bg-canvas">
            <Text className="mb-3 font-body-semibold text-ink-900">Inspected this room?</Text>
            {feedbackSent ? (
              <Notice tone="success">Thanks. Your answer helps the next student.</Notice>
            ) : (
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<ThumbsUp size={16} color={COLORS.ink[900]} />}
                    onPress={() => sendFeedback('confirm-real')}
                  >
                    It&apos;s real
                  </Button>
                </View>
                <View className="flex-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<UserX size={16} color={COLORS.ink[900]} />}
                    onPress={() => sendFeedback('report-taken')}
                  >
                    Already taken
                  </Button>
                </View>
              </View>
            )}
          </View>
          <SafetyTips variant="apartment" />
          <Button
            variant="ghost"
            icon={<Flag size={16} color={COLORS.danger[600]} />}
            onPress={() => setIsReportOpen(true)}
          >
            <Text className="font-body-semibold text-danger-600">Report this listing</Text>
          </Button>
        </View>
      ) : null}

      <ReportSheet
        open={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetType="apartment"
        targetId={apartment.id}
        targetLabel={apartment.title}
      />
    </Screen>
  );
}
