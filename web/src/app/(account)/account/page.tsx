import type { Metadata } from 'next';

import { AccountOverview } from '@/features/account/components/AccountOverview';

export const metadata: Metadata = { title: 'Your account' };

export default function AccountPage() {
  return <AccountOverview />;
}
