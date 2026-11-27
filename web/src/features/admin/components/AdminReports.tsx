'use client';

import { formatRelativeTime, messageOf } from '@selit/shared';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Flag, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { AreaHeader } from '@/components/layout/AreaHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  REPORT_REASONS,
  type Report,
  type ReportStatus,
  type ReportTarget,
} from '@/features/reports/report.types';

import { listReports, setReportStatus } from '../admin.api';

const TARGET_LINKS: Record<ReportTarget, (id: string) => string> = {
  listing: (id) => `/products/${id}`,
  user: (id) => `/sellers/${id}`,
  apartment: (id) => `/apartments/${id}`,
};

const STATUS_TONES = {
  open: 'danger',
  reviewing: 'amber',
  actioned: 'brand',
  dismissed: 'neutral',
} as const;

export function AdminReports() {
  const queryClient = useQueryClient();
  const [target, setTarget] = useState<ReportTarget>('listing');
  const [status, setStatus] = useState<ReportStatus | 'all'>('open');
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['admin', 'reports', target, status, page],
    queryFn: () => listReports({ target, status: status === 'all' ? undefined : status, page }),
    placeholderData: keepPreviousData,
  });
  const update = useMutation({
    mutationFn: ({ report, next }: { report: Report; next: ReportStatus }) =>
      setReportStatus(report, next),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] }),
  });

  return (
    <>
      <AreaHeader title="Reports" description="Act on scams quickly. Open reports first." />
      <div className="flex flex-wrap gap-3">
        <SegmentedTabs
          label="Report type"
          value={target}
          onChange={(next) => {
            setTarget(next);
            setPage(1);
          }}
          options={[
            { value: 'listing', label: 'Listings' },
            { value: 'user', label: 'Users' },
            { value: 'apartment', label: 'Apartments' },
          ]}
        />
        <SegmentedTabs
          label="Report status"
          value={status}
          onChange={(next) => {
            setStatus(next);
            setPage(1);
          }}
          options={[
            { value: 'open', label: 'Open' },
            { value: 'reviewing', label: 'Reviewing' },
            { value: 'actioned', label: 'Actioned' },
            { value: 'all', label: 'All' },
          ]}
        />
      </div>

      <div className="mt-6 space-y-3">
        {isPending ? (
          <Skeleton className="h-64 rounded-3xl" />
        ) : isError ? (
          <EmptyState
            icon={<Flag />}
            title="Couldn't load reports"
            description={messageOf(error)}
          />
        ) : data.items.length === 0 ? (
          <EmptyState icon={<Check />} title="No reports here" description="Nice and quiet." />
        ) : (
          <>
            {data.items.map((report) => (
              <article
                key={report.id}
                className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-5 sm:flex-row sm:items-start"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={STATUS_TONES[report.status]}>{report.status}</Badge>
                    <span className="text-sm font-semibold text-ink-900">
                      {REPORT_REASONS.find((reason) => reason.value === report.reason)?.label ??
                        report.reason}
                    </span>
                  </div>
                  <Link
                    href={TARGET_LINKS[report.targetType](report.targetId)}
                    className="mt-2 block font-semibold text-brand-700 hover:underline"
                  >
                    {report.targetTitle}
                  </Link>
                  {report.details ? (
                    <p className="mt-1.5 text-sm text-ink-600">“{report.details}”</p>
                  ) : null}
                  <p className="mt-2 text-xs text-ink-400">
                    Reported by {report.reporterName} · {formatRelativeTime(report.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  {report.status === 'open' ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => update.mutate({ report, next: 'reviewing' })}
                    >
                      <Search /> Review
                    </Button>
                  ) : null}
                  {report.status !== 'actioned' ? (
                    <Button
                      size="sm"
                      variant="dark"
                      onClick={() => update.mutate({ report, next: 'actioned' })}
                    >
                      <Check /> Actioned
                    </Button>
                  ) : null}
                  {report.status !== 'dismissed' ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label="Dismiss report"
                      onClick={() => update.mutate({ report, next: 'dismissed' })}
                    >
                      <X />
                    </Button>
                  ) : null}
                </div>
              </article>
            ))}
            <Pagination className="mt-6" pagination={data.pagination} onPageChange={setPage} />
          </>
        )}
      </div>
    </>
  );
}
