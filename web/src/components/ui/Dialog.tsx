'use client';

import { X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';

import { cn } from '@/lib/cn';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

/**
 * Built on the native <dialog> element, which gives focus trapping, Escape to
 * close and an inert background for free. On phones it rises as a bottom sheet.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-labelledby={titleId}
      className={cn(
        'fixed m-0 mt-auto w-full max-w-none bg-transparent p-0 backdrop:bg-ink-950/45 backdrop:backdrop-blur-sm',
        'sm:m-auto sm:max-w-lg',
        'open:animate-[dialog-in_520ms_var(--ease-out-soft)] backdrop:open:animate-[fade-in_400ms_var(--ease-out-soft)]',
        className,
      )}
    >
      <div className="max-h-[88dvh] overflow-y-auto rounded-t-[1.75rem] bg-surface p-6 shadow-float sm:rounded-[1.75rem] sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-xl font-semibold text-ink-900">
              {title}
            </h2>
            {description ? <p className="mt-1 text-sm text-ink-500">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mt-1 -mr-1 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
          >
            <X className="size-5" />
          </button>
        </div>
        {children}
        {footer ? (
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {footer}
          </div>
        ) : null}
      </div>
    </dialog>
  );
}
