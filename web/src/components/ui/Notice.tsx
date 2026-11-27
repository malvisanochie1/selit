import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from 'lucide-react';

import { cn } from '@/lib/cn';

type NoticeTone = 'info' | 'success' | 'warning' | 'danger';

const TONES: Record<NoticeTone, { box: string; icon: React.ReactNode }> = {
  info: { box: 'border-info-500/15 bg-info-50 text-info-700', icon: <Info /> },
  success: { box: 'border-brand-200 bg-brand-50 text-brand-800', icon: <CheckCircle2 /> },
  warning: { box: 'border-amber-300/60 bg-amber-50 text-amber-700', icon: <AlertTriangle /> },
  danger: { box: 'border-danger-100 bg-danger-50 text-danger-700', icon: <ShieldAlert /> },
};

type NoticeProps = {
  tone?: NoticeTone;
  title?: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function Notice({ tone = 'info', title, children, action, className }: NoticeProps) {
  const { box, icon } = TONES[tone];
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-2xl border p-4 text-sm leading-relaxed', box, className)}
    >
      <span className="mt-0.5 shrink-0 [&_svg]:size-5">{icon}</span>
      <div className="min-w-0 flex-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className={cn(title && 'mt-0.5', 'opacity-90')}>{children}</div> : null}
        {action ? <div className="mt-3">{action}</div> : null}
      </div>
    </div>
  );
}
