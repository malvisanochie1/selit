import type { SessionStore } from '@selit/shared';

/** Sample mode remembers who is signed in with a cookie, so server pages know too. */
export const SAMPLE_SESSION_COOKIE = 'selit_sample';

export const cookieSessionStore: SessionStore = {
  get() {
    const match = document.cookie.match(new RegExp(`(?:^|; )${SAMPLE_SESSION_COOKIE}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  },
  set(_key, value) {
    document.cookie = value
      ? `${SAMPLE_SESSION_COOKIE}=${encodeURIComponent(value)}; path=/; max-age=2592000; samesite=lax`
      : `${SAMPLE_SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
  },
};
