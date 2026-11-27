import 'server-only';

import type { Listing } from '@selit/shared';
import { cache } from 'react';

import { getServerApi } from '@/lib/api.server';

/** Fetches an item once per request for link previews and the first render. */
export const getListingSummary = cache(async (id: string): Promise<Listing | null> => {
  try {
    const api = await getServerApi();
    return await api.listings.get(id);
  } catch {
    return null;
  }
});
