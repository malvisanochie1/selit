import { CATEGORIES, findCategory } from '@selit/shared';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { PageHeader } from '@/components/layout/PageHeader';
import { ListingBrowser } from '@/features/listings/components/ListingBrowser';
import { ListingGridSkeleton } from '@/features/listings/components/ListingGrid';

type CategoryPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = findCategory((await params).slug);
  return category
    ? { title: category.name, description: `${category.blurb}, from students near your campus.` }
    : {};
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = findCategory((await params).slug);
  if (!category) notFound();

  return (
    <div className="container-page">
      <PageHeader
        eyebrow="Category"
        title={category.name}
        description={category.blurb}
        crumbs={[
          { href: '/', label: 'Home' },
          { href: '/categories', label: 'Categories' },
        ]}
      />
      <Suspense fallback={<ListingGridSkeleton />}>
        <ListingBrowser fixed={{ category: category.slug }} />
      </Suspense>
    </div>
  );
}
