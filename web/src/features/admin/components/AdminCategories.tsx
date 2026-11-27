'use client';

import { findCategory, messageOf } from '@selit/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pause, Play, Shapes } from 'lucide-react';

import { AreaHeader } from '@/components/layout/AreaHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

import { CATEGORY_ICONS, CATEGORY_TINTS } from '@/lib/category-style';

import { getCategoryStats, setCategoryStatus } from '../admin.api';
import { AdminTable, Td, Th } from './AdminTable';

export function AdminCategories() {
  const queryClient = useQueryClient();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: getCategoryStats,
  });
  const toggle = useMutation({
    mutationFn: ({ slug, paused }: { slug: string; paused: boolean }) =>
      setCategoryStatus(slug, paused ? 'active' : 'paused'),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] }),
  });
  const max = Math.max(1, ...(data ?? []).map((category) => category.total));

  return (
    <>
      <AreaHeader
        title="Categories"
        description="See where listings are, and pause a category if it is being abused."
      />
      {isPending ? (
        <Skeleton className="h-96 rounded-3xl" />
      ) : isError ? (
        <EmptyState
          icon={<Shapes />}
          title="Couldn't load categories"
          description={messageOf(error)}
        />
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <Th>Category</Th>
              <Th>Listings</Th>
              <Th>Live</Th>
              <Th>In review</Th>
              <Th className="text-right">Status</Th>
            </tr>
          </thead>
          <tbody>
            {data.map((category) => {
              const match = findCategory(category.slug);
              const Icon = match ? CATEGORY_ICONS[match.icon] : null;
              const isPaused = category.status === 'paused';
              return (
                <tr key={category.slug}>
                  <Td>
                    <span className="flex items-center gap-3 font-semibold text-ink-900">
                      {match && Icon ? (
                        <span
                          className={`flex size-9 items-center justify-center rounded-xl ${CATEGORY_TINTS[match.tone]}`}
                        >
                          <Icon className="size-4" />
                        </span>
                      ) : null}
                      {match?.name ?? category.name}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <span className="w-8 font-semibold tabular-nums">{category.total}</span>
                      <span className="h-1.5 w-28 overflow-hidden rounded-full bg-ink-100">
                        <span
                          className="block h-full rounded-full bg-brand-500"
                          style={{ width: `${(category.total / max) * 100}%` }}
                        />
                      </span>
                    </div>
                  </Td>
                  <Td className="tabular-nums">{category.active}</Td>
                  <Td className="tabular-nums">{category.pending}</Td>
                  <Td>
                    <div className="flex items-center justify-end gap-2">
                      <Badge tone={isPaused ? 'amber' : 'brand'}>
                        {isPaused ? 'Paused' : 'Open'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label={isPaused ? `Reopen ${category.name}` : `Pause ${category.name}`}
                        onClick={() => toggle.mutate({ slug: category.slug, paused: isPaused })}
                      >
                        {isPaused ? <Play /> : <Pause />}
                      </Button>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </AdminTable>
      )}
    </>
  );
}
