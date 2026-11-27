import type { SessionUser } from '@selit/shared';
import { create } from 'zustand';

import { getApi } from '@/lib/api';

type SessionState = {
  user: SessionUser | null;
  status: 'loading' | 'signed-in' | 'signed-out';
  setUser: (user: SessionUser | null) => void;
  /** Reloads the signed-in member from the server (role, verification, profile). */
  refresh: () => Promise<void>;
};

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  status: 'loading',
  setUser: (user) => set({ user, status: user ? 'signed-in' : 'signed-out' }),
  refresh: async () => {
    const user = await getApi().auth.getSessionUser().catch(() => null);
    set({ user, status: user ? 'signed-in' : 'signed-out' });
  },
}));

export function useSession() {
  const user = useSessionStore((state) => state.user);
  const status = useSessionStore((state) => state.status);
  return { user, status, isSignedIn: status === 'signed-in', isLoading: status === 'loading' };
}
