import type { PhotoUpload } from '@selit/shared';

import { compressImage } from './compress-image';

/** Shrinks a picked photo to WebP and wraps it for upload. */
export async function toPhotoUpload(file: File, maxEdge?: number): Promise<PhotoUpload> {
  const compressed = await compressImage(file, maxEdge);
  return {
    body: compressed,
    contentType: compressed.type || 'image/jpeg',
    previewUrl: URL.createObjectURL(compressed),
  };
}

export function toPhotoUploads(files: File[], maxEdge?: number) {
  return Promise.all(files.map((file) => toPhotoUpload(file, maxEdge)));
}
