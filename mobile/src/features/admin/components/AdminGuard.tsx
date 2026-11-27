import { router } from 'expo-router';
import { useEffect, type ReactNode } from 'react';

import { Screen } from '@/components/layout/Screen';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSession } from '@/features/auth/session-store';

/**
 * Keeps non-admins out of admin screens. This is only for navigation; the
 * database refuses every admin action from anyone else anyway.
 */
export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useSession();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isLoading && !isAdmin) router.replace('/account');
  }, [isLoading, isAdmin]);

  if (!isAdmin) {
    return (
      <Screen>
        <Skeleton height={200} />
      </Screen>
    );
  }
  return children;
}
