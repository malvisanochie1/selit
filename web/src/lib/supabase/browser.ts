import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

import { env } from '@/config/env';

let client: SupabaseClient | null = null;

/** One Supabase client for the whole browser session. The session lives in cookies. */
export function getBrowserClient() {
  client ??= createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
  return client;
}
