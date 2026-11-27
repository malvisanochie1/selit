'use client';

import {
  AMENITIES,
  APARTMENT_TYPES,
  apartmentFormSchema,
  messageOf,
  RENEWAL_DAYS,
} from '@selit/shared';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Chip } from '@/components/ui/Chip';
import { Notice } from '@/components/ui/Notice';
import { TextArea } from '@/components/ui/TextArea';
import { TextField } from '@/components/ui/TextField';
import type { ApartmentType } from '@/features/apartments/apartment.types';
import { useCreateApartment } from '@/features/apartments/hooks/use-apartments';
import type { SessionUser } from '@/features/auth/auth.types';
import { SchoolPicker } from '@/features/schools/components/SchoolPicker';
import { VerificationBanner } from '@/features/verification/components/VerificationBanner';
import { useVerificationStatus } from '@/features/verification/hooks/use-verification';

import { FormSection } from './FormSection';
import { PhotoPicker, type PhotoItem } from './PhotoPicker';

function MoneyField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
}) {
  return (
    <TextField
      id={id}
      label={label}
      inputMode="numeric"
      leadingIcon={<span className="text-sm font-semibold">₦</span>}
      value={value ? Number(value).toLocaleString('en-NG') : ''}
      onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, 9))}
      error={error}
      hint={hint}
    />
  );
}

export function ApartmentForm({ user }: { user: SessionUser }) {
  const create = useCreateApartment();
  const { status } = useVerificationStatus();
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [type, setType] = useState<ApartmentType | ''>('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [school, setSchool] = useState(user.campusLocation);
  const [money, setMoney] = useState({ rent: '', agency: '', caution: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (status !== 'verified') {
    return (
      <div className="space-y-4">
        <Notice tone="info" title="Verify your identity first">
          Only ID-verified agents and landlords can list rooms. It protects students from fake
          listings.
        </Notice>
        <VerificationBanner status={status} />
      </div>
    );
  }
  if (create.isSuccess) {
    return (
      <div className="rounded-3xl border border-line bg-surface p-10 text-center">
        <CheckCircle2 className="mx-auto size-12 text-brand-500" />
        <h2 className="mt-4 text-2xl font-semibold text-ink-900">Room sent for review</h2>
        <p className="mx-auto mt-2 max-w-md text-ink-500">
          We review new rooms before they go live. Remember to tap “Still available” at least every{' '}
          {RENEWAL_DAYS} days so it stays visible.
        </p>
        <ButtonLink href={`/apartments/${create.data.id}`} className="mt-6">
          View listing
        </ButtonLink>
      </div>
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = apartmentFormSchema.safeParse({
      title: form.get('title'),
      type,
      rentPerYear: Number(money.rent) || 0,
      agencyFee: Number(money.agency) || 0,
      cautionFee: Number(money.caution) || 0,
      school,
      area: form.get('area'),
      distanceToCampus: form.get('distanceToCampus'),
      description: form.get('description'),
      agencyName: form.get('agencyName') ?? '',
      amenities,
      photoCount: photos.length,
    });
    const next: Record<string, string> = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) next[String(issue.path[0])] ??= issue.message;
    }
    if (!parsed.success || Object.keys(next).length) {
      setErrors(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setErrors({});
    create.mutate({
      ...parsed.data,
      photos: photos.flatMap((photo) => (photo.kind === 'new' ? [photo.file] : [])),
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-3xl space-y-5">
      {create.isError ? <Notice tone="danger">{messageOf(create.error)}</Notice> : null}
      <FormSection
        step={1}
        title="Photos"
        description="Bedroom, toilet, kitchen and the outside of the building."
      >
        <PhotoPicker
          photos={photos}
          onChange={setPhotos}
          onError={(message) => setErrors((current) => ({ ...current, photoCount: message }))}
          error={errors.photoCount}
        />
      </FormSection>

      <FormSection step={2} title="The room">
        <div className="space-y-5">
          <TextField
            id="title"
            label="Title"
            placeholder="e.g. Self-contain near DSPG back gate"
            maxLength={90}
            error={errors.title}
          />
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-ink-800">Type</legend>
            <div className="flex flex-wrap gap-2">
              {APARTMENT_TYPES.map((option) => (
                <Chip
                  key={option.value}
                  isActive={type === option.value}
                  onClick={() => setType(option.value)}
                >
                  {option.label}
                </Chip>
              ))}
            </div>
            {errors.type ? (
              <p className="mt-2 text-sm font-medium text-danger-600">{errors.type}</p>
            ) : null}
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-ink-800">
              What&apos;s included
            </legend>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((amenity) => (
                <Chip
                  key={amenity}
                  isActive={amenities.includes(amenity)}
                  onClick={() =>
                    setAmenities((current) =>
                      current.includes(amenity)
                        ? current.filter((item) => item !== amenity)
                        : [...current, amenity],
                    )
                  }
                >
                  {amenity}
                </Chip>
              ))}
            </div>
          </fieldset>
          <TextArea
            id="description"
            label="Description"
            rows={5}
            maxLength={2000}
            placeholder="Water supply, light, security, house rules, when it is free to move in."
            error={errors.description}
          />
        </div>
      </FormSection>

      <FormSection
        step={3}
        title="Costs"
        description="Show every fee upfront. Hidden charges get listings removed."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <MoneyField
            id="rent"
            label="Rent per year"
            value={money.rent}
            onChange={(rent) => setMoney((current) => ({ ...current, rent }))}
            error={errors.rentPerYear}
          />
          <MoneyField
            id="agency"
            label="Agency fee"
            value={money.agency}
            onChange={(agency) => setMoney((current) => ({ ...current, agency }))}
            hint="0 if none"
          />
          <MoneyField
            id="caution"
            label="Caution fee"
            value={money.caution}
            onChange={(caution) => setMoney((current) => ({ ...current, caution }))}
            hint="Refundable deposit"
          />
        </div>
      </FormSection>

      <FormSection step={4} title="Location">
        <div className="space-y-5">
          <SchoolPicker
            id="school"
            label="Nearest school"
            value={school}
            onChange={setSchool}
            error={errors.school}
          />
          <TextField
            id="agencyName"
            label="Agency name (optional)"
            placeholder="e.g. Ogwashi Homes"
            maxLength={80}
            error={errors.agencyName}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="area"
              label="Area or street"
              placeholder="e.g. Umudaike Road"
              error={errors.area}
            />
            <TextField
              id="distanceToCampus"
              label="Distance to campus"
              placeholder="e.g. 5 min walk"
              error={errors.distanceToCampus}
            />
          </div>
          <p className="text-sm text-ink-500">
            The exact address is shared privately with students who book an inspection.
          </p>
        </div>
      </FormSection>

      <div className="flex justify-end">
        <Button type="submit" size="lg" isLoading={create.isPending}>
          Submit for review
        </Button>
      </div>
    </form>
  );
}
