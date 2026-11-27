import {
  categoryName,
  conditionLabel,
  findSchoolByName,
  formatDate,
  formatNaira,
  formatRelativeTime,
  messageOf,
} from '@selit/shared';
import { router, useLocalSearchParams } from 'expo-router';
import { BadgeCheck, ChevronRight, Eye, Flag, MapPin, PackageX, Pencil, Share2, Tag } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Share, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Gallery } from '@/components/media/Gallery';
import { Appear } from '@/components/motion/Appear';
import { PressableScale } from '@/components/motion/PressableScale';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { Notice } from '@/components/ui/Notice';
import { RatingStars } from '@/components/ui/RatingStars';
import { Skeleton } from '@/components/ui/Skeleton';
import { Heading, Text } from '@/components/ui/Text';
import { env } from '@/config/env';
import { useSession } from '@/features/auth/session-store';
import { ListingImage } from '@/features/listings/components/ListingImage';
import { ListingGrid } from '@/features/listings/components/ListingGrid';
import { useListing, useListings } from '@/features/listings/hooks';
import { ContactActions } from '@/features/safety/components/ContactActions';
import { ReportSheet } from '@/features/safety/components/ReportSheet';
import { SafetyTips } from '@/features/safety/components/SafetyTips';
import { ShareMeetupSheet } from '@/features/safety/components/ShareMeetupSheet';
import { SaveButton } from '@/features/saved/SaveButton';
import { getApi } from '@/lib/api';
import { COLORS, SHADOW } from '@/theme';

