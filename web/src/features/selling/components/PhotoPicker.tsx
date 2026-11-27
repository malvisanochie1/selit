'use client';

import { ImagePlus, Star, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo } from 'react';

import { cn } from '@/lib/cn';

export const MAX_PHOTOS = 5;
export const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

export type PhotoItem = { kind: 'existing'; url: string } | { kind: 'new'; file: File };

type PhotoPickerProps = {
  photos: PhotoItem[];
  onChange: (photos: PhotoItem[]) => void;
  onError: (message: string) => void;
  error?: string;
};

function usePreviewUrls(photos: PhotoItem[]) {
  const urls = useMemo(
    () =>
      photos.map((photo) =>
        photo.kind === 'existing' ? photo.url : URL.createObjectURL(photo.file),
      ),
    [photos],
  );
  useEffect(
    () => () => urls.forEach((url) => url.startsWith('blob:') && URL.revokeObjectURL(url)),
    [urls],
  );
  return urls;
}

/** Up to five photos from the gallery or camera. The first one is the cover. */
export function PhotoPicker({ photos, onChange, onError, error }: PhotoPickerProps) {
  const urls = usePreviewUrls(photos);

  function add(files: FileList | null) {
    if (!files?.length) return;
    const accepted: PhotoItem[] = [];
    for (const file of Array.from(files)) {
      if (!ACCEPTED.includes(file.type)) {
        onError('Only JPG, PNG or WebP photos can be added.');
        continue;
      }
      if (file.size > MAX_PHOTO_BYTES) {
        onError(`${file.name} is larger than 8 MB.`);
        continue;
      }
      accepted.push({ kind: 'new', file });
    }
    const next = [...photos, ...accepted];
    if (next.length > MAX_PHOTOS) onError(`You can add up to ${MAX_PHOTOS} photos.`);
    onChange(next.slice(0, MAX_PHOTOS));
  }

  return (
    <div>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {photos.map((photo, index) => (
          <li
            key={urls[index]}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-canvas ring-1 ring-line"
          >
            <Image
              src={urls[index]}
              alt={`Photo ${index + 1}`}
              fill
              sizes="160px"
              unoptimized
              className="object-cover"
            />
            {index === 0 ? (
              <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-full bg-ink-900/80 px-2 py-0.5 text-[0.65rem] font-semibold text-white">
                <Star className="size-3 fill-amber-400 text-amber-400" /> Cover
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onChange([photo, ...photos.filter((_, other) => other !== index)])}
                className="absolute bottom-1.5 left-1.5 cursor-pointer rounded-full bg-white/90 px-2 py-0.5 text-[0.65rem] font-semibold text-ink-800 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
              >
                Make cover
              </button>
            )}
            <button
              type="button"
              aria-label={`Remove photo ${index + 1}`}
              onClick={() => onChange(photos.filter((_, other) => other !== index))}
              className="absolute top-1.5 right-1.5 flex size-7 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink-800 shadow-card transition-transform active:scale-90"
            >
              <X className="size-4" />
            </button>
          </li>
        ))}
        {photos.length < MAX_PHOTOS ? (
          <li>
            <label
              className={cn(
                'flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed text-sm font-semibold transition-colors',
                error
                  ? 'border-danger-500 text-danger-600'
                  : 'border-line-strong text-ink-500 hover:border-brand-400 hover:text-brand-700',
              )}
            >
              <ImagePlus className="size-6" />
              Add photo
              <input
                type="file"
                multiple
                accept={ACCEPTED.join(',')}
                className="sr-only"
                onChange={(event) => {
                  add(event.target.files);
                  event.target.value = '';
                }}
              />
            </label>
          </li>
        ) : null}
      </ul>
      <p className={cn('mt-2 text-sm', error ? 'font-medium text-danger-600' : 'text-ink-500')}>
        {error ??
          `Add up to ${MAX_PHOTOS} clear photos in daylight. Photos are resized on your phone before upload.`}
      </p>
    </div>
  );
}
