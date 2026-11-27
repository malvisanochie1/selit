import 'react-native-url-polyfill/auto';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

import { env } from '@/config/env';

import { secureStorage } from './secure-storage';

let client: SupabaseClient | null = null;

export function getSupabase() {
  if (client) return client;
  client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      storage: secureStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'pkce',
    },
  });

  // Refresh tokens only while the app is open, as Supabase recommends for mobile.
  if (Platform.OS !== 'web') {
    AppState.addEventListener('change', (state) => {
      if (state === 'active') void client?.auth.startAutoRefresh();
      else void client?.auth.stopAutoRefresh();
    });
  }
  return client;
}
