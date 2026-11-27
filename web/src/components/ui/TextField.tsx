import { cn } from '@/lib/cn';

import { controlStyles, Field } from './Field';

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  leadingIcon?: React.ReactNode;
  trailing?: React.ReactNode;
  fieldClassName?: string;
};

export function TextField({
  id,
  label,
  hint,
  error,
  optional,
  leadingIcon,
  trailing,
  className,
  fieldClassName,
  ...props
}: TextFieldProps) {
  return (
    <Field
      id={id}
      label={label}
      hint={hint}
      error={error}
      optional={optional}
      className={fieldClassName}
    >
      <div className="relative flex items-center">
        {leadingIcon ? (
          <span className="pointer-events-none absolute left-4 flex shrink-0 text-ink-400 [&_svg]:size-[1.1rem]">
            {leadingIcon}
          </span>
        ) : null}
        <input
          id={id}
          name={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(
            controlStyles,
            'h-12',
            leadingIcon && 'pl-11',
            trailing && 'pr-12',
            className,
          )}
          {...props}
        />
        {trailing ? <span className="absolute right-1.5 flex shrink-0">{trailing}</span> : null}
      </div>
    </Field>
  );
}
