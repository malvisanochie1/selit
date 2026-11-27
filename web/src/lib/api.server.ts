import 'server-only';

import { createLiveApi, createSampleApi, type SelitApi } from '@selit/shared';
import { cookies } from 'next/headers';
import { cache } from 'react';

import { isSampleMode } from '@/config/env';

import { SAMPLE_SESSION_COOKIE } from './sample-session';
import { getServerClient } from './supabase/server';

/** The data layer for server components, acting as the visitor of this request. */
export const getServerApi = cache(async (): Promise<SelitApi> => {
  if (!isSampleMode) return createLiveApi(await getServerClient());
  const cookieStore = await cookies();
  return createSampleApi({
    get: () => cookieStore.get(SAMPLE_SESSION_COOKIE)?.value ?? null,
    set: () => undefined,
  });
});
