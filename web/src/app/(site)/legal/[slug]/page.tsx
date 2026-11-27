import { findLegalDocument, formatDate, LEGAL_DOCUMENTS } from '@selit/shared';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageHeader } from '@/components/layout/PageHeader';
import { cn } from '@/lib/cn';

type LegalPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LEGAL_DOCUMENTS.map((document) => ({ slug: document.slug }));
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const document = findLegalDocument((await params).slug);
  return document ? { title: document.title, description: document.summary } : {};
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params;
  const document = findLegalDocument(slug);
  if (!document) notFound();

  return (
    <div className="container-page">
      <PageHeader
        eyebrow={`Updated ${formatDate(document.updatedAt)}`}
        title={document.title}
        description={document.summary}
        crumbs={[{ href: '/', label: 'Home' }]}
      />
      <div className="grid gap-10 lg:grid-cols-[14rem_1fr]">
        <nav aria-label="Legal documents" className="lg:sticky lg:top-28 lg:self-start">
          <ul className="flex gap-2 overflow-x-auto lg:flex-col">
            {LEGAL_DOCUMENTS.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/legal/${item.slug}`}
                  aria-current={item.slug === slug ? 'page' : undefined}
                  className={cn(
                    'block rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors',
                    item.slug === slug ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-100',
                  )}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <article className="max-w-3xl space-y-10">
          {document.sections.map((section, index) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-semibold text-ink-900">
                <span className="mr-2 text-ink-300 tabular-nums">{index + 1}.</span>
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-3 text-[1.02rem] leading-relaxed text-ink-700"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
