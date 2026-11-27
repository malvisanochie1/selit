'use client';

import {
  fieldErrorsOf,
  MAX_PHOTO_BYTES,
  messageOf,
  profileSchema,
  toLocalNumber,
} from '@selit/shared';
import { Camera, Phone } from 'lucide-react';
import { useRef, useState } from 'react';

import { AreaHeader } from '@/components/layout/AreaHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { TextArea } from '@/components/ui/TextArea';
import { TextField } from '@/components/ui/TextField';
import { useSession } from '@/features/auth/hooks/use-session';
import { SchoolPicker } from '@/features/schools/components/SchoolPicker';

import { useUpdateMyProfile } from '../hooks/use-profile';

export function ProfileForm() {
  const { user } = useSession();
  const update = useUpdateMyProfile();
  const fileInput = useRef<HTMLInputElement>(null);
  const [school, setSchool] = useState(user?.campusLocation ?? '');
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) return null;

  function choosePhoto(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith('image/'))
      return setErrors({ image: 'Choose a photo (JPG, PNG or WebP).' });
    if (file.size > MAX_PHOTO_BYTES)
      return setErrors({ image: 'That photo is too large. Pick one under 8 MB.' });
    setErrors({});
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = profileSchema.safeParse({
      fullName: form.get('fullName'),
      campusLocation: school,
      department: form.get('department'),
      whatsApp: form.get('whatsApp'),
      bio: form.get('bio'),
    });
    if (!parsed.success) return setErrors(fieldErrorsOf(parsed.error));
    setErrors({});
    // The form only shows "saved" after the server confirms the change.
    update.mutate({ ...parsed.data, image: photo }, { onSuccess: () => setPhoto(null) });
  }

  return (
    <>
      <AreaHeader
        title="Your profile"
        description="This is what buyers see on your listings and profile page."
      />
      <form onSubmit={handleSubmit} noValidate className="max-w-2xl space-y-6">
        <div className="flex items-center gap-5 rounded-3xl border border-line bg-surface p-5">
          <Avatar name={user.fullName} src={preview || user.profileImageUrl} size={80} />
          <div>
            <Button variant="secondary" size="sm" onClick={() => fileInput.current?.click()}>
              <Camera /> Change photo
            </Button>
            <p className="mt-2 text-xs text-ink-500">A clear photo of your face builds trust.</p>
            {errors.image ? <p className="mt-1 text-sm text-danger-600">{errors.image}</p> : null}
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => choosePhoto(event.target.files?.[0])}
          />
        </div>

        <div className="grid gap-5 rounded-3xl border border-line bg-surface p-5 sm:p-6">
          <TextField
            id="fullName"
            label="Full name"
            defaultValue={user.fullName}
            error={errors.fullName}
          />
          <SchoolPicker
            id="campusLocation"
            label="School"
            value={school}
            onChange={setSchool}
            error={errors.campusLocation}
          />
          <TextField
            id="department"
            label="Department"
            optional
            defaultValue={user.department}
            error={errors.department}
          />
          <TextField
            id="whatsApp"
            label="WhatsApp number"
            type="tel"
            inputMode="tel"
            leadingIcon={<Phone />}
            placeholder="0803 123 4567"
            defaultValue={toLocalNumber(user.whatsApp)}
            hint="Shown only to signed-in students who open your listings."
            error={errors.whatsApp}
          />
          <TextArea
            id="bio"
            label="About you"
            optional
            rows={3}
            maxLength={300}
            defaultValue={user.bio}
            placeholder="e.g. Final-year student, I reply fast and meet at the main gate."
            error={errors.bio}
          />
        </div>

        {update.isError ? <Notice tone="danger">{messageOf(update.error)}</Notice> : null}
        {update.isSuccess ? <Notice tone="success" title="Profile saved" /> : null}

        <Button type="submit" size="lg" isLoading={update.isPending}>
          Save changes
        </Button>
      </form>
    </>
  );
}
