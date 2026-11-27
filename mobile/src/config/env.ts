// Public values are inlined at build time, so each one is read explicitly.
export const env = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  siteUrl: process.env.EXPO_PUBLIC_SITE_URL ?? 'https://selit.ng',
  supportEmail: process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? 'support@selit.ng',
} as const;

/** Without Supabase keys the app runs on built-in sample data, end to end. */
export const isSampleMode = !env.supabaseUrl || !env.supabaseAnonKey;
