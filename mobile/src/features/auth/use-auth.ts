import type { SignInInput, SignUpInput } from '@selit/shared';
import { useMutation } from '@tanstack/react-query';

import { getApi } from '@/lib/api';
import { queryClient } from '@/lib/query-client';

import { useSessionStore } from './session-store';

/** After the session changes, cached screens refetch so contact details appear or vanish. */
function resetCaches() {
  void queryClient.invalidateQueries();
}

export function useSignIn() {
  const setUser = useSessionStore((state) => state.setUser);
  return useMutation({
    mutationFn: (input: SignInInput) => getApi().auth.signIn(input),
    onSuccess: (user) => {
      setUser(user);
      resetCaches();
    },
  });
}

export function useSignUp() {
  const setUser = useSessionStore((state) => state.setUser);
  return useMutation({
    mutationFn: (input: SignUpInput) => getApi().auth.signUp(input),
    onSuccess: (result) => {
      if (result.user) {
        setUser(result.user);
        resetCaches();
      }
    },
  });
}

export function useSignOut() {
  const setUser = useSessionStore((state) => state.setUser);
  return useMutation({
    mutationFn: () => getApi().auth.signOut(),
    onSettled: () => {
      setUser(null);
      queryClient.clear();
    },
  });
}
