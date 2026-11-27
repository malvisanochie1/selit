'use client';

import { Check, Plus, Share2 } from 'lucide-react';
import * as m from 'motion/react-m';
import { useSearchParams } from 'next/navigation';

import { EASE_OUT } from '@/components/motion/motion.constants';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { useListing } from '@/features/listings/hooks/use-listings';

export function ListingPublished() {
  const id = useSearchParams().get('id') ?? '';
  const { data: listing } = useListing(id);
  const isPending = listing?.status === 'pending';

  async function share() {
    const url = `${window.location.origin}/products/${id}`;
    const text = listing ? `${listing.title} on Selit` : 'My listing on Selit';
    if (navigator.share) await navigator.share({ title: text, url }).catch(() => undefined);
    else
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
        '_blank',
        'noopener,noreferrer',
      );
  }

  return (
    <div className="mx-auto max-w-lg py-10 text-center">
      <div className="relative mx-auto size-24">
        <m.span
          className="absolute inset-0 rounded-full bg-brand-200"
          initial={{ scale: 0.6, opacity: 0.8 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.3 }}
        />
        <m.span
          className="relative flex size-24 items-center justify-center rounded-full bg-brand-500 text-white shadow-glow"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <Check className="size-11" strokeWidth={2.6} />
        </m.span>
      </div>
      <h1 className="mt-8 text-4xl font-semibold text-ink-900">
        {isPending ? 'Sent for review' : 'Your item is live'}
      </h1>
      <p className="mt-3 text-ink-500">
        {isPending
          ? 'We check a few listings before they go live. You will see it in your listings as soon as it is approved.'
          : 'Students near you can now find it. Share it on your WhatsApp status to sell even faster.'}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={share}>
          <Share2 /> Share listing
        </Button>
        <ButtonLink href={`/products/${id}`} variant="secondary">
          View listing
        </ButtonLink>
        <ButtonLink href="/sell/item" variant="ghost">
          <Plus /> List another
        </ButtonLink>
      </div>
    </div>
  );
}
