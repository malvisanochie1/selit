'use client';

import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { useState } from 'react';

import { TextField } from '@/components/ui/TextField';

type PasswordFieldProps = Omit<
  React.ComponentProps<typeof TextField>,
  'type' | 'trailing' | 'leadingIcon'
>;

export function PasswordField(props: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <TextField
      {...props}
      type={isVisible ? 'text' : 'password'}
      leadingIcon={<LockKeyhole />}
      trailing={
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          className="flex size-9 cursor-pointer items-center justify-center rounded-xl text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
        >
          {isVisible ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
        </button>
      }
    />
  );
}
