'use client';

import { messageOf } from '@selit/shared';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Notice } from '@/components/ui/Notice';
import { TextArea } from '@/components/ui/TextArea';
import { useSession } from '@/features/auth/hooks/use-session';
import { cn } from '@/lib/cn';

import { REPORT_REASONS, type ReportReason, type ReportTarget } from '../report.types';
import { submitReport } from '../reports.api';

type ReportDialogProps = {
  open: boolean;
  onClose: () => void;
  targetType: ReportTarget;
  targetId: string;
  targetLabel: string;
};

export function ReportDialog({
  open,
  onClose,
  targetType,
  targetId,
  targetLabel,
}: ReportDialogProps) {
  const [reason, setReason] = useState<ReportReason | ''>('');
  const [details, setDetails] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');
  const { isSignedIn } = useSession();
  const pathname = usePathname();

  function close() {
    onClose();
    setTimeout(() => {
      setState('idle');
      setReason('');
      setDetails('');
      setError('');
    }, 400);
  }

  async function send() {
    if (!reason) {
      setError('Choose what is wrong so we can act quickly.');
      return;
    }
    const input = { targetType, targetId, reason, details: details.trim() };
    setState('sending');
    setError('');
    try {
      await submitReport(input);
      setState('sent');
    } catch (submitError) {
      setError(messageOf(submitError));
      setState('idle');
    }
  }

  if (state === 'sent') {
    return (
      <Dialog open={open} onClose={close} title="Thanks for telling us">
        <div className="flex flex-col items-center py-4 text-center">
          <CheckCircle2 className="size-12 text-brand-500" />
          <p className="mt-4 text-ink-600">
            Our team reviews every report. If someone has asked you to pay before meeting, stop all
            contact and do not send money.
          </p>
        </div>
        <Button fullWidth className="mt-4" onClick={close}>
          Done
        </Button>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      title={`Report ${targetType === 'user' ? 'this user' : 'this listing'}`}
      description={targetLabel}
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button variant="danger" onClick={send} isLoading={state === 'sending'}>
            Send report
          </Button>
        </>
      }
    >
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink-800">What&apos;s wrong?</legend>
        <div className="space-y-2">
          {REPORT_REASONS.map((option) => (
            <label
              key={option.value}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors',
                reason === option.value
                  ? 'border-danger-500 bg-danger-50 text-danger-700'
                  : 'border-line hover:border-ink-300',
              )}
            >
              <input
                type="radio"
                name="report-reason"
                value={option.value}
                checked={reason === option.value}
                onChange={() => setReason(option.value)}
                className="size-4 accent-danger-500"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-5">
        <TextArea
          id="report-details"
          label="Anything else we should know?"
          optional
          rows={3}
          maxLength={1000}
          value={details}
          onChange={(event) => setDetails(event.target.value)}
        />
      </div>
      <div className="mt-4 space-y-3">
        {error ? <Notice tone="danger">{error}</Notice> : null}
        {!isSignedIn ? (
          <p className="text-xs text-ink-500">
            Reports come from members so they can&apos;t be abused.{' '}
            <Link
              href={`/sign-in?next=${encodeURIComponent(pathname)}`}
              className="font-semibold text-brand-700"
            >
              Sign in to report
            </Link>
          </p>
        ) : null}
      </div>
    </Dialog>
  );
}
