'use client';

import { callLink, maskPhone, whatsAppLink } from '@selit/shared';
import {
  BadgeCheck,
  ChevronRight,
  Flag,
  Lock,
  MessageCircle,
  Pencil,
  Phone,
  Share2,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Avatar } from '@/components/ui/Avatar';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Button } from '@/components/ui/Button';
import { buttonStyles } from '@/components/ui/button-styles';
import { RatingStars } from '@/components/ui/RatingStars';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSession } from '@/features/auth/hooks/use-session';
import { ReportDialog } from '@/features/reports/components/ReportDialog';
import { useSellerReviews } from '@/features/reviews/hooks/use-reviews';
import { ShareMeetupDialog } from '@/features/safety/components/ShareMeetupDialog';

import type { Listing } from '../listing.types';

export function ContactSellerPanel({ listing }: { listing: Listing }) {
  const pathname = usePathname();
  const { user, isLoading } = useSession();
  const { data: reviews } = useSellerReviews(listing.sellerId || listing.seller?.id);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const seller = listing.seller;
  const sellerName = seller?.fullName ?? 'Selit seller';
  const phone = seller?.whatsApp ?? '';
  const isOwner = user?.id === listing.sellerId;
  const isAvailable = listing.status === 'active';
  const message = `Hi ${sellerName.split(' ')[0]}, I saw your "${listing.title}" on Selit. Is it still available?`;
  const whatsApp = phone ? whatsAppLink(phone, message) : null;
  const call = phone ? callLink(phone) : null;

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-line bg-surface p-5">
        <Link href={`/sellers/${listing.sellerId}`} className="group flex items-center gap-3">
          <Avatar name={sellerName} src={seller?.profileImageUrl} size={52} />
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5 font-semibold text-ink-900">
              <span className="truncate">{sellerName}</span>
              {seller?.verificationStatus === 'verified' ? (
                <BadgeCheck
                  className="size-4.5 shrink-0 text-brand-600"
                  aria-label="Verified seller"
                />
              ) : null}
            </span>
            {reviews && reviews.reviewCount > 0 ? (
              <span className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-500">
                <RatingStars rating={reviews.averageRating} />
                {reviews.averageRating.toFixed(1)} · {reviews.reviewCount} reviews
              </span>
            ) : (
              <span className="mt-0.5 block text-sm text-ink-500">New on Selit</span>
            )}
          </span>
          <ChevronRight className="size-5 text-ink-300 transition-transform duration-500 group-hover:translate-x-0.5" />
        </Link>

        <div className="mt-5 space-y-2.5">
          {isOwner ? (
            <ButtonLink
              href={`/seller/listings/${listing.id}/edit`}
              variant="dark"
              fullWidth
              size="lg"
            >
              <Pencil /> Edit your listing
            </ButtonLink>
          ) : isLoading ? (
            <Skeleton className="h-13 w-full" />
          ) : !user ? (
            <>
              <ButtonLink
                href={`/sign-in?next=${encodeURIComponent(pathname)}`}
                fullWidth
                size="lg"
              >
                <Lock /> Sign in to contact seller
              </ButtonLink>
              <p className="text-center text-xs text-ink-500">
                {phone ? maskPhone(phone) : 'Phone numbers are shown to signed-in students only.'}
              </p>
            </>
          ) : !isAvailable ? (
            <p className="rounded-2xl bg-canvas p-4 text-center text-sm text-ink-600">
              This item is no longer available.
            </p>
          ) : whatsApp ? (
            <>
              <a
                href={whatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles({ variant: 'whatsapp', size: 'lg', fullWidth: true })}
              >
                <MessageCircle /> Chat on WhatsApp
              </a>
              {call ? (
                <a
                  href={call}
                  className={buttonStyles({ variant: 'secondary', size: 'lg', fullWidth: true })}
                >
                  <Phone /> Call {sellerName.split(' ')[0]}
                </a>
              ) : null}
            </>
          ) : (
            <p className="rounded-2xl bg-canvas p-4 text-center text-sm text-ink-600">
              This seller hasn&apos;t added a phone number yet.
            </p>
          )}
        </div>
      </div>

      {!isOwner ? (
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => setIsShareOpen(true)}>
            <Share2 /> Share meet-up
          </Button>
          <Button
            variant="ghost"
            className="text-danger-600 hover:bg-danger-50 hover:text-danger-700"
            onClick={() => setIsReportOpen(true)}
          >
            <Flag /> Report
          </Button>
        </div>
      ) : null}

      <ShareMeetupDialog
        open={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        sellerName={sellerName}
        sellerPhone={user ? phone : undefined}
        itemTitle={listing.title}
        defaultPlace={listing.location}
      />
      <ReportDialog
        open={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetType="listing"
        targetId={listing.id}
        targetLabel={listing.title}
      />
    </div>
  );
}
