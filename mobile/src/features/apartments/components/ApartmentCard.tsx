import { apartmentTypeLabel, daysSince, findSchoolByName, formatNaira, type Apartment } from '@selit/shared';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { BadgeCheck, Building2, Clock, MapPin } from 'lucide-react-native';
import { memo } from 'react';
import { View } from 'react-native';

import { PressableScale } from '@/components/motion/PressableScale';
import { Badge } from '@/components/ui/Badge';
import { Text } from '@/components/ui/Text';
import { COLORS, SHADOW } from '@/theme';

function ApartmentCardBase({ apartment }: { apartment: Apartment }) {
  const renewedDays = daysSince(apartment.lastRenewedAt);
  const school = findSchoolByName(apartment.school);
  return (
    <PressableScale
      onPress={() => router.push(`/apartment/${apartment.id}`)}
      accessibilityRole="link"
      accessibilityLabel={`${apartment.title}, ${formatNaira(apartment.rentPerYear)} a year`}
      innerStyle={SHADOW.card}
      className="overflow-hidden rounded-3xl bg-surface"
      scaleTo={0.98}
    >
      <View className="aspect-[4/3] w-full overflow-hidden bg-canvas">
        {apartment.images[0] ? (
          <Image source={{ uri: apartment.images[0] }} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={400} />
        ) : (
          <View className="flex-1 items-center justify-center bg-brand-50">
            <Building2 size={32} color={COLORS.brand[600]} strokeWidth={1.5} />
          </View>
        )}
        <View className="absolute left-3 top-3 flex-row gap-1.5">
          {apartment.status === 'taken' ? (
            <Badge tone="dark">Taken</Badge>
          ) : (
            <Badge tone="brand">Available</Badge>
          )}
          {apartment.isConfirmed ? (
            <Badge tone="dark" icon={<BadgeCheck size={12} color="#fff" />}>
              Confirmed
            </Badge>
          ) : null}
        </View>
      </View>
      <View className="gap-1.5 p-4">
        <View className="flex-row items-baseline gap-1">
          <Text className="font-display-bold text-xl text-ink-900">{formatNaira(apartment.rentPerYear)}</Text>
          <Text className="text-sm text-ink-500">/ year</Text>
        </View>
        <Text numberOfLines={1} className="font-body-semibold text-ink-800">
          {apartment.title}
        </Text>
        <View className="flex-row items-center gap-1">
          <MapPin size={13} color={COLORS.ink[400]} />
          <Text numberOfLines={1} className="flex-1 text-sm text-ink-500">
            {apartment.area} · {apartment.distanceToCampus}
            {school?.shortName ? ` · ${school.shortName}` : ''}
          </Text>
        </View>
        <View className="mt-1 flex-row items-center justify-between">
          <Text className="font-body-medium text-xs text-ink-600">{apartmentTypeLabel(apartment.type)}</Text>
          <View className="flex-row items-center gap-1">
            <Clock size={12} color={COLORS.ink[400]} />
            <Text className="text-xs text-ink-500">
              {renewedDays === 0 ? 'Confirmed today' : `Confirmed ${renewedDays}d ago`}
            </Text>
          </View>
        </View>
      </View>
    </PressableScale>
  );
}

export const ApartmentCard = memo(ApartmentCardBase);
