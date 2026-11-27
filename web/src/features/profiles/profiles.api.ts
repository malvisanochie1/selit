import { getApi } from '@/lib/api';
import { toPhotoUpload } from '@/lib/photos';

import type { ProfileUpdateInput } from './profile.types';

export function getPublicProfile(id: string) {
  return getApi().profiles.getPublicProfile(id);
}

export async function updateMyProfile(input: ProfileUpdateInput) {
  const { image, ...fields } = input;
  return getApi().profiles.updateMyProfile({
    ...fields,
    image: image ? await toPhotoUpload(image, 800) : undefined,
  });
}

/** Selling is open to everyone; the profile only needs the seller flag. */
export function becomeSeller() {
  return getApi().profiles.becomeSeller();
}
