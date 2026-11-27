import { cn } from '@/lib/cn';

type MarqueeProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Slides content forward forever. The track is rendered twice and moved by
 * half its width, so the loop restarts invisibly and never jumps back.
 */
export function Marquee({ children, className }: MarqueeProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]',
        className,
      )}
    >
      <div className="flex w-max animate-marquee gap-3 group-hover:[animation-play-state:paused]">
        <div className="flex shrink-0 gap-3">{children}</div>
        <div className="flex shrink-0 gap-3" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
