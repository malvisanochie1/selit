'use client';

import { SCHOOL_KIND_LABELS, searchSchools } from '@selit/shared';
import { Check, GraduationCap, Plus } from 'lucide-react';
import { useId, useMemo, useState } from 'react';

import { controlStyles, Field } from '@/components/ui/Field';
import { cn } from '@/lib/cn';

type SchoolPickerProps = {
  id: string;
  label: string;
  value: string;
  onChange: (schoolName: string) => void;
  hint?: string;
  error?: string;
  placeholder?: string;
  allowCustom?: boolean;
};

/** Searchable school field. People can also type a school that isn't listed yet. */
export function SchoolPicker({
  id,
  label,
  value,
  onChange,
  hint,
  error,
  placeholder = 'Search by name, short name or town',
  allowCustom = true,
}: SchoolPickerProps) {
  const listId = useId();
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => searchSchools(query, 7), [query]);
  const trimmed = query.trim();
  const showCustom =
    allowCustom &&
    trimmed.length > 3 &&
    !results.some((school) => school.name.toLowerCase() === trimmed.toLowerCase());
  const optionCount = results.length + (showCustom ? 1 : 0);

  function choose(name: string) {
    onChange(name);
    setQuery(name);
    setIsOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen && (event.key === 'ArrowDown' || event.key === 'Enter')) {
      setIsOpen(true);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % Math.max(optionCount, 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + optionCount) % Math.max(optionCount, 1));
    } else if (event.key === 'Enter' && isOpen) {
      event.preventDefault();
      if (activeIndex < results.length) choose(results[activeIndex].name);
      else if (showCustom) choose(trimmed);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  }

  return (
    <Field id={id} label={label} hint={hint} error={error}>
      <div className="relative">
        <GraduationCap className="pointer-events-none absolute top-1/2 left-4 size-[1.1rem] -translate-y-1/2 text-ink-400" />
        <input
          id={id}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
          aria-invalid={error ? true : undefined}
          autoComplete="off"
          value={query}
          placeholder={placeholder}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            setIsOpen(false);
            if (allowCustom && trimmed && trimmed !== value) onChange(trimmed);
          }}
          onKeyDown={handleKeyDown}
          className={cn(controlStyles, 'h-12 pl-11')}
        />
        {isOpen && optionCount > 0 ? (
          <ul
            id={listId}
            role="listbox"
            className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 max-h-80 overflow-y-auto rounded-2xl border border-line bg-surface p-1.5 shadow-float"
          >
            {results.map((school, index) => (
              <li
                key={school.slug}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={(event) => {
                  event.preventDefault();
                  choose(school.name);
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5',
                  index === activeIndex && 'bg-brand-50',
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink-900">
                    {school.name}
                  </span>
                  <span className="block truncate text-xs text-ink-500">
                    {SCHOOL_KIND_LABELS[school.kind]} · {school.city ? `${school.city}, ` : ''}
                    {school.state}
                  </span>
                </span>
                {school.name === value ? (
                  <Check className="size-4 shrink-0 text-brand-600" />
                ) : null}
              </li>
            ))}
            {showCustom ? (
              <li
                id={`${listId}-${results.length}`}
                role="option"
                aria-selected={activeIndex === results.length}
                onMouseDown={(event) => {
                  event.preventDefault();
                  choose(trimmed);
                }}
                onMouseEnter={() => setActiveIndex(results.length)}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-700',
                  activeIndex === results.length && 'bg-brand-50',
                )}
              >
                <Plus className="size-4 shrink-0 text-brand-600" />
                Use “{trimmed}”
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>
    </Field>
  );
}
