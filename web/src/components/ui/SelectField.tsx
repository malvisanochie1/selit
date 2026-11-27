import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/cn';

import { controlStyles, Field } from './Field';

export type SelectOption = { value: string; label: string };

type SelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  options: readonly SelectOption[];
  placeholder?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
};

export function SelectField({
  id,
  label,
  options,
  placeholder,
  hint,
  error,
  optional,
  className,
  ...props
}: SelectFieldProps) {
  return (
    <Field id={id} label={label} hint={hint} error={error} optional={optional}>
      <div className="relative">
        <select
          id={id}
          name={id}
          aria-invalid={error ? true : undefined}
          className={cn(controlStyles, 'h-12 cursor-pointer appearance-none pr-11', className)}
          {...props}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-400" />
      </div>
    </Field>
  );
}
