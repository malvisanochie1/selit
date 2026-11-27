import {
  conditionLabel,
  findSchoolByName,
  formatNaira,
  formatRelativeTime,
  type Listing,
} from '@selit/shared';
import { router } from 'expo-router';
import { BadgeCheck, MapPin } from 'lucide-react-native';
import { memo } from 'react';
import { View } from 'react-native';

import { PressableScale } from '@/components/motion/PressableScale';
import { Badge } from '@/components/ui/Badge';
import { Text } from '@/components/ui/Text';
import { SaveButton } from '@/features/saved/SaveButton';
import { COLORS, SHADOW } from '@/theme';

import { ListingImage } from './ListingImage';

function ListingCardBase({ listing }: { listing: Listing }) {
  const school = findSchoolByName(listing.school);
  const isVerified = listing.seller?.verificationStatus === 'verified';
  return (
    <PressableScale
      onPress={() => router.push(`/listing/${listing.id}`)}
      accessibilityRole="link"
      accessibilityLabel={`${listing.title}, ${formatNaira(listing.price)}`}
      innerStyle={SHADOW.card}
      className="overflow-hidden rounded-3xl bg-surface"
    >
      <View className="aspect-square w-full overflow-hidden bg-canvas">
        <ListingImage uri={listing.images[0]} category={listing.category} />
        <View className="absolute left-2.5 top-2.5 flex-row gap-1.5">
          <Badge tone="dark">{conditionLabel(listing.condition)}</Badge>
          {listing.status === 'sold' ? <Badge tone="amber">Sold</Badge> : null}
        </View>
        <View className="absolute right-2 top-2">
          <SaveButton listingId={listing.id} />
        </View>
      </View>
      <View className="gap-1 p-3">
        <Text className="font-display-bold text-lg text-ink-900">{formatNaira(listing.price)}</Text>
        <Text
          numberOfLines={2}
          className="min-h-10 font-body-medium text-sm leading-5 text-ink-800"
        >
          {listing.title}
        </Text>
        <View className="mt-1 flex-row items-center gap-1">
          <MapPin size={12} color={COLORS.ink[400]} />
          <Text numberOfLines={1} className="flex-1 text-xs text-ink-500">
            {school?.shortName || listing.school} · {formatRelativeTime(listing.createdAt)}
          </Text>
          {isVerified ? (
            <BadgeCheck size={14} color={COLORS.brand[600]} accessibilityLabel="Verified seller" />
          ) : null}
        </View>
      </View>
    </PressableScale>
  );
}

export const ListingCard = memo(ListingCardBase);
