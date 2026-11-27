'use client';

import { formatDate, messageOf } from '@selit/shared';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Ban, Eye, RotateCcw, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { AreaHeader } from '@/components/layout/AreaHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Dialog } from '@/components/ui/Dialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import type { AccountStatus, UserRole } from '@/features/auth/auth.types';

import { listAdminUsers, setUserStatus } from '../admin.api';
import type { AdminUser } from '../admin.types';
import { AdminTable, Td, Th } from './AdminTable';

const STATUS_TONES = { active: 'brand', watchlist: 'amber', banned: 'danger' } as const;

export function AdminUsers() {
  const queryClient = useQueryClient();
  const [role, setRole] = useState<UserRole | undefined>();
  const [status, setStatus] = useState<AccountStatus | undefined>();
  const [page, setPage] = useState(1);
  const [toBan, setToBan] = useState<AdminUser | null>(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['admin', 'users', role, status, page],
    queryFn: () => listAdminUsers({ role, status, page }),
    placeholderData: keepPreviousData,
  });
  const change = useMutation({
    mutationFn: ({ id, next }: { id: string; next: AccountStatus }) => setUserStatus(id, next),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      setToBan(null);
    },
  });

  const filterRow = <T extends string>(
    options: { value: T | undefined; label: string }[],
    value: T | undefined,
    set: (value: T | undefined) => void,
  ) =>
    options.map((option) => (
      <Chip
        key={option.label}
        className="h-9"
        isActive={value === option.value}
        onClick={() => {
          set(option.value);
          setPage(1);
        }}
      >
        {option.label}
      </Chip>
    ));

  return (
    <>
      <AreaHeader
        title="Users"
        description="Watch suspicious accounts and ban people who put others at risk."
      />
      <div className="flex flex-wrap gap-2">
        {filterRow<UserRole>(
          [
            { value: undefined, label: 'Everyone' },
            { value: 'seller', label: 'Sellers' },
            { value: 'buyer', label: 'Buyers' },
            { value: 'admin', label: 'Admins' },
          ],
          role,
          setRole,
        )}
        <span className="mx-1 w-px bg-line" />
        {filterRow<AccountStatus>(
          [
            { value: undefined, label: 'Any status' },
            { value: 'watchlist', label: 'Watchlist' },
            { value: 'banned', label: 'Banned' },
          ],
          status,
          setStatus,
        )}
      </div>
      {change.isError ? (
        <p className="mt-4 text-sm text-danger-600">{messageOf(change.error)}</p>
      ) : null}

      <div className="mt-6">
        {isPending ? (
          <Skeleton className="h-96 rounded-3xl" />
        ) : isError ? (
          <EmptyState icon={<Users />} title="Couldn't load users" description={messageOf(error)} />
        ) : data.items.length === 0 ? (
          <EmptyState icon={<Users />} title="No users match" />
        ) : (
          <>
            <AdminTable>
              <thead>
                <tr>
                  <Th>User</Th>
                  <Th>Role</Th>
                  <Th>Status</Th>
                  <Th>Joined</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((user) => (
                  <tr key={user.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <Avatar name={user.fullName} src={user.profileImageUrl} size={36} />
                        <div className="min-w-0">
                          <Link
                            href={`/sellers/${user.id}`}
                            className="block font-semibold text-ink-900 hover:text-brand-700"
                          >
                            {user.fullName}
                          </Link>
                          <p className="truncate text-xs text-ink-500">{user.email}</p>
                        </div>
                      </div>
                    </Td>
                    <Td className="capitalize">{user.role}</Td>
                    <Td>
                      <Badge tone={STATUS_TONES[user.status]}>{user.status}</Badge>
                    </Td>
                    <Td className="text-ink-500">
                      {user.createdAt ? formatDate(user.createdAt) : '—'}
                    </Td>
                    <Td>
                      {user.role === 'admin' ? null : (
                        <div className="flex justify-end gap-1.5">
                          {user.status !== 'active' ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => change.mutate({ id: user.id, next: 'active' })}
                            >
                              <RotateCcw /> Restore
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => change.mutate({ id: user.id, next: 'watchlist' })}
                            >
                              <Eye /> Watch
                            </Button>
                          )}
                          {user.status !== 'banned' ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-danger-600 hover:bg-danger-50"
                              onClick={() => setToBan(user)}
                            >
                              <Ban /> Ban
                            </Button>
                          ) : null}
                        </div>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
            <Pagination className="mt-6" pagination={data.pagination} onPageChange={setPage} />
          </>
        )}
      </div>

      <Dialog
        open={Boolean(toBan)}
        onClose={() => setToBan(null)}
        title={`Ban ${toBan?.fullName ?? 'this user'}?`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setToBan(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={change.isPending}
              onClick={() => toBan && change.mutate({ id: toBan.id, next: 'banned' })}
            >
              Ban user
            </Button>
          </>
        }
      >
        <p className="text-ink-600">
          They will no longer be able to post or contact anyone. You can restore them later.
        </p>
      </Dialog>
    </>
  );
}
