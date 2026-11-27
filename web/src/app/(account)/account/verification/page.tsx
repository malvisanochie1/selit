import type { Metadata } from 'next';

import { VerificationWizard } from '@/features/verification/components/VerificationWizard';

export const metadata: Metadata = { title: 'Get verified' };

export default function VerificationPage() {
  return <VerificationWizard />;
}
