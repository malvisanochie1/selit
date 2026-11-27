'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { fetchSessionUser, signIn, signOut, signUp } from '../auth.api';
import type { SessionUser } from '../auth.types';

export const sessionKey = ['session'] as const;

export function useSession() {
  const query = useQuery({
    queryKey: sessionKey,
    queryFn: fetchSessionUser,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const user = query.data ?? null;
  return {
    user,
    isLoading: query.isPending,
    isSignedIn: Boolean(user),
    refresh: query.refetch,
  };
}

export function useSetSessionUser() {
  const queryClient = useQueryClient();
  return (user: SessionUser | null) =>
    queryClient.setQueryData<SessionUser | null>(sessionKey, user);
}

/** After signing in, cached pages are refetched so contact details appear. */
function useAfterSignIn() {
  const queryClient = useQueryClient();
  const setUser = useSetSessionUser();
  return (user: SessionUser | null) => {
    setUser(user);
    void queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] !== sessionKey[0],
    });
  };
}

export function useSignIn() {
  const afterSignIn = useAfterSignIn();
  return useMutation({ mutationFn: signIn, onSuccess: (user) => afterSignIn(user) });
}

export function useSignUp() {
  const afterSignIn = useAfterSignIn();
  return useMutation({ mutationFn: signUp, onSuccess: (data) => afterSignIn(data.user) });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: signOut,
    onSettled: () => {
      queryClient.clear();
      queryClient.setQueryData<SessionUser | null>(sessionKey, null);
      router.replace('/');
      router.refresh();
    },
  });
}
