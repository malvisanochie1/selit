import { findSchoolBySlug, SCHOOL_KIND_LABELS, SCHOOLS, stateLabel } from '@selit/shared';
import { Building2 } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { ListingBrowser } from '@/features/listings/components/ListingBrowser';
import { ListingGridSkeleton } from '@/features/listings/components/ListingGrid';

type SchoolPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SCHOOLS.map((school) => ({ slug: school.slug }));
}

export async function generateMetadata({ params }: SchoolPageProps): Promise<Metadata> {
  const school = findSchoolBySlug((await params).slug);
  return school
    ? {
        title: `Buy and sell at ${school.shortName || school.name}`,
        description: `Used items and rooms from students at ${school.name}.`,
      }
    : {};
}

export default async function SchoolPage({ params }: SchoolPageProps) {
  const school = findSchoolBySlug((await params).slug);
  if (!school) notFound();

  return (
    <div className="container-page">
      <PageHeader
        eyebrow={`${SCHOOL_KIND_LABELS[school.kind]} · ${stateLabel(school.state)}`}
        title={school.name}
        description={`Items from students at ${school.shortName || school.name}${school.city ? ` in ${school.city}` : ''}.`}
        crumbs={[
          { href: '/', label: 'Home' },
          { href: '/schools', label: 'Schools' },
        ]}
        action={
          <ButtonLink href="/apartments" variant="secondary">
            <Building2 /> Rooms nearby
          </ButtonLink>
        }
      />
      <Suspense fallback={<ListingGridSkeleton />}>
        <ListingBrowser fixed={{ school: school.name }} />
      </Suspense>
    </div>
  );
}
