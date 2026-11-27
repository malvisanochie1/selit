import { cn } from '@/lib/cn';

export function AdminTable({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('overflow-x-auto rounded-3xl border border-line bg-surface', className)}>
      <table className="w-full min-w-[44rem] text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={cn(
        'border-b border-line bg-canvas/60 px-4 py-3 text-xs font-semibold tracking-wide text-ink-500 uppercase first:pl-5 last:pr-5',
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <td
      className={cn(
        'border-b border-line px-4 py-3.5 align-middle first:pl-5 last:pr-5 [tr:last-child_&]:border-b-0',
        className,
      )}
    >
      {children}
    </td>
  );
}
