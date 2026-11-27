import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistedStorage } from '@/lib/persisted-storage';

/** How long the app may sit in the background before it asks to unlock. */
export const LOCK_AFTER_MS = 5 * 60 * 1000;

type LockState = {
  isLocked: boolean;
  backgroundedAt: number | null;
  biometricEnabled: boolean;
  lock: () => void;
  unlock: () => void;
  markBackgrounded: () => void;
  setBiometricEnabled: (enabled: boolean) => void;
};

export const useLockStore = create<LockState>()(
  persist(
    (set) => ({
      isLocked: false,
      backgroundedAt: null,
      biometricEnabled: false,
      lock: () => set({ isLocked: true }),
      unlock: () => set({ isLocked: false, backgroundedAt: null }),
      markBackgrounded: () => set({ backgroundedAt: Date.now() }),
      setBiometricEnabled: (biometricEnabled) => set({ biometricEnabled }),
    }),
    {
      name: 'selit.lock',
      storage: persistedStorage,
      partialize: (state) => ({ biometricEnabled: state.biometricEnabled }),
    },
  ),
);
