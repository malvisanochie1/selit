import type { Metadata } from 'next';

import { AccountSettings } from '@/features/account/components/AccountSettings';

export const metadata: Metadata = { title: 'Settings' };

export default function SettingsPage() {
  return <AccountSettings />;
}
