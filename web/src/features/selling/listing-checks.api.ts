import type { CheckCode } from '@selit/shared';

import { getApi } from '@/lib/api';

export type { CheckCode };

/**
 * A short one-time code the seller writes on paper and photographs beside the
 * item. Only the server issues and checks codes; reviewers see the photo privately.
 */
export function requestCheckCode(): Promise<CheckCode> {
  return getApi().listings.requestCheckCode();
}
