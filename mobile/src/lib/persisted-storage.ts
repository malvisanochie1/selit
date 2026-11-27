import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/** Non-secret app preferences (saved items, onboarding seen) kept between launches. */
export const persistedStorage = createJSONStorage(() => AsyncStorage);
