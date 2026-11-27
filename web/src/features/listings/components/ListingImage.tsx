'use client';

import { findCategory } from '@selit/shared';

import { CATEGORY_ICONS, CATEGORY_TINTS } from '@/lib/category-style';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/cn';

type ListingImageProps = {
  src?: string;
  alt: string;
  category: string;
  sizes: string;
  priority?: boolean;
  fallbackIcon?: LucideIcon;
  /** Small thumbnails show a smaller fallback icon. */
  compact?: boolean;
  className?: string;
};

/** A listing photo that falls back to a soft category tile if there is no photo or it fails to load. */
export function ListingImage({
  src,
  alt,
  category,
  sizes,
  priority = false,
  fallbackIcon,
  compact = false,
  className,
}: ListingImageProps) {
  const [hasFailed, setHasFailed] = useState(false);
  const match = findCategory(category);
  const Icon = fallbackIcon ?? (match ? CATEGORY_ICONS[match.icon] : undefined);

  if (!src || hasFailed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'absolute inset-0 flex items-center justify-center bg-[radial-gradient(120%_90%_at_30%_20%,var(--color-brand-50),var(--color-canvas)_55%,var(--color-amber-50))]',
          className,
        )}
      >
        {Icon ? (
          <span
            className={cn(
              'flex items-center justify-center shadow-card',
              compact ? 'size-9 rounded-xl' : 'size-16 rounded-3xl',
              match ? CATEGORY_TINTS[match.tone] : 'bg-brand-50 text-brand-700',
            )}
          >
            <Icon className={compact ? 'size-4' : 'size-7'} strokeWidth={1.75} />
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={src.startsWith('blob:')}
      onError={() => setHasFailed(true)}
      className={cn('object-cover', className)}
    />
  );
}
