import {
  CATEGORIES,
  CONDITIONS,
  formatNaira,
  listingFormSchema,
  MAX_LISTING_PHOTOS,
  median,
  messageOf,
  suggestedMeetupSpots,
  SUSPICIOUS_PRICE_RATIO,
} from '@selit/shared';
import { router, useLocalSearchParams } from 'expo-router';
import { AlertTriangle, MapPin } from 'lucide-react-native';
import { createElement, useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Notice } from '@/components/ui/Notice';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { useSession } from '@/features/auth/session-store';
import { CATEGORY_ICONS } from '@/features/listings/category-style';
import {
  useCreateListing,
  useListing,
  useListings,
  useUpdateListing,
} from '@/features/listings/hooks';
import { SchoolPicker } from '@/features/schools/components/SchoolPicker';
import { CheckCodePanel } from '@/features/selling/components/CheckCodePanel';
import { FormSection } from '@/features/selling/components/FormSection';
import { PhotoPicker, type PhotoItem } from '@/features/selling/components/PhotoPicker';
import { toPhotoUpload, toPhotoUploads, type PickedPhoto } from '@/lib/photos';
import { COLORS } from '@/theme';

const NEW_SELLER_DAYS = 30;

export default function SellItemScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = useListing(id ?? '');
  if (id && existing.isPending) {
    return (
      <Screen header={<ScreenHeader title="Edit listing" />}>
        <Skeleton height={400} />
      </Screen>
    );
  }
  return <ListingForm key={existing.data?.id ?? 'new'} />;
}

function ListingForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useSession();
  const listing = useListing(id ?? '').data;
  const isEditing = Boolean(listing);
  const create = useCreateListing();
  const update = useUpdateListing();

  const [photos, setPhotos] = useState<PhotoItem[]>(
    () =>
      listing?.images.map((url, index) => ({
        kind: 'existing' as const,
        url,
        path: listing.imagePaths[index] ?? url,
      })) ?? [],
  );
  const [title, setTitle] = useState(listing?.title ?? '');
  const [category, setCategory] = useState(listing?.category ?? '');
  const [condition, setCondition] = useState(listing?.condition ?? '');
  const [description, setDescription] = useState(listing?.description ?? '');
  const [price, setPrice] = useState(listing ? String(listing.price) : '');
  const [school, setSchool] = useState(listing?.school ?? user?.campusLocation ?? '');
  const [location, setLocation] = useState(listing?.location ?? '');
  const [checkId, setCheckId] = useState('');
  const [checkPhoto, setCheckPhoto] = useState<PickedPhoto | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreparing, setIsPreparing] = useState(false);

  const priceValue = Number(price.replace(/\D/g, '')) || 0;
  const similar = useListings({ category, limit: 40 }, Boolean(category));
  const typicalPrice = useMemo(
    () =>
      median(
        (similar.data?.items ?? [])
          .filter((item) => item.id !== listing?.id)
          .map((item) => item.price),
      ),
    [similar.data, listing?.id],
  );
  const looksTooCheap =
    typicalPrice > 0 && priceValue > 0 && priceValue < typicalPrice * SUSPICIOUS_PRICE_RATIO;
  const isNewSeller =
    !user?.createdAt || Date.now() - Date.parse(user.createdAt) < NEW_SELLER_DAYS * 86_400_000;
  const needsCheck =
    !isEditing && user?.verificationStatus !== 'verified' && (isNewSeller || looksTooCheap);
  const spots = suggestedMeetupSpots(school);
  const isSaving = isPreparing || create.isPending || update.isPending;
  const mutationError = create.error ?? update.error;
  const onCheckId = useCallback((value: string) => setCheckId(value), []);

  async function submit() {
    const parsed = listingFormSchema.safeParse({
      title,
      category,
      condition,
      description,
      price: priceValue,
      school,
      location,
      photoCount: photos.length,
    });
    const nextErrors: Record<string, string> = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) nextErrors[String(issue.path[0])] ??= issue.message;
    }
    if (needsCheck && !checkPhoto)
      nextErrors.check = 'Add the check photo with the code beside your item.';
    if (!user?.whatsApp)
      nextErrors.contact = 'Add your WhatsApp number to your profile so buyers can reach you.';
    setErrors(nextErrors);
    if (!parsed.success || Object.keys(nextErrors).length) return;

    const { photoCount: _photoCount, ...fields } = parsed.data;
    setIsPreparing(true);
    try {
      const newPhotos = await toPhotoUploads(
        photos.flatMap((item) => (item.kind === 'new' ? [item.photo] : [])),
      );
      const existingImagePaths = photos.flatMap((item) =>
        item.kind === 'existing' ? [item.path] : [],
      );
      if (listing) {
        const saved = await update.mutateAsync({
          id: listing.id,
          update: { ...fields, existingImagePaths, newPhotos },
        });
        router.replace(`/listing/${saved.id}`);
        return;
      }
      const created = await create.mutateAsync({
        ...fields,
        existingImagePaths,
        newPhotos,
        checkId: needsCheck && checkId ? checkId : undefined,
        checkPhoto: needsCheck && checkPhoto ? await toPhotoUpload(checkPhoto) : undefined,
      });
      router.replace({
        pathname: '/sell/success',
        params: { id: created.id, status: created.status },
      });
    } catch {
      // The mutation error is shown above the form.
    } finally {
      setIsPreparing(false);
    }
  }

  return (
    <Screen
      header={<ScreenHeader title={isEditing ? 'Edit listing' : 'Sell an item'} />}
      maxWidth={720}
    >
      <View className="gap-5">
        {errors.contact ? (
          <Notice
            tone="warning"
            title="Buyers need a way to reach you"
            action={
              <Button size="sm" variant="secondary" onPress={() => router.push('/profile')}>
                Add WhatsApp number
              </Button>
            }
          >
            {errors.contact}
          </Notice>
        ) : null}
        {mutationError ? <Notice tone="danger">{messageOf(mutationError)}</Notice> : null}

        <FormSection
          step={1}
          title="Photos"
          description="Real photos of your actual item. The first one is the cover."
        >
          <PhotoPicker
            photos={photos}
            onChange={setPhotos}
            max={MAX_LISTING_PHOTOS}
            error={errors.photoCount}
          />
        </FormSection>

        <FormSection step={2} title="Details">
          <TextField
            label="Title"
            value={title}
            onChangeText={setTitle}
            maxLength={90}
            placeholder="e.g. 6×4 foam mattress, 8 inches"
            error={errors.title}
          />
          <View className="gap-2">
            <Text className="font-body-semibold text-sm text-ink-800">Category</Text>
            <View className="flex-row flex-wrap gap-2">
              {CATEGORIES.map((option) => (
                <Chip
                  key={option.slug}
                  label={option.name}
                  isActive={category === option.slug}
                  onPress={() => setCategory(option.slug)}
                  icon={createElement(CATEGORY_ICONS[option.icon], {
                    size: 15,
                    color: category === option.slug ? '#fff' : COLORS.ink[500],
                  })}
                />
              ))}
            </View>
            {errors.category ? (
              <Text className="text-sm text-danger-600">{errors.category}</Text>
            ) : null}
          </View>
          <View className="gap-2">
            <Text className="font-body-semibold text-sm text-ink-800">Condition</Text>
            <View className="flex-row flex-wrap gap-2">
              {CONDITIONS.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  isActive={condition === option.value}
                  onPress={() => setCondition(option.value)}
                />
              ))}
            </View>
            {errors.condition ? (
              <Text className="text-sm text-danger-600">{errors.condition}</Text>
            ) : null}
          </View>
          <TextField
            label="Description"
            multiline
            value={description}
            onChangeText={setDescription}
            maxLength={2000}
            placeholder="Size, age, any faults, why you're selling"
            error={errors.description}
          />
        </FormSection>

        <FormSection step={3} title="Price">
          <TextField
            label="Price in naira"
            value={price}
            onChangeText={(value) => setPrice(value.replace(/\D/g, ''))}
            keyboardType="number-pad"
            placeholder="e.g. 15000"
            leadingIcon={<Text className="font-body-semibold text-ink-500">₦</Text>}
            hint={
              typicalPrice
                ? `Similar items sell for about ${formatNaira(typicalPrice)}.`
                : undefined
            }
            error={errors.price}
          />
          {looksTooCheap ? (
            <View className="flex-row gap-2 rounded-2xl bg-amber-50 p-3">
              <AlertTriangle size={18} color={COLORS.amber[700]} />
              <Text className="flex-1 text-sm leading-5 text-amber-700">
                This is far below what similar items sell for, so it gets a quick check before going
                live.
              </Text>
            </View>
          ) : null}
        </FormSection>

        <FormSection
          step={4}
          title="Where to meet"
          description="Pick a busy public place. Never your room or hostel."
        >
          <SchoolPicker label="School" value={school} onChange={setSchool} error={errors.school} />
          <TextField
            label="Meet-up spot"
            value={location}
            onChangeText={setLocation}
            maxLength={120}
            placeholder="e.g. Main gate"
            leadingIcon={<MapPin size={18} color={COLORS.ink[400]} />}
            error={errors.location}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {spots.map((spot) => (
                <Chip
                  key={spot}
                  label={spot}
                  isActive={location === spot}
                  onPress={() => setLocation(spot)}
                />
              ))}
            </View>
          </ScrollView>
        </FormSection>

        {needsCheck ? (
          <CheckCodePanel
            photo={checkPhoto}
            onPhoto={setCheckPhoto}
            onCheckId={onCheckId}
            error={errors.check}
          />
        ) : null}

        <Button size="lg" onPress={() => void submit()} isLoading={isSaving}>
          {isEditing ? 'Save changes' : 'Publish listing'}
        </Button>
        <Text className="text-center text-xs text-ink-400">
          By publishing you confirm the item is yours and the photos are real.
        </Text>
      </View>
    </Screen>
  );
}
