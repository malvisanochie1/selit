import type { Metadata } from 'next';

import { ProfileForm } from '@/features/profiles/components/ProfileForm';

export const metadata: Metadata = { title: 'Your profile' };

export default function ProfilePage() {
  return <ProfileForm />;
}
