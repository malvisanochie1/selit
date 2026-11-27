import 'server-only';

import type { SessionUser, UserRole } from '@selit/shared';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { getServerApi } from '@/lib/api.server';

/** Resolves the current visitor once per request, checked with the auth server. */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const api = await getServerApi();
  return api.auth.getSessionUser();
});

/**
 * Guards a server-rendered area. The role comes from the database profile,
 * never from anything the browser could edit.
 */
export async function requireSession(nextPath: string, roles?: UserRole[]) {
  const user = await getSessionUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
  if (roles && !roles.includes(user.role)) redirect('/account');
  return user;
}