export default function ListingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, isSignedIn } = useSession();
  const { data: listing, isPending, isError, error, refetch, isRefetching } = useListing(id);
  const similar = useListings({ category: listing?.category, limit: 6 }, Boolean(listing?.category));
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isMeetupOpen, setIsMeetupOpen] = useState(false);

  // One view per visitor per day; the database ignores repeats.
  useEffect(() => {
    void getApi().listings.recordView(id);
  }, [id]);

  const link = `${env.siteUrl}/products/${id}`;
  const header = (
    <ScreenHeader
      actions={
        listing ? (
          <>
            <IconButton
              accessibilityLabel="Share"
              icon={<Share2 size={18} color={COLORS.ink[900]} />}
              onPress={() => void Share.share({ message: `${listing.title} · ${formatNaira(listing.price)}\n${link}` })}
            />
            <SaveButton listingId={listing.id} tone="surface" />
          </>
        ) : undefined
      }
    />
  );

  if (isPending) {
    return (
      <Screen header={header}>
        <View className="gap-4">
          <Skeleton height={360} radius={28} />
          <Skeleton height={28} width="60%" />
          <Skeleton height={120} />
        </View>
      </Screen>
    );
  }

  if (isError || !listing) {
    return (
      <Screen header={header}>
        <EmptyState
          className="mt-6"
          icon={<PackageX size={26} color={COLORS.brand[700]} />}
          title="This item isn't available"
          description={messageOf(error)}
          action={<Button onPress={() => router.replace('/browse')}>Browse items</Button>}
        />
      </Screen>
    );
  }

  const seller = listing.seller;
  const isOwn = user?.id === listing.sellerId;
  const school = findSchoolByName(listing.school);
  const facts = [
    { icon: Tag, label: 'Category', value: categoryName(listing.category) },
    { icon: MapPin, label: 'Meet-up spot', value: listing.location },
    { icon: Eye, label: 'Views', value: listing.viewsCount.toLocaleString('en-NG') },
  ];

  return (
    <Screen header={header} onRefresh={() => void refetch()} isRefreshing={isRefetching}>
      <Appear>
        <Gallery
          images={listing.images}
          fallback={
            <View className="flex-1">
              <ListingImage category={listing.category} />
            </View>
          }
        />
      </Appear>

      <Appear index={1} className="mt-5">
        <View className="flex-row flex-wrap gap-2">
          <Badge tone="brand">{conditionLabel(listing.condition)}</Badge>
          {school?.shortName ? <Badge>{school.shortName}</Badge> : null}
          {listing.status === 'sold' ? <Badge tone="amber">Sold</Badge> : null}
          {listing.status === 'pending' ? <Badge tone="amber">In review</Badge> : null}
          <Text className="self-center text-xs text-ink-400">{formatRelativeTime(listing.createdAt)}</Text>
        </View>
        <Heading className="mt-3 text-3xl leading-9">{listing.title}</Heading>
        <Text className="mt-2 font-display-bold text-4xl text-brand-700">{formatNaira(listing.price)}</Text>
      </Appear>

      {isOwn && listing.status === 'pending' ? (
        <Notice tone="warning" title="Waiting for a quick review" className="mt-5">
          {listing.reviewReason
            ? `${listing.reviewReason}. It goes live as soon as our team checks it, usually within a few hours.`
            : 'It goes live as soon as our team checks it.'}
        </Notice>
      ) : null}

      {seller ? (
        <Appear index={2} className="mt-6">
          <PressableScale
            onPress={() => router.push(`/seller/${seller.id}`)}
            accessibilityRole="link"
            accessibilityLabel={`Seller ${seller.fullName}`}
            innerStyle={SHADOW.card}
            className="flex-row items-center gap-3 rounded-3xl bg-surface p-4"
            scaleTo={0.98}
          >
            <Avatar name={seller.fullName} src={seller.profileImageUrl} />
            <View className="flex-1">
              <View className="flex-row items-center gap-1.5">
                <Text numberOfLines={1} className="font-body-semibold text-ink-900">
                  {seller.fullName}
                </Text>
                {seller.verificationStatus === 'verified' ? (
                  <BadgeCheck size={16} color={COLORS.brand[600]} accessibilityLabel="Verified" />
                ) : (
                  <Badge tone="amber">Unverified</Badge>
                )}
              </View>
              <View className="mt-1 flex-row items-center gap-1.5">
                <RatingStars value={seller.averageRating} size={12} />
                <Text className="text-xs text-ink-500">
                  {seller.averageRating.toFixed(1)} · {seller.reviewCount} reviews · since {formatDate(seller.createdAt)}
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color={COLORS.ink[400]} />
          </PressableScale>
        </Appear>
      ) : null}

      <View className="mt-5">
        {isOwn ? (
          <Button variant="secondary" size="lg" icon={<Pencil size={18} color={COLORS.ink[900]} />} onPress={() => router.push(`/sell/item?id=${listing.id}`)}>
            Edit listing
          </Button>
        ) : (
          <ContactActions
            phone={seller?.whatsApp ?? ''}
            isSignedIn={isSignedIn}
            message={`Hi ${seller?.fullName.split(' ')[0] ?? ''}, I saw your "${listing.title}" on Selit for ${formatNaira(listing.price)}. Is it still available?`}
          />
        )}
      </View>

      <View className="mt-6 rounded-3xl border border-line bg-surface p-5">
        <Text className="font-display text-lg text-ink-900">Details</Text>
        <Text className="mt-2 leading-6 text-ink-700">{listing.description}</Text>
        <View className="mt-4 gap-3 border-t border-line pt-4">
          {facts.map((fact) => (
            <View key={fact.label} className="flex-row items-center gap-3">
              <fact.icon size={16} color={COLORS.ink[400]} />
              <Text className="w-28 text-sm text-ink-500">{fact.label}</Text>
              <Text className="flex-1 font-body-medium text-sm text-ink-900">{fact.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {!isOwn ? (
        <View className="mt-5 gap-3">
          <Button variant="secondary" icon={<Share2 size={18} color={COLORS.ink[900]} />} onPress={() => setIsMeetupOpen(true)}>
            Share my meet-up with a friend
          </Button>
          <SafetyTips />
          <Button variant="ghost" icon={<Flag size={16} color={COLORS.danger[600]} />} onPress={() => setIsReportOpen(true)}>
            <Text className="font-body-semibold text-danger-600">Report this listing</Text>
          </Button>
        </View>
      ) : null}

      {similar.data && similar.data.items.filter((item) => item.id !== listing.id).length ? (
        <View className="mt-10">
          <Heading className="mb-4 text-2xl">Similar items</Heading>
          <ListingGrid listings={similar.data.items.filter((item) => item.id !== listing.id).slice(0, 4)} animate={false} />
        </View>
      ) : null}

      <ReportSheet
        open={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetType="listing"
        targetId={listing.id}
        targetLabel={listing.title}
      />
      <ShareMeetupSheet
        open={isMeetupOpen}
        onClose={() => setIsMeetupOpen(false)}
        itemTitle={listing.title}
        sellerName={seller?.fullName ?? 'the seller'}
        spot={listing.location}
        link={link}
      />
    </Screen>
  );
}
