import { CATEGORIES } from '@selit/shared';
import { ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/motion/Reveal';
import { CATEGORY_ICONS, CATEGORY_TINTS } from '@/lib/category-style';
import { cn } from '@/lib/cn';

export const metadata: Metadata = {
  title: 'Categories',
  description:
    'Browse every category on Selit, from hostel items and furniture to phones and textbooks.',
};

export default function CategoriesPage() {
  return (
    <div className="container-page">
      <PageHeader
        eyebrow="Categories"
        title="Shop by category"
        description="Everything students buy, sell and pass on between sessions."
        crumbs={[{ href: '/', label: 'Home' }]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category, index) => {
          const Icon = CATEGORY_ICONS[category.icon];
          return (
            <Reveal key={category.slug} index={index}>
              <Link
                href={`/categories/${category.slug}`}
                className="group flex items-center gap-5 rounded-3xl border border-line bg-surface p-6 transition-[transform,box-shadow,border-color] duration-700 ease-out-soft hover:-translate-y-1 hover:border-transparent hover:shadow-lift"
              >
                <span
                  className={cn(
                    'flex size-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-700 ease-out-soft group-hover:-rotate-6',
                    CATEGORY_TINTS[category.tone],
                  )}
                >
                  <Icon className="size-7" strokeWidth={1.8} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-xl font-semibold text-ink-900">
                    {category.name}
                  </span>
                  <span className="mt-0.5 block text-sm text-ink-500">{category.blurb}</span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-ink-300 transition-[color,transform] duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600" />
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
