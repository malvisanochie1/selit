import type { SupabaseClient } from '@supabase/supabase-js';

import { adminApi } from './admin';
import { apartmentsApi } from './apartments';
import { authApi, type AuthRedirects } from './auth';
import { createContext } from './context';
import { listingsApi } from './listings';
import { profilesApi } from './profiles';
import { reviewsApi } from './reviews';
import { reportsApi, verificationApi } from './safety';

export type { AuthRedirects } from './auth';
export type { ProfileUpdateInput } from './profiles';
export type { SessionStore } from './sample-api';

function createLiveApi(client: SupabaseClient, redirects: AuthRedirects = {}) {
  const ctx = createContext(client);
  return {
    isSample: false as boolean,
    auth: authApi(ctx, redirects),
    profiles: profilesApi(ctx),
    listings: listingsApi(ctx),
    apartments: apartmentsApi(ctx),
    reviews: reviewsApi(ctx),
    reports: reportsApi(ctx),
    verification: verificationApi(ctx),
    admin: adminApi(ctx),
  };
}

/** Everything the apps can ask the backend, in one object. */
export type SelitApi = ReturnType<typeof createLiveApi>;

export { createLiveApi };
export { createSampleApi } from './sample-api';
