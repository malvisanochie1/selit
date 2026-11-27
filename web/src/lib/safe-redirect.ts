/**
 * Only same-site relative paths are accepted, so a crafted ?next= link can never
 * send someone to another website after signing in.
 */
export function safeRedirectPath(value: string | null | undefined, fallback = '/account') {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) {
    return fallback;
  }
  try {
    const url = new URL(value, 'https://selit.local');
    return url.origin === 'https://selit.local' ? `${url.pathname}${url.search}` : fallback;
  } catch {
    return fallback;
  }
}
