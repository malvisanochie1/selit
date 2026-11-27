'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/cn';

export function HeaderSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = query.trim();
        router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
      }}
      className={cn('relative', className)}
    >
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-400" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search beds, phones, pots…"
        aria-label="Search Selit"
        className="h-11 w-full rounded-2xl border border-transparent bg-ink-100/70 pr-4 pl-10 text-sm text-ink-900 transition-[background-color,border-color,box-shadow] duration-300 ease-out-soft placeholder:text-ink-400 hover:bg-ink-100 focus:border-brand-500 focus:bg-surface focus:ring-4 focus:ring-brand-100 focus:outline-none"
      />
    </form>
  );
}
