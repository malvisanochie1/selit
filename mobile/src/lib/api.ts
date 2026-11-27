import AsyncStorage from '@react-native-async-storage/async-storage';
import { createLiveApi, createSampleApi, type SelitApi } from '@selit/shared';
import * as Linking from 'expo-linking';

import { isSampleMode } from '@/config/env';

import { getSupabase } from './supabase';

let instance: SelitApi | null = null;

/** The one data layer for the whole app: live Supabase, or sample data until keys are added. */
export function getApi(): SelitApi {
  instance ??= isSampleMode
    ? createSampleApi({
        get: (key) => AsyncStorage.getItem(key),
        set: (key, value) =>
          value ? AsyncStorage.setItem(key, value) : AsyncStorage.removeItem(key),
      })
    : createLiveApi(getSupabase(), {
        emailConfirmed: Linking.createURL('/sign-in'),
        passwordReset: Linking.createURL('/reset-password'),
      });
  return instance;
}
