import type { Metadata } from 'next';
import { Suspense } from 'react';

import { AuthHeading } from '@/features/auth/components/AuthHeading';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

export const metadata: Metadata = { title: 'Choose a new password' };

export default function ResetPasswordPage() {
  return (
    <>
      <AuthHeading
        title="Choose a new password"
        description="Make it something you don't use anywhere else."
      />
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </>
  );
}
