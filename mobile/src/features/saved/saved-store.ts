import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistedStorage } from '@/lib/persisted-storage';

type SavedState = {
  ids: string[];
  toggle: (id: string) => void;
};

/** Saved items live on the phone, so saving works before signing in. */
export const useSavedStore = create<SavedState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((saved) => saved !== id)
            : [id, ...state.ids].slice(0, 200),
        })),
    }),
    { name: 'selit.saved', storage: persistedStorage },
  ),
);

export function useIsSaved(id: string) {
  return useSavedStore((state) => state.ids.includes(id));
}
