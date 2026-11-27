import {
  AMENITIES,
  apartmentFormSchema,
  APARTMENT_TYPES,
  MAX_APARTMENT_PHOTOS,
  messageOf,
  type ApartmentType,
} from '@selit/shared';
import { router } from 'expo-router';
import { BadgeCheck, MapPin } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Notice } from '@/components/ui/Notice';
import { Skeleton } from '@/components/ui/Skeleton';
import { Heading, Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { useCreateApartment } from '@/features/apartments/hooks';
import { SchoolPicker } from '@/features/schools/components/SchoolPicker';
import { FormSection } from '@/features/selling/components/FormSection';
import { PhotoPicker, type PhotoItem } from '@/features/selling/components/PhotoPicker';
import { useVerificationStatus } from '@/features/verification/hooks';
import { toPhotoUploads } from '@/lib/photos';
import { COLORS } from '@/theme';

function MoneyField({
  label,
  value,
  onChange,
  error,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
}) {
  return (
    <TextField
      label={label}
      value={value}
      onChangeText={(text) => onChange(text.replace(/\D/g, ''))}
      keyboardType="number-pad"
      placeholder="0"
      leadingIcon={<Text className="font-body-semibold text-ink-500">₦</Text>}
      error={error}
      hint={hint}
    />
  );
}

export default function SellApartmentScreen() {
  const { status, isLoading } = useVerificationStatus();
  const create = useCreateApartment();
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ApartmentType | ''>('');
  const [money, setMoney] = useState({ rent: '', agency: '', caution: '' });
  const [agencyName, setAgencyName] = useState('');
  const [school, setSchool] = useState('');
  const [area, setArea] = useState('');
  const [distance, setDistance] = useState('');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreparing, setIsPreparing] = useState(false);

  if (isLoading) {
    return (
      <Screen header={<ScreenHeader title="List a room" />}>
        <Skeleton height={300} />
      </Screen>
    );
  }

  if (status !== 'verified') {
    return (
      <Screen header={<ScreenHeader title="List a room" />} maxWidth={560}>
        <View className="mt-6 items-center rounded-[28px] bg-surface p-6">
          <View className="size-16 items-center justify-center rounded-3xl bg-brand-50">
            <BadgeCheck size={30} color={COLORS.brand[600]} />
          </View>
          <Heading className="mt-5 text-center text-2xl">Verify your identity first</Heading>
          <Text className="mt-2 text-center leading-6 text-ink-500">
            {status === 'pending'
              ? 'Your verification is being reviewed. You can list rooms as soon as it is approved.'
              : 'Only ID-verified agents and landlords can list rooms. It protects students from fake agents, and takes about two minutes.'}
          </Text>
          {status !== 'pending' ? (
            <Button size="lg" className="mt-6" onPress={() => router.push('/verification')}>
              Verify my identity
            </Button>
          ) : null}
        </View>
      </Screen>
    );
  }

  async function submit() {
    const parsed = apartmentFormSchema.safeParse({
      title,
      type,
      rentPerYear: Number(money.rent) || 0,
      agencyFee: Number(money.agency) || 0,
      cautionFee: Number(money.caution) || 0,
      agencyName,
      school,
      area,
      distanceToCampus: distance,
      description,
      amenities,
      photoCount: photos.length,
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] ??= issue.message;
      return setErrors(next);
    }
    setErrors({});
    setIsPreparing(true);
    try {
      const { photoCount: _photoCount, ...fields } = parsed.data;
      const uploads = await toPhotoUploads(
        photos.flatMap((item) => (item.kind === 'new' ? [item.photo] : [])),
      );
      const created = await create.mutateAsync({ ...fields, photos: uploads });
      router.replace({
        pathname: '/sell/success',
        params: { id: created.id, status: created.status, kind: 'apartment' },
      });
    } catch {
      // The mutation error is shown above the form.
    } finally {
      setIsPreparing(false);
    }
  }

  return (
    <Screen header={<ScreenHeader title="List a room" />} maxWidth={720}>
      <View className="gap-5">
        {create.isError ? <Notice tone="danger">{messageOf(create.error)}</Notice> : null}
        <FormSection
          step={1}
          title="Photos"
          description="At least two: the room, plus the toilet, kitchen or compound."
        >
          <PhotoPicker
            photos={photos}
            onChange={setPhotos}
            max={MAX_APARTMENT_PHOTOS}
            error={errors.photoCount}
            hint="Clear daylight photos of the actual room. Students report fake photos."
          />
        </FormSection>
        <FormSection step={2} title="The room">
          <TextField
            label="Title"
            value={title}
            onChangeText={setTitle}
            maxLength={90}
            placeholder="e.g. Self-contain near DSPG back gate"
            error={errors.title}
          />
          <View className="gap-2">
            <Text className="font-body-semibold text-sm text-ink-800">Type</Text>
            <View className="flex-row flex-wrap gap-2">
              {APARTMENT_TYPES.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  isActive={type === option.value}
                  onPress={() => setType(option.value)}
                />
              ))}
            </View>
            {errors.type ? <Text className="text-sm text-danger-600">{errors.type}</Text> : null}
          </View>
          <TextField
            label="Description"
            multiline
            value={description}
            onChangeText={setDescription}
            maxLength={2000}
            placeholder="Water, light, security, who else lives there"
            error={errors.description}
          />
          <View className="gap-2">
            <Text className="font-body-semibold text-sm text-ink-800">What it has</Text>
            <View className="flex-row flex-wrap gap-2">
              {AMENITIES.map((amenity) => (
                <Chip
                  key={amenity}
                  label={amenity}
                  isActive={amenities.includes(amenity)}
                  onPress={() =>
                    setAmenities((current) =>
                      current.includes(amenity)
                        ? current.filter((item) => item !== amenity)
                        : [...current, amenity],
                    )
                  }
                />
              ))}
            </View>
          </View>
        </FormSection>
        <FormSection
          step={3}
          title="Money"
          description="Show every fee upfront. Hidden fees get listings removed."
        >
          <MoneyField
            label="Rent per year"
            value={money.rent}
            onChange={(rent) => setMoney((current) => ({ ...current, rent }))}
            error={errors.rentPerYear}
          />
          <MoneyField
            label="Agency fee"
            value={money.agency}
            onChange={(agency) => setMoney((current) => ({ ...current, agency }))}
            error={errors.agencyFee}
            hint="Leave empty if there is none."
          />
          <MoneyField
            label="Caution fee"
            value={money.caution}
            onChange={(caution) => setMoney((current) => ({ ...current, caution }))}
            error={errors.cautionFee}
            hint="Refundable deposit, if any."
          />
        </FormSection>
        <FormSection step={4} title="Location">
          <SchoolPicker
            label="Nearest school"
            value={school}
            onChange={setSchool}
            error={errors.school}
          />
          <TextField
            label="Area or street"
            value={area}
            onChangeText={setArea}
            maxLength={80}
            placeholder="e.g. Umudaike Road"
            leadingIcon={<MapPin size={18} color={COLORS.ink[400]} />}
            error={errors.area}
          />
          <TextField
            label="Distance to campus"
            value={distance}
            onChangeText={setDistance}
            maxLength={40}
            placeholder="e.g. 5 min walk"
            error={errors.distanceToCampus}
          />
          <TextField
            label="Agency name"
            optional
            value={agencyName}
            onChangeText={setAgencyName}
            maxLength={80}
            placeholder="e.g. Ogwashi Homes"
          />
        </FormSection>
        <Button size="lg" onPress={() => void submit()} isLoading={isPreparing || create.isPending}>
          Submit for review
        </Button>
        <Text className="text-center text-xs text-ink-400">
          New rooms are checked before they go live. Confirm it is still free at least every 14
          days.
        </Text>
      </View>
    </Screen>
  );
}
