// Public values are inlined at build time, so each one is read explicitly.
export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@selit.ng',
} as const;

/**
 * Until the Supabase keys are added, the whole site runs on built-in sample
 * data so every page can be seen and tested.
 */
export const isSampleMode = !env.supabaseUrl || !env.supabaseAnonKey;
