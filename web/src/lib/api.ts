import { createLiveApi, createSampleApi, type SelitApi } from '@selit/shared';

import { env, isSampleMode } from '@/config/env';

import { cookieSessionStore } from './sample-session';
import { getBrowserClient } from './supabase/browser';

let instance: SelitApi | null = null;

/** The data layer used by every client component. */
export function getApi(): SelitApi {
  instance ??= isSampleMode
    ? createSampleApi(cookieSessionStore)
    : createLiveApi(getBrowserClient(), {
        emailConfirmed: `${env.siteUrl}/auth/confirm?next=/account`,
        passwordReset: `${env.siteUrl}/auth/confirm?next=/reset-password`,
      });
  return instance;
}
