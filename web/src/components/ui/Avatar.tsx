import { initialsOf } from '@selit/shared';
import Image from 'next/image';

import { cn } from '@/lib/cn';

type AvatarProps = {
  name: string;
  src?: string;
  size?: number;
  className?: string;
};

const PALETTE = [
  'bg-brand-100 text-brand-800',
  'bg-amber-100 text-amber-700',
  'bg-info-50 text-info-700',
  'bg-ink-100 text-ink-700',
];

function paletteFor(name: string) {
  const code = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return PALETTE[code % PALETTE.length];
}

export function Avatar({ name, src, size = 40, className }: AvatarProps) {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-display font-semibold',
        !src && paletteFor(name),
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {src ? (
        <Image src={src} alt={name} fill sizes={`${size}px`} className="object-cover" />
      ) : (
        <span aria-hidden="true">{initialsOf(name) || 'S'}</span>
      )}
      {!src ? <span className="sr-only">{name}</span> : null}
    </span>
  );
}
