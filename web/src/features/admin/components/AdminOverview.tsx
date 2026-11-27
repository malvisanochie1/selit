'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BadgeCheck, Building2, Clock, Flag, Package, Users } from 'lucide-react';
import Link from 'next/link';

import { AreaHeader } from '@/components/layout/AreaHeader';
import { Reveal } from '@/components/motion/Reveal';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatCard } from '@/components/ui/StatCard';

import { getAdminStats } from '../admin.api';

const QUEUES = [
  {
    href: '/admin/listings?status=pending',
    icon: Clock,
    title: 'Listings waiting for review',
    count: 'pendingListings',
  },
  {
    href: '/admin/apartments?status=pending',
    icon: Building2,
    title: 'Apartments waiting for review',
    count: 'pendingApartments',
  },
  { href: '/admin/reports', icon: Flag, title: 'Open reports', count: 'openReports' },
  {
    href: '/admin/verifications',
    icon: BadgeCheck,
    title: 'Identity checks to review',
    count: 'pendingVerifications',
  },
] as const;

export function AdminOverview() {
  const { data: stats, isPending } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: getAdminStats,
  });

  return (
    <>
      <AreaHeader
        title="Admin overview"
        description="Keep Selit safe and tidy. Review queues first."
      />
      {isPending || !stats ? (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-36 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <StatCard label="Members" value={stats.members} icon={<Users />} tone="info" />
          <StatCard label="Live listings" value={stats.activeListings} icon={<Package />} />
          <StatCard label="Apartments" value={stats.availableApartments} icon={<Building2 />} />
          <StatCard
            label="Awaiting review"
            value={stats.pendingListings}
            icon={<Clock />}
            tone="amber"
          />
        </div>
      )}

      <h2 className="mt-12 text-2xl font-semibold text-ink-900">Review queues</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {QUEUES.map((queue, index) => (
          <Reveal key={queue.href} index={index}>
            <Link
              href={queue.href}
              className="group flex h-full flex-col rounded-3xl border border-line bg-surface p-6 transition-[transform,box-shadow] duration-700 ease-out-soft hover:-translate-y-1 hover:shadow-lift"
            >
              <queue.icon className="size-6 text-brand-600" />
              <p className="mt-5 font-display text-3xl font-semibold text-ink-900 tabular-nums">
                {stats ? stats[queue.count] : '–'}
              </p>
              <p className="mt-1 flex-1 font-semibold text-ink-700">{queue.title}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                Open queue
                <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </>
  );
}
