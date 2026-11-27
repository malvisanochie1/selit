'use client';

import { useQuery } from '@tanstack/react-query';
import { Camera, KeyRound } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';

import { Skeleton } from '@/components/ui/Skeleton';

import { requestCheckCode } from '../listing-checks.api';

type CheckCodePanelProps = {
  photo: File | null;
  onPhoto: (photo: File | null) => void;
  onCode: (checkId: string) => void;
};

/**
 * Shown to new sellers and for unusually cheap items. The seller writes the code
 * on paper and takes one extra photo with it beside the item. Buyers never see it.
 */
export function CheckCodePanel({ photo, onPhoto, onCode }: CheckCodePanelProps) {
  const { data, isPending } = useQuery({
    queryKey: ['listing-check-code'],
    queryFn: async () => {
      const check = await requestCheckCode();
      onCode(check.id);
      return check;
    },
    staleTime: 25 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const previewUrl = useMemo(() => (photo ? URL.createObjectURL(photo) : ''), [photo]);

  return (
    <div className="rounded-3xl border border-amber-300/60 bg-amber-50/70 p-5">
      <h3 className="flex items-center gap-2 font-sans text-base font-semibold text-ink-900">
        <KeyRound className="size-5 text-amber-600" /> One quick check
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
        Write this code on a piece of paper, place it next to the item, and take one photo. Only our
        team sees it. It proves the item is really with you.
      </p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        {isPending ? (
          <Skeleton className="h-16 w-44" />
        ) : (
          <p className="rounded-2xl border-2 border-dashed border-amber-400 bg-white px-6 py-3 text-center font-display text-3xl font-bold tracking-[0.12em] text-ink-900">
            {data?.code}
          </p>
        )}
        {photo ? (
          <div className="flex items-center gap-3">
            <Image
              src={previewUrl}
              alt="Check photo"
              width={64}
              height={64}
              unoptimized
              className="size-16 rounded-xl object-cover"
            />
            <button
              type="button"
              onClick={() => onPhoto(null)}
              className="cursor-pointer text-sm font-semibold text-ink-600 hover:text-ink-900"
            >
              Retake
            </button>
          </div>
        ) : (
          <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-2xl bg-ink-900 px-5 text-sm font-semibold text-white transition-transform active:scale-[0.96]">
            <Camera className="size-4" /> Add the check photo
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              className="sr-only"
              onChange={(event) => onPhoto(event.target.files?.[0] ?? null)}
            />
          </label>
        )}
      </div>
    </div>
  );
}
