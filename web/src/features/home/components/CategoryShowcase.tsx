import { CATEGORIES } from '@selit/shared';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORY_ICONS, CATEGORY_TINTS } from '@/lib/category-style';
import Link from 'next/link';

import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/cn';

export function CategoryShowcase() {
  return (
    <section className="container-page py-14 sm:py-20">
      <SectionHeading
        eyebrow="Categories"
        title="What students are swapping"
        description="From your first bucket to your final-year laptop."
        action={
          <Link
            href="/categories"
            className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800"
          >
            All categories <ArrowUpRight className="size-4" />
          </Link>
        }
      />
      <div className="-mx-[max(1rem,5%)] mt-10 no-scrollbar flex snap-x gap-3 overflow-x-auto px-[max(1rem,5%)] pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5">
        {CATEGORIES.slice(0, 10).map((category, index) => {
          const Icon = CATEGORY_ICONS[category.icon];
          return (
            <Reveal
              key={category.slug}
              index={index}
              className="w-40 shrink-0 snap-start sm:w-auto"
            >
              <Link
                href={`/categories/${category.slug}`}
                className="group flex h-full flex-col gap-6 rounded-3xl border border-line bg-surface p-5 transition-[transform,box-shadow,border-color] duration-700 ease-out-soft hover:-translate-y-1 hover:border-transparent hover:shadow-lift"
              >
                <span
                  className={cn(
                    'flex size-12 items-center justify-center rounded-2xl transition-transform duration-700 ease-out-soft group-hover:scale-110 group-hover:-rotate-6',
                    CATEGORY_TINTS[category.tone],
                  )}
                >
                  <Icon className="size-6" strokeWidth={1.8} />
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold text-ink-900">
                    {category.name}
                  </span>
                  <span className="mt-1 block text-sm leading-snug text-ink-500">
                    {category.blurb}
                  </span>
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
