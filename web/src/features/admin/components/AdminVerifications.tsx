'use client';

import { formatRelativeTime, messageOf } from '@selit/shared';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, BadgeCheck, Check, IdCard, ScanFace, ShieldCheck, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { AreaHeader } from '@/components/layout/AreaHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { ID_TYPES } from '@/features/verification/verification.api';

import { decideVerification, listVerifications } from '../admin.api';
import type { VerificationRequest } from '../admin.types';

function Evidence({ src, label, icon }: { src: string; label: string; icon: React.ReactNode }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-canvas">
      <div className="relative flex aspect-[4/3] items-center justify-center text-ink-300 [&_svg]:size-8">
        {src ? (
          <Image src={src} alt={label} fill unoptimized sizes="240px" className="object-cover" />
        ) : (
          icon
        )}
      </div>
      <figcaption className="px-3 py-2 text-xs font-semibold text-ink-600">{label}</figcaption>
    </figure>
  );
}

function RequestCard({ request }: { request: VerificationRequest }) {
  const queryClient = useQueryClient();
  const [note, setNote] = useState('');
  const decide = useMutation({
    mutationFn: (decision: 'verified' | 'rejected') =>
      decideVerification(request.id, decision, note),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['admin', 'verifications'] }),
  });
  const idLabel = ID_TYPES.find((type) => type.value === request.idType)?.label ?? request.idType;

  return (
    <article className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-ink-900">{request.fullName}</p>
          <p className="text-sm text-ink-500">
            {request.email} · {idLabel} ending {request.idNumberLast4} ·{' '}
            {formatRelativeTime(request.submittedAt)}
          </p>
        </div>
        {request.warning ? (
          <Badge tone="danger">
            <AlertTriangle className="size-3.5" /> {request.warning}
          </Badge>
        ) : (
          <Badge tone="neutral">Compare the face and the name</Badge>
        )}
      </header>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:max-w-2xl sm:grid-cols-4">
        <Evidence src={request.idPhotoUrl} label="ID photo" icon={<IdCard />} />
        {(request.selfieUrls.length ? request.selfieUrls : ['']).map((url, index) => (
          <Evidence
            key={url || index}
            src={url}
            label={`Live selfie ${index + 1}`}
            icon={<ScanFace />}
          />
        ))}
      </div>
      <p className="mt-3 text-xs text-ink-500">
        Photos are deleted as soon as you approve or reject.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Note to the user if you reject (optional)"
          aria-label="Review note"
          maxLength={200}
          className="h-10 flex-1 rounded-xl border border-line-strong px-3 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-100 focus:outline-none"
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-danger-600 hover:bg-danger-50"
            onClick={() => decide.mutate('rejected')}
            disabled={decide.isPending}
          >
            <X /> Reject
          </Button>
          <Button size="sm" onClick={() => decide.mutate('verified')} isLoading={decide.isPending}>
            <Check /> Approve
          </Button>
        </div>
      </div>
      {decide.isError ? (
        <p className="mt-3 text-sm text-danger-600">{messageOf(decide.error)}</p>
      ) : null}
    </article>
  );
}

export function AdminVerifications() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['admin', 'verifications', page],
    queryFn: () => listVerifications(page),
    placeholderData: keepPreviousData,
  });

  return (
    <>
      <AreaHeader
        title="Verifications"
        description="Approve only when the selfie clearly matches the ID and the names agree. When unsure, reject with a note."
      />
      {isPending ? (
        <Skeleton className="h-80 rounded-3xl" />
      ) : isError ? (
        <EmptyState
          icon={<ShieldCheck />}
          title="Couldn't load the queue"
          description={messageOf(error)}
        />
      ) : data.items.length === 0 ? (
        <EmptyState
          icon={<BadgeCheck />}
          title="Queue is empty"
          description="Every identity check has been reviewed."
        />
      ) : (
        <div className="space-y-4">
          {data.items.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
          <Pagination className="mt-6" pagination={data.pagination} onPageChange={setPage} />
        </div>
      )}
    </>
  );
}
