import type { Metadata } from 'next';
import { Suspense } from 'react';

import { AuthHeading } from '@/features/auth/components/AuthHeading';
import { SignInForm } from '@/features/auth/components/SignInForm';

export const metadata: Metadata = { title: 'Sign in' };

export default function SignInPage() {
  return (
    <>
      <AuthHeading
        title="Welcome back"
        description="Sign in to contact sellers, save items and manage your listings."
      />
      <Suspense>
        <SignInForm />
      </Suspense>
    </>
  );
}
