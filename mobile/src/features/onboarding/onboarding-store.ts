import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistedStorage } from '@/lib/persisted-storage';

type OnboardingState = {
  hasSeenOnboarding: boolean;
  isHydrated: boolean;
  finish: () => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      isHydrated: false,
      finish: () => set({ hasSeenOnboarding: true }),
    }),
    {
      name: 'selit.onboarding',
      storage: persistedStorage,
      partialize: (state) => ({ hasSeenOnboarding: state.hasSeenOnboarding }),
      onRehydrateStorage: () => () => useOnboardingStore.setState({ isHydrated: true }),
    },
  ),
);
