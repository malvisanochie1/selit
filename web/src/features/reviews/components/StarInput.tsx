'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/cn';

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

export function StarInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const shown = hovered || value;
  return (
    <div className="flex items-center gap-3">
      <div
        role="radiogroup"
        aria-label="Rating"
        className="flex"
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((step) => (
          <button
            key={step}
            type="button"
            role="radio"
            aria-checked={value === step}
            aria-label={`${step} star${step > 1 ? 's' : ''}`}
            onClick={() => onChange(step)}
            onMouseEnter={() => setHovered(step)}
            className="cursor-pointer p-1 transition-transform duration-300 ease-out-soft active:scale-90"
          >
            <Star
              className={cn(
                'size-8 transition-colors duration-200',
                step <= shown ? 'fill-amber-500 text-amber-500' : 'fill-ink-100 text-ink-200',
              )}
            />
          </button>
        ))}
      </div>
      <span className="text-sm font-semibold text-ink-600">{LABELS[shown]}</span>
    </div>
  );
}
