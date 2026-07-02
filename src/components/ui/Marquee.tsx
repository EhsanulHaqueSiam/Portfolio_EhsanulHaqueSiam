import { cn } from '../../lib/utils';
import type { ComponentPropsWithoutRef } from 'react';

interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  className?: string;
  /** Reverse the animation direction */
  reverse?: boolean;
  /** Pause the animation on hover */
  pauseOnHover?: boolean;
  children: React.ReactNode;
  /** Animate vertically instead of horizontally */
  vertical?: boolean;
  /** Times the content repeats to fill the track */
  repeat?: number;
}

/**
 * Infinite marquee (magicui port). Configure speed/gap via CSS vars:
 * className="[--duration:20s] [--gap:1rem]".
 */
export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]',
        vertical ? 'flex-col' : 'flex-row',
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex shrink-0 justify-around [gap:var(--gap)]',
              vertical ? 'animate-marquee-vertical flex-col' : 'animate-marquee flex-row',
              pauseOnHover && 'group-hover:[animation-play-state:paused]',
              reverse && '[animation-direction:reverse]'
            )}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
