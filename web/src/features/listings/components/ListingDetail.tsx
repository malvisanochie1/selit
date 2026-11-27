'use client';

import {
  conditionLabel,
  findCategory,
  findSchoolByName,
  formatDate,
  formatNaira,
  formatRelativeTime,
  messageOf,
} from '@selit/shared';
import { Calendar, Eye, MapPin, PackageX, Tag } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

import { Reveal } from '@/components/motion/Reveal';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { EmptyState } from '@/components/ui/EmptyState';
import { Notice } from '@/components/ui/Notice';
import { Skeleton } from '@/components/ui/Skeleton';
import { SafetyTips } from '@/features/safety/components/SafetyTips';
import { SaveButton } from '@/features/saved/SaveButton';
import { rememberRecentListing } from '@/features/saved/use-saved-listings';

import { useListing, useListings } from '../hooks/use-listings';
import { recordListingView } from '../listings.api';
import type { Listing } from '../listing.types';
import { ContactSellerPanel } from './ContactSellerPanel';
import { ListingGallery } from './ListingGallery';
import { ListingGrid } from './ListingGrid';

const STATUS_NOTICES = {
  sold: { tone: 'warning', title: 'This item has been sold.' },
  pending: { tone: 'info', title: 'This listing is being reviewed by our team.' },
  rejected: { tone: 'danger', title: 'This listing was not approved.' },
  removed: { tone: 'danger', title: 'This listing was removed.' },
} as const;

function DetailSkeleton() {
  return (
    <div className="grid gap-10 pt-8 lg:grid-cols-[1.25fr_1fr]">
      <Skeleton className="aspect-[4/3] rounded-[1.75rem]" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-44 w-full rounded-3xl" />
      </div>
    </div>
  );
}

type ListingDetailProps = {
  listingId: string;
  initialListing: Listing | null;
};

export function ListingDetail({ listingId, initialListing }: ListingDetailProps) {
  const { data: listing, isPending, isError, error } = useListing(listingId, initialListing);
  const similar = useListings(
    { category: listing?.category, limit: 5, sort: 'newest' },
    Boolean(listing?.category),
  );

  useEffect(() => {
    if (listing) rememberRecentListing(listing.id);
  }, [listing]);

  // One view per visitor per day; the database ignores repeats.
  useEffect(() => {
    void recordListingView(listingId);
  }, [listingId]);

  if (isPending) return <DetailSkeleton />;
  if (isError) {
    return (
      <EmptyState
        className="mt-10"
        icon={<PackageX />}
        title="This item isn't available"
        description={messageOf(error)}
        action={<ButtonLink href="/search">Browse other items</ButtonLink>}
      />
    );
  }

  const category = findCategory(listing.category);
  const school = findSchoolByName(listing.school);
  const statusNotice = listing.status === 'active' ? null : STATUS_NOTICES[listing.status];
  const similarItems = (similar.data?.items ?? [])
    .filter((item) => item.id !== listing.id)
    .slice(0, 4);

  const facts = [
    { icon: Tag, label: 'Category', value: category?.name ?? 'Other' },
    { icon: MapPin, label: 'Meet-up spot', value: listing.location },
    { icon: Calendar, label: 'Listed', value: formatDate(listing.createdAt) },
    { icon: Eye, label: 'Views', value: listing.viewsCount.toLocaleString('en-NG') },
  ];

  return (
    <>
      <nav aria-label="Breadcrumb" className="pt-6 pb-5 text-sm text-ink-500 sm:pt-8">
        <Link href="/search" className="hover:text-ink-900">
          Browse
        </Link>
        {category ? (
          <>
            <span className="mx-1.5 text-ink-300">/</span>
            <Link href={`/categories/${category.slug}`} className="hover:text-ink-900">
              {category.name}
            </Link>
          </>
        ) : null}
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        <Reveal>
          <ListingGallery
            images={listing.images}
            title={listing.title}
            category={listing.category}
            overlay={
              <SaveButton
                listingId={listing.id}
                title={listing.title}
                className="absolute top-4 right-4 z-10 size-11"
              />
            }
          />
        </Reveal>

        <Reveal delay={0.08} className="lg:sticky lg:top-28 lg:self-start">
          {statusNotice ? (
            <Notice tone={statusNotice.tone} title={statusNotice.title} className="mb-5" />
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{conditionLabel(listing.condition)}</Badge>
            {school ? <Badge>{school.shortName || school.city}</Badge> : null}
            <span className="text-sm text-ink-500" suppressHydrationWarning>
              {formatRelativeTime(listing.createdAt)}
            </span>
          </div>
          <h1 className="mt-4 text-3xl leading-tight font-semibold text-ink-900 sm:text-4xl">
            {listing.title}
          </h1>
          <p className="mt-3 font-display text-4xl font-bold tracking-tight text-brand-700">
            {formatNaira(listing.price)}
          </p>
          <div className="mt-7">
            <ContactSellerPanel listing={listing} />
          </div>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        <Reveal as="section">
          <h2 className="text-2xl font-semibold text-ink-900">About this item</h2>
          <p className="mt-4 text-base leading-relaxed whitespace-pre-line text-ink-700">
            {listing.description}
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-3">
            {facts.map((fact) => (
              <div key={fact.label} className="rounded-2xl border border-line bg-surface p-4">
                <dt className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-ink-500 uppercase">
                  <fact.icon className="size-3.5" />
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-[0.95rem] font-semibold text-ink-900">{fact.value}</dd>
              </div>
            ))}
          </dl>
          {school ? (
            <p className="mt-4 text-sm text-ink-500">
              Near{' '}
              <Link
                href={`/schools/${school.slug}`}
                className="font-semibold text-brand-700 hover:underline"
              >
                {school.name}
              </Link>
            </p>
          ) : null}
        </Reveal>
        <Reveal as="section" delay={0.08}>
          <SafetyTips />
        </Reveal>
      </div>

      {similarItems.length ? (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-ink-900">More like this</h2>
          <ListingGrid listings={similarItems} className="mt-6" />
        </section>
      ) : null}
    </>
  );
}
