'use client';

import {
  ApiError,
  CATEGORIES,
  CONDITIONS,
  formatNaira,
  listingFormSchema,
  median,
  messageOf,
  suggestedMeetupSpots,
  SUSPICIOUS_PRICE_RATIO,
} from '@selit/shared';
import { AlertTriangle, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createElement, useMemo, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { controlStyles } from '@/components/ui/Field';
import { Notice } from '@/components/ui/Notice';
import { TextArea } from '@/components/ui/TextArea';
import { TextField } from '@/components/ui/TextField';
import type { SessionUser } from '@/features/auth/auth.types';
import { ListingCard } from '@/features/listings/components/ListingCard';
import {
  useCreateListing,
  useListings,
  useUpdateListing,
} from '@/features/listings/hooks/use-listings';
import type { Listing } from '@/features/listings/listing.types';
import { useBecomeSeller } from '@/features/profiles/hooks/use-profile';
import { SchoolPicker } from '@/features/schools/components/SchoolPicker';
import { CATEGORY_ICONS } from '@/lib/category-style';
import { cn } from '@/lib/cn';

import { CheckCodePanel } from './CheckCodePanel';
import { FormSection } from './FormSection';
import { PhotoPicker, type PhotoItem } from './PhotoPicker';

const NEW_SELLER_DAYS = 30;

type ListingFormProps = {
  user: SessionUser;
  listing?: Listing;
};

function isNewSeller(user: SessionUser) {
  if (!user.createdAt) return true;
  return Date.now() - Date.parse(user.createdAt) < NEW_SELLER_DAYS * 86_400_000;
}

export function ListingForm({ user, listing }: ListingFormProps) {
  const router = useRouter();
  const isEditing = Boolean(listing);
  const create = useCreateListing();
  const update = useUpdateListing();
  const becomeSeller = useBecomeSeller();

  const [photos, setPhotos] = useState<PhotoItem[]>(
    () => listing?.images.map((url) => ({ kind: 'existing' as const, url })) ?? [],
  );
  const [title, setTitle] = useState(listing?.title ?? '');
  const [category, setCategory] = useState(listing?.category ?? '');
  const [condition, setCondition] = useState(listing?.condition ?? '');
  const [description, setDescription] = useState(listing?.description ?? '');
  const [price, setPrice] = useState(listing ? String(listing.price) : '');
  const [school, setSchool] = useState(listing?.school ?? user.campusLocation);
  const [location, setLocation] = useState(listing?.location ?? '');
  const [checkId, setCheckId] = useState('');
  const [checkPhoto, setCheckPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const priceValue = Number(price) || 0;
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
  const needsCheck = !isEditing && (isNewSeller(user) || looksTooCheap);
  const spots = suggestedMeetupSpots(school);
  const isSaving = create.isPending || update.isPending || becomeSeller.isPending;
  const mutationError = create.error ?? update.error;

  const coverUrl = useMemo(() => {
    const cover = photos[0];
    if (!cover) return undefined;
    return cover.kind === 'existing' ? cover.url : URL.createObjectURL(cover.file);
  }, [photos]);

  const preview: Listing = {
    id: listing?.id ?? 'preview',
    sellerId: user.id,
    title: title || 'Your item title',
    description,
    price: priceValue,
    category: category || 'other',
    condition: condition || 'good',
    images: coverUrl ? [coverUrl] : [],
    imagePaths: [],
    reviewReason: null,
    school,
    location,
    status: 'active',
    viewsCount: 0,
    createdAt: listing?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    seller: {
      id: user.id,
      fullName: user.fullName,
      profileImageUrl: user.profileImageUrl,
      campusLocation: user.campusLocation,
      whatsApp: '',
      role: 'seller',
      status: 'active',
      verificationStatus: user.verificationStatus,
      averageRating: 0,
      reviewCount: 0,
      createdAt: user.createdAt,
    },
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
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
    if (!user.whatsApp)
      nextErrors.contact = 'Add your WhatsApp number to your profile so buyers can reach you.';
    setErrors(nextErrors);
    if (!parsed.success || Object.keys(nextErrors).length) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const existingImages = photos.flatMap((photo) =>
      photo.kind === 'existing' ? [photo.url] : [],
    );
    const newPhotos = photos.flatMap((photo) => (photo.kind === 'new' ? [photo.file] : []));
    const fields = { ...parsed.data, existingImages, newPhotos };

    try {
      if (listing) {
        const saved = await update.mutateAsync({ id: listing.id, update: fields });
        router.push(`/products/${saved.id}`);
        return;
      }
      if (user.role === 'buyer') await becomeSeller.mutateAsync();
      const created = await create.mutateAsync({
        ...fields,
        checkId: needsCheck && checkId ? checkId : undefined,
        checkPhoto: needsCheck && checkPhoto ? checkPhoto : undefined,
      });
      router.push(`/sell/success?id=${encodeURIComponent(created.id)}`);
    } catch (submitError) {
      if (submitError instanceof ApiError) setErrors(submitError.fieldErrors);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="min-w-0 space-y-5">
        {errors.contact ? (
          <Notice
            tone="warning"
            title="Buyers need a way to reach you"
            action={
              <Link href="/account/profile" className="font-semibold underline underline-offset-4">
                Add your number
              </Link>
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
            onError={(message) => setErrors((current) => ({ ...current, photoCount: message }))}
            error={errors.photoCount}
          />
        </FormSection>

        <FormSection step={2} title="Details">
          <div className="space-y-5">
            <TextField
              id="title"
              label="Title"
              placeholder="e.g. 6×4 foam mattress, 8 inches"
              value={title}
              maxLength={90}
              onChange={(event) => setTitle(event.target.value)}
              error={errors.title}
            />
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-ink-800">Category</legend>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((option) => (
                  <Chip
                    key={option.slug}
                    isActive={category === option.slug}
                    onClick={() => setCategory(option.slug)}
                    icon={createElement(CATEGORY_ICONS[option.icon])}
                  >
                    {option.name}
                  </Chip>
                ))}
              </div>
              {errors.category ? (
                <p className="mt-2 text-sm font-medium text-danger-600">{errors.category}</p>
              ) : null}
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-ink-800">Condition</legend>
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.map((option) => (
                  <Chip
                    key={option.value}
                    isActive={condition === option.value}
                    onClick={() => setCondition(option.value)}
                  >
                    {option.label}
                  </Chip>
                ))}
              </div>
              {errors.condition ? (
                <p className="mt-2 text-sm font-medium text-danger-600">{errors.condition}</p>
              ) : null}
            </fieldset>
            <TextArea
              id="description"
              label="Description"
              rows={5}
              maxLength={2000}
              placeholder="Size, how long you've used it, anything that doesn't work, and why you're selling."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              error={errors.description}
            />
          </div>
        </FormSection>

        <FormSection
          step={3}
          title="Price"
          description="Fair prices sell fastest. No hidden extras."
        >
          <div className="max-w-xs">
            <label htmlFor="price" className="text-sm font-semibold text-ink-800">
              Price in naira
            </label>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 font-semibold text-ink-500">
                ₦
              </span>
              <input
                id="price"
                inputMode="numeric"
                value={price ? Number(price).toLocaleString('en-NG') : ''}
                onChange={(event) => setPrice(event.target.value.replace(/\D/g, '').slice(0, 9))}
                aria-invalid={errors.price ? true : undefined}
                className={cn(controlStyles, 'h-13 pl-9 font-display text-xl font-bold')}
                placeholder="0"
              />
            </div>
            {errors.price ? (
              <p className="mt-1.5 text-sm font-medium text-danger-600">{errors.price}</p>
            ) : null}
          </div>
          {typicalPrice > 0 ? (
            <p className="mt-3 text-sm text-ink-500">
              Similar items usually sell for about{' '}
              <strong className="text-ink-800">{formatNaira(typicalPrice)}</strong>.
            </p>
          ) : null}
          {looksTooCheap ? (
            <p className="mt-3 flex items-start gap-2 rounded-2xl bg-amber-50 p-3 text-sm text-amber-700">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              This is far below what similar items sell for. Double-check the price; very low prices
              are reviewed before they go live.
            </p>
          ) : null}
        </FormSection>

        <FormSection
          step={4}
          title="Where to meet"
          description="Item sales happen at busy public places only."
        >
          <div className="space-y-5">
            <SchoolPicker
              id="school"
              label="School"
              value={school}
              onChange={setSchool}
              error={errors.school}
            />
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink-800">
                <MapPin className="size-4 text-brand-600" /> Public meet-up spot
              </p>
              <div className="flex flex-wrap gap-2">
                {spots.map((spot) => (
                  <Chip key={spot} isActive={location === spot} onClick={() => setLocation(spot)}>
                    {spot}
                  </Chip>
                ))}
              </div>
              <TextField
                id="location"
                label="Or type another public place"
                fieldClassName="mt-4"
                placeholder="e.g. First Bank, Ogwashi-Uku"
                value={location}
                maxLength={120}
                onChange={(event) => setLocation(event.target.value)}
                hint="Never a private house or hostel room."
                error={errors.location}
              />
            </div>
          </div>
        </FormSection>

        {needsCheck ? (
          <div>
            <CheckCodePanel photo={checkPhoto} onPhoto={setCheckPhoto} onCode={setCheckId} />
            {errors.check ? (
              <p className="mt-2 text-sm font-medium text-danger-600">{errors.check}</p>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" size="lg" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" size="lg" isLoading={isSaving}>
            {isEditing ? 'Save changes' : 'Publish listing'}
          </Button>
        </div>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <p className="mb-3 text-sm font-semibold text-ink-500">Preview</p>
          <ListingCard listing={preview} className="pointer-events-none" />
          <p className="mt-3 text-xs leading-relaxed text-ink-500">
            This is how students will see your item in search.
          </p>
        </div>
      </aside>
    </form>
  );
}
