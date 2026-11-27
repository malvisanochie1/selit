import { cn } from '@/lib/cn';

import { controlStyles, Field } from './Field';

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
};

export function TextArea({ id, label, hint, error, optional, className, ...props }: TextAreaProps) {
  return (
    <Field id={id} label={label} hint={hint} error={error} optional={optional}>
      <textarea
        id={id}
        name={id}
        rows={5}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(controlStyles, 'resize-y py-3 leading-relaxed', className)}
        {...props}
      />
    </Field>
  );
}
