'use client';

import {
  apartmentTypeLabel,
  findSchoolByName,
  formatNaira,
  formatRelativeTime,
  messageOf,
  type Apartment,
  type ApartmentStatus,
} from '@selit/shared';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BadgeCheck, Building2, Check, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { AreaHeader } from '@/components/layout/AreaHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { Skeleton } from '@/components/ui/Skeleton';

import { listAdminApartments, setApartmentStatus } from '../admin.api';
import { AdminTable, Td, Th } from './AdminTable';

type Filter = ApartmentStatus | 'all';
const FILTERS: { value: Filter; label: string }[] = [
  { value: 'pending', label: 'Awaiting review' },
  { value: 'available', label: 'Available' },
  { value: 'taken', label: 'Taken' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'all', label: 'All' },
];

const TONES = {
  available: 'brand',
  pending: 'amber',
  taken: 'neutral',
  rejected: 'danger',
  removed: 'danger',
} as const;

type Decision = { apartment: Apartment; next: ApartmentStatus; confirmed?: boolean };

export function AdminApartments() {
  const router = useRouter();
  const params = useSearchParams();
  const queryClient = useQueryClient();
  const status = (FILTERS.find((filter) => filter.value === params.get('status'))?.value ??
    'pending') as Filter;
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['admin', 'apartments', status, page],
    queryFn: () => listAdminApartments(status, page),
    placeholderData: keepPreviousData,
  });
  const moderate = useMutation({
    mutationFn: ({ apartment, next, confirmed }: Decision) =>
      setApartmentStatus(apartment.id, next, confirmed),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin'] });
      void queryClient.invalidateQueries({ queryKey: ['apartments'] });
    },
  });

  return (
    <>
      <AreaHeader
        title="Apartments"
        description="Approve only when the photos look real and the agent is verified. Confirm after a visit or a call."
      />
      <SegmentedTabs
        label="Apartment status"
        value={status}
        onChange={(next) => {
          setPage(1);
          router.replace(`/admin/apartments?status=${next}`);
        }}
        options={FILTERS}
      />
      {moderate.isError ? (
        <p className="mt-4 text-sm text-danger-600">{messageOf(moderate.error)}</p>
      ) : null}

      <div className="mt-6">
        {isPending ? (
          <Skeleton className="h-96 rounded-3xl" />
        ) : isError ? (
          <EmptyState
            icon={<Building2 />}
            title="Couldn't load apartments"
            description={messageOf(error)}
          />
        ) : data.items.length === 0 ? (
          <EmptyState
            icon={<Check />}
            title="All clear"
            description="Nothing in this queue right now."
          />
        ) : (
          <>
            <AdminTable>
              <thead>
                <tr>
                  <Th>Apartment</Th>
                  <Th>Agent</Th>
                  <Th>Rent</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((apartment) => (
                  <tr key={apartment.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-canvas">
                          {apartment.images[0] ? (
                            <Image
                              src={apartment.images[0]}
                              alt=""
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : null}
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={`/apartments/${apartment.id}`}
                            className="block max-w-[16rem] truncate font-semibold text-ink-900 hover:text-brand-700"
                          >
                            {apartment.title}
                          </Link>
                          <p className="text-xs text-ink-500">
                            {apartmentTypeLabel(apartment.type)} ·{' '}
                            {findSchoolByName(apartment.school)?.shortName || apartment.area} ·{' '}
                            {formatRelativeTime(apartment.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <span className="flex items-center gap-1.5 font-medium text-ink-800">
                        {apartment.agent.fullName}
                        {apartment.agent.isVerified ? (
                          <BadgeCheck className="size-4 text-brand-600" aria-label="Verified" />
                        ) : null}
                      </span>
                    </Td>
                    <Td className="font-semibold tabular-nums">
                      {formatNaira(apartment.rentPerYear)}
                    </Td>
                    <Td>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge tone={TONES[apartment.status]}>{apartment.status}</Badge>
                        {apartment.isConfirmed ? <Badge tone="brand">Confirmed</Badge> : null}
                      </div>
                    </Td>
                    <Td>
                      <div className="flex justify-end gap-1.5">
                        {apartment.status === 'pending' || apartment.status === 'rejected' ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => moderate.mutate({ apartment, next: 'available' })}
                          >
                            <Check /> Approve
                          </Button>
                        ) : null}
                        {apartment.status === 'available' && !apartment.isConfirmed ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              moderate.mutate({ apartment, next: 'available', confirmed: true })
                            }
                          >
                            <BadgeCheck /> Confirm
                          </Button>
                        ) : null}
                        {apartment.status === 'pending' ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moderate.mutate({ apartment, next: 'rejected' })}
                          >
                            <X /> Reject
                          </Button>
                        ) : null}
                        {apartment.status !== 'removed' ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            aria-label="Remove apartment"
                            className="text-danger-600 hover:bg-danger-50"
                            onClick={() => moderate.mutate({ apartment, next: 'removed' })}
                          >
                            <Trash2 />
                          </Button>
                        ) : null}
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
            <Pagination className="mt-6" pagination={data.pagination} onPageChange={setPage} />
          </>
        )}
      </div>
    </>
  );
}
