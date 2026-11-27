import { Reveal } from '@/components/motion/Reveal';

type AreaHeaderProps = {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
};

/** Compact page title used inside the account and admin areas. */
export function AreaHeader({ title, description, action }: AreaHeaderProps) {
  return (
    <Reveal className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl" suppressHydrationWarning>
          {title}
        </h1>
        {description ? <div className="mt-2 text-ink-500">{description}</div> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </Reveal>
  );
}
