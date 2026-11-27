import type { Metadata } from 'next';
import { Suspense } from 'react';

import { AuthHeading } from '@/features/auth/components/AuthHeading';
import { SignUpForm } from '@/features/auth/components/SignUpForm';

export const metadata: Metadata = { title: 'Create an account' };

export default function SignUpPage() {
  return (
    <>
      <AuthHeading title="Join Selit" description="Free for students. Takes less than a minute." />
      <Suspense>
        <SignUpForm />
      </Suspense>
    </>
  );
}
