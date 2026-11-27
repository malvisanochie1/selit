'use client';

import {
  orderedStates,
  SCHOOL_KIND_LABELS,
  SCHOOLS,
  searchSchools,
  SITE,
  stateLabel,
} from '@selit/shared';
import { ChevronDown, Search } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { EASE_OUT } from '@/components/motion/motion.constants';
import { Badge } from '@/components/ui/Badge';
import { controlStyles } from '@/components/ui/Field';
import { cn } from '@/lib/cn';

export function SchoolDirectory() {
  const [query, setQuery] = useState('');
  const [openState, setOpenState] = useState<string>(SITE.launchState);
  const results = useMemo(() => (query.trim() ? searchSchools(query, 30) : []), [query]);

  return (
    <div>
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find your school, e.g. DSPG, UNIBEN, Yabatech"
          aria-label="Find your school"
          className={cn(controlStyles, 'h-13 pl-12 text-base')}
        />
      </div>

      {query.trim() ? (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.length ? (
            results.map((school) => (
              <li key={school.slug}>
                <Link
                  href={`/schools/${school.slug}`}
                  className="block rounded-2xl border border-line bg-surface p-4 transition-[border-color,box-shadow] duration-500 hover:border-brand-200 hover:shadow-card"
                >
                  <span className="block font-semibold text-ink-900">{school.name}</span>
                  <span className="mt-1 block text-sm text-ink-500">
                    {SCHOOL_KIND_LABELS[school.kind]} · {stateLabel(school.state)}
                  </span>
                </Link>
              </li>
            ))
          ) : (
            <li className="text-ink-500">
              No school matches “{query}”. You can still type it in when you list an item.
            </li>
          )}
        </ul>
      ) : (
        <div className="mt-8 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-surface">
          {orderedStates().map((state) => {
            const schools = SCHOOLS.filter((school) => school.state === state);
            const isOpen = openState === state;
            return (
              <section key={state}>
                <h2 className="font-sans text-base">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenState(isOpen ? '' : state)}
                    className="flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-canvas"
                  >
                    <span className="flex-1 font-semibold text-ink-900">{stateLabel(state)}</span>
                    {state === SITE.launchState ? <Badge tone="brand">Live now</Badge> : null}
                    <span className="text-sm text-ink-500 tabular-nums">{schools.length}</span>
                    <ChevronDown
                      className={cn(
                        'size-5 text-ink-400 transition-transform duration-500 ease-out-soft',
                        isOpen && 'rotate-180',
                      )}
                    />
                  </button>
                </h2>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <m.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: EASE_OUT }}
                      className="grid overflow-hidden px-5 sm:grid-cols-2 lg:grid-cols-3"
                    >
                      {schools.map((school) => (
                        <li key={school.slug} className="pb-1">
                          <Link
                            href={`/schools/${school.slug}`}
                            className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-brand-50"
                          >
                            <span className="block text-sm font-semibold text-ink-800">
                              {school.name}
                            </span>
                            <span className="block text-xs text-ink-500">
                              {SCHOOL_KIND_LABELS[school.kind]}
                            </span>
                          </Link>
                        </li>
                      ))}
                      <li className="h-3 sm:col-span-2 lg:col-span-3" aria-hidden="true" />
                    </m.ul>
                  ) : null}
                </AnimatePresence>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
