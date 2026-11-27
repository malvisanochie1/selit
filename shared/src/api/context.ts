import type { SupabaseClient } from '@supabase/supabase-js';

import { ApiError, toApiError } from '../errors';
import type { PhotoUpload } from '../types';

export type Bucket =
  'listing-photos' | 'apartment-photos' | 'avatars' | 'verifications' | 'listing-checks';

export type ApiContext = {
  client: SupabaseClient;
  /** The signed-in member's id, or null for visitors. */
  currentUserId(): Promise<string | null>;
  requireUserId(): Promise<string>;
  publicUrl(bucket: Bucket, path: string | null | undefined): string;
  upload(bucket: Bucket, photo: PhotoUpload, name?: string): Promise<string>;
  remove(bucket: Bucket, paths: string[]): Promise<void>;
};

function fileId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createContext(client: SupabaseClient): ApiContext {
  async function currentUserId() {
    const { data } = await client.auth.getSession();
    return data.session?.user.id ?? null;
  }

  async function requireUserId() {
    const id = await currentUserId();
    if (!id) throw new ApiError('Please sign in to continue.', 401, 'sign_in_required');
    return id;
  }

  return {
    client,
    currentUserId,
    requireUserId,

    publicUrl(bucket, path) {
      if (!path) return '';
      if (/^https?:\/\//.test(path)) return path;
      return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    },

    // Every file goes into the uploader's own folder; storage policies refuse anything else.
    async upload(bucket, photo, name) {
      const userId = await requireUserId();
      const extension =
        photo.contentType === 'image/webp'
          ? 'webp'
          : photo.contentType === 'image/png'
            ? 'png'
            : 'jpg';
      const path = `${userId}/${name ?? fileId()}.${extension}`;
      const { error } = await client.storage.from(bucket).upload(path, photo.body, {
        contentType: photo.contentType,
        cacheControl: '31536000',
        upsert: false,
      });
      if (error) throw toApiError(error);
      return path;
    },

    async remove(bucket, paths) {
      if (!paths.length) return;
      await client.storage.from(bucket).remove(paths);
    },
  };
}

/** Unwraps a Supabase response, turning errors into friendly ApiErrors. */
export function unwrap<T>(result: { data: T; error: unknown }): NonNullable<T> {
  if (result.error) throw toApiError(result.error);
  if (result.data === null || result.data === undefined)
    throw new ApiError("We couldn't find what you were looking for.", 404, 'not_found');
  return result.data;
}

export function pageRange(page = 1, limit = 12) {
  const safeLimit = Math.max(1, Math.min(100, limit));
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * safeLimit;
  return { page: safePage, limit: safeLimit, from, to: from + safeLimit - 1 };
}

export function pagination(total: number, page: number, limit: number) {
  return { total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) };
}

/** Strips characters that have meaning in PostgREST filter strings. */
export function searchTerm(value: string | undefined) {
  const cleaned = (value ?? '')
    .replace(/[,()%*\\.:"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.slice(0, 60);
}
