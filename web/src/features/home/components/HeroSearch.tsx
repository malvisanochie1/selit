'use client';

import { schoolsInState, SITE } from '@selit/shared';
import { ArrowRight, GraduationCap, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';

const QUICK_SEARCHES = ['Mattress', 'Gas cylinder', 'Reading table', 'Laptop', 'Water drum'];
const LAUNCH_SCHOOLS = schoolsInState(SITE.launchState);

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [school, setSchool] = useState('');

  function search(term: string) {
    const params = new URLSearchParams();
    if (term.trim()) params.set('q', term.trim());
    if (school) params.set('school', school);
    router.push(`/search${params.size ? `?${params}` : ''}`);
  }

  return (
    <div>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          search(query);
        }}
        className="flex flex-col gap-2 rounded-[1.75rem] border border-line bg-surface p-2 shadow-float sm:flex-row sm:items-center"
      >
        <label className="flex min-w-0 flex-1 items-center gap-3 px-3 sm:px-4">
          <Search className="size-5 shrink-0 text-brand-600" />
          <span className="sr-only">What are you looking for?</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Mattress, laptop, gas…"
            className="h-12 w-full min-w-0 bg-transparent text-base text-ink-900 placeholder:text-ink-400 focus:outline-none"
          />
        </label>
        <label className="flex items-center gap-2 border-t border-line px-3 pt-2 sm:w-44 sm:border-t-0 sm:border-l sm:pt-0">
          <GraduationCap className="size-5 shrink-0 text-ink-400" />
          <span className="sr-only">School</span>
          <select
            value={school}
            onChange={(event) => setSchool(event.target.value)}
            className="h-11 w-full min-w-0 cursor-pointer truncate bg-transparent text-sm font-medium text-ink-700 focus:outline-none"
          >
            <option value="">All schools</option>
            {LAUNCH_SCHOOLS.map((option) => (
              <option key={option.slug} value={option.name}>
                {option.shortName || option.name}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" size="lg" className="sm:h-12">
          Search
          <ArrowRight />
        </Button>
      </form>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-ink-500">Popular:</span>
        {QUICK_SEARCHES.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => search(term)}
            className="cursor-pointer rounded-full border border-line bg-surface/70 px-3 py-1.5 font-medium text-ink-700 transition-[border-color,color,transform] duration-[440ms] ease-out-soft hover:border-brand-300 hover:text-brand-700 active:scale-[0.96]"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
