import type { Metadata } from 'next';

import { AuthHeading } from '@/features/auth/components/AuthHeading';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

export const metadata: Metadata = { title: 'Reset your password' };

export default function ForgotPasswordPage() {
  return (
    <>
      <AuthHeading
        title="Forgot your password?"
        description="Enter your email and we'll send you a reset link."
      />
      <ForgotPasswordForm />
    </>
  );
}
