'use client';

import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'selit.saved-listings';
const RECENT_KEY = 'selit.recent-listings';
const MAX_RECENT = 12;
const EMPTY: string[] = [];

const listeners = new Set<() => void>();
const cache = new Map<string, string[]>();

function read(key: string): string[] {
  if (typeof window === 'undefined') return EMPTY;
  const cached = cache.get(key);
  if (cached) return cached;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(key) ?? '[]');
    const ids = Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string')
      : [];
    cache.set(key, ids);
    return ids;
  } catch {
    cache.set(key, EMPTY);
    return EMPTY;
  }
}

function write(key: string, ids: string[]) {
  cache.set(key, ids);
  try {
    window.localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // Storage can be full or blocked; the in-memory copy still works this visit.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === RECENT_KEY) {
      cache.delete(event.key);
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

/** Saved items live on this device, so people can save without an account. */
export function useSavedListings() {
  const savedIds = useSyncExternalStore(
    subscribe,
    () => read(STORAGE_KEY),
    () => EMPTY,
  );

  const toggle = useCallback((id: string) => {
    const current = read(STORAGE_KEY);
    const next = current.includes(id)
      ? current.filter((savedId) => savedId !== id)
      : [id, ...current];
    write(STORAGE_KEY, next);
    return next.includes(id);
  }, []);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  return { savedIds, isSaved, toggle };
}

export function useRecentListings() {
  return useSyncExternalStore(
    subscribe,
    () => read(RECENT_KEY),
    () => EMPTY,
  );
}

export function rememberRecentListing(id: string) {
  const current = read(RECENT_KEY);
  write(RECENT_KEY, [id, ...current.filter((recentId) => recentId !== id)].slice(0, MAX_RECENT));
}
