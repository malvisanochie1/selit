'use client';

import {
  apartmentTypeLabel,
  callLink,
  daysSince,
  findSchoolByName,
  formatNaira,
  messageOf,
  RENEWAL_DAYS,
  whatsAppLink,
} from '@selit/shared';
import {
  BadgeCheck,
  Building2,
  Check,
  Clock,
  Flag,
  HousePlus,
  Lock,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  ShieldCheck,
  ThumbsUp,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Reveal } from '@/components/motion/Reveal';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { buttonStyles } from '@/components/ui/button-styles';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { EmptyState } from '@/components/ui/EmptyState';
import { Notice } from '@/components/ui/Notice';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSession } from '@/features/auth/hooks/use-session';
import { ListingGallery } from '@/features/listings/components/ListingGallery';
import { ReportDialog } from '@/features/reports/components/ReportDialog';
import { SafetyTips } from '@/features/safety/components/SafetyTips';

import { recordApartmentView } from '../apartments.api';
import { useApartment, useApartmentAction } from '../hooks/use-apartments';

export function ApartmentDetail({ apartmentId }: { apartmentId: string }) {
  const pathname = usePathname();
  const { user } = useSession();
  const { data: apartment, isPending, isError, error } = useApartment(apartmentId);
  const action = useApartmentAction(apartmentId);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    void recordApartmentView(apartmentId);
  }, [apartmentId]);

  if (isPending) {
    return (
      <div className="grid gap-10 pt-10 lg:grid-cols-[1.25fr_1fr]">
        <Skeleton className="aspect-[4/3] rounded-[1.75rem]" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }
  if (isError) {
    return (
      <EmptyState
        className="mt-10"
        icon={<HousePlus />}
        title="This room isn't available"
        description={messageOf(error)}
        action={<ButtonLink href="/apartments">See other rooms</ButtonLink>}
      />
    );
  }

  const school = findSchoolByName(apartment.school);
  const renewedDays = daysSince(apartment.lastRenewedAt);
  const isOwner = user?.id === apartment.agent.id;
  const isTaken = apartment.status === 'taken';
  const total = apartment.rentPerYear + apartment.agencyFee + apartment.cautionFee;
  const whatsApp = apartment.agent.whatsApp
    ? whatsAppLink(
        apartment.agent.whatsApp,
        `Hi, I saw "${apartment.title}" on Selit. Is it still available for inspection?`,
      )
    : null;
  const call = apartment.agent.whatsApp ? callLink(apartment.agent.whatsApp) : null;

  const costs = [
    { label: 'Rent per year', value: apartment.rentPerYear },
    { label: 'Agency fee', value: apartment.agencyFee },
    { label: 'Caution fee (refundable)', value: apartment.cautionFee },
  ];

  return (
    <>
      <div className="grid gap-8 pt-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        <Reveal>
          <ListingGallery
            images={apartment.images}
            title={apartment.title}
            category="Other"
            fallbackIcon={Building2}
          />
        </Reveal>

        <Reveal delay={0.08} className="lg:sticky lg:top-28 lg:self-start">
          {isTaken ? (
            <Notice tone="warning" title="This room has been taken." className="mb-5" />
          ) : null}
          {!apartment.isConfirmed ? (
            <Notice tone="warning" title="Not yet confirmed" className="mb-5">
              We haven&apos;t confirmed these photos with the agent yet. Inspect in person and never
              pay before you see the room.
            </Notice>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Badge tone="brand">{apartmentTypeLabel(apartment.type)}</Badge>
            <Badge icon={<Clock />}>
              {renewedDays === 0 ? 'Confirmed free today' : `Confirmed free ${renewedDays}d ago`}
            </Badge>
          </div>
          <h1 className="mt-4 text-3xl leading-tight font-semibold text-ink-900 sm:text-4xl">
            {apartment.title}
          </h1>
          <p className="mt-3 flex items-center gap-1.5 text-ink-600">
            <MapPin className="size-4 text-ink-400" />
            {apartment.area} · {apartment.distanceToCampus} to {school?.shortName || 'campus'}
          </p>

          <div className="mt-6 rounded-3xl border border-line bg-surface p-5">
            <dl className="space-y-2.5">
              {costs.map((cost) => (
                <div key={cost.label} className="flex justify-between text-sm">
                  <dt className="text-ink-500">{cost.label}</dt>
                  <dd className="font-semibold text-ink-900 tabular-nums">
                    {formatNaira(cost.value)}
                  </dd>
                </div>
              ))}
              <div className="flex justify-between border-t border-line pt-3">
                <dt className="font-semibold text-ink-900">Total to move in</dt>
                <dd className="font-display text-2xl font-bold text-brand-700 tabular-nums">
                  {formatNaira(total)}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex items-center gap-3 border-t border-line pt-5">
              <Avatar
                name={apartment.agent.fullName}
                src={apartment.agent.profileImageUrl}
                size={44}
              />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 font-semibold text-ink-900">
                  {apartment.agent.fullName}
                  {apartment.agent.isVerified ? (
                    <BadgeCheck className="size-4 text-brand-600" />
                  ) : null}
                </p>
                <p className="text-sm text-ink-500">
                  {apartment.agent.agencyName || 'Independent agent'} ·{' '}
                  {apartment.agent.isVerified ? 'ID verified' : 'Not yet verified'}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              {isOwner ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button
                    variant="dark"
                    onClick={() => action.mutate('renew')}
                    isLoading={action.isPending}
                  >
                    <RefreshCw /> Still available
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => action.mutate('mark-taken')}
                    disabled={isTaken}
                  >
                    <Check /> Mark as taken
                  </Button>
                </div>
              ) : !user ? (
                <ButtonLink
                  href={`/sign-in?next=${encodeURIComponent(pathname)}`}
                  fullWidth
                  size="lg"
                >
                  <Lock /> Sign in to contact the agent
                </ButtonLink>
              ) : isTaken ? null : whatsApp ? (
                <>
                  <a
                    href={whatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonStyles({ variant: 'whatsapp', size: 'lg', fullWidth: true })}
                  >
                    <MessageCircle /> Book an inspection
                  </a>
                  {call ? (
                    <a
                      href={call}
                      className={buttonStyles({
                        variant: 'secondary',
                        size: 'lg',
                        fullWidth: true,
                      })}
                    >
                      <Phone /> Call the agent
                    </a>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
          {isOwner ? (
            <p className="mt-3 text-xs text-ink-500">
              Tap “Still available” at least every {RENEWAL_DAYS} days, or the listing is hidden
              automatically.
            </p>
          ) : null}
        </Reveal>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        <Reveal as="section">
          <h2 className="text-2xl font-semibold text-ink-900">About this room</h2>
          <p className="mt-4 leading-relaxed whitespace-pre-line text-ink-700">
            {apartment.description}
          </p>
          <h3 className="mt-8 font-sans text-base font-semibold text-ink-900">
            What&apos;s included
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {apartment.amenities.map((amenity) => (
              <li
                key={amenity}
                className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-800"
              >
                <Check className="size-3.5" /> {amenity}
              </li>
            ))}
          </ul>

          {!isOwner ? (
            <div className="mt-8 rounded-3xl border border-line bg-surface p-5">
              <h3 className="flex items-center gap-2 font-sans text-base font-semibold text-ink-900">
                <ShieldCheck className="size-5 text-brand-600" /> Help the next student
              </h3>
              <p className="mt-1 text-sm text-ink-500">
                {apartment.visitorConfirmations
                  ? `${apartment.visitorConfirmations} students inspected this room and confirmed it is real.`
                  : 'Inspected this room? Let others know it is real.'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={!user || confirmed}
                  onClick={() =>
                    action.mutate('confirm-real', { onSuccess: () => setConfirmed(true) })
                  }
                >
                  <ThumbsUp /> {confirmed ? 'Thanks!' : 'I inspected it, it’s real'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={!user}
                  onClick={() => action.mutate('report-taken')}
                >
                  Already taken?
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-danger-600"
                  onClick={() => setIsReportOpen(true)}
                >
                  <Flag /> Report
                </Button>
              </div>
            </div>
          ) : null}
        </Reveal>
        <Reveal as="section" delay={0.08}>
          <SafetyTips variant="apartment" />
        </Reveal>
      </div>

      <ReportDialog
        open={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetType="apartment"
        targetId={apartment.id}
        targetLabel={apartment.title}
      />
    </>
  );
}
