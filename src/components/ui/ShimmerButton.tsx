import React from 'react';
import type { CSSProperties, ComponentPropsWithoutRef } from 'react';
import { cn } from '../../lib/utils';

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** Color of the shine that sweeps across the button. */
  shimmerColor?: string;
  borderRadius?: string;
  /** One full glint cycle (sweep + pause). */
  shimmerDuration?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Pill button with a periodic light glint sweeping across it (magicui port).
 * Used for the hero availability status.
 */
export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    { shimmerColor = '#ffffff', shimmerDuration = '4.5s', borderRadius = '200px', className, children, ...props },
    ref
  ) => {
    return (
      <button
        style={
          {
            '--speed': shimmerDuration,
            '--radius': borderRadius,
            '--shine-color': shimmerColor,
          } as CSSProperties
        }
        className={cn(
          'group relative z-10 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap',
          'border border-black/10 bg-secondary/60 px-4 py-1.5 text-secondary-foreground',
          'dark:border-white/10 dark:bg-background',
          '[border-radius:var(--radius)]',
          'transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}

        {/* Shine band that glints across then waits off-screen */}
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-y-0 left-0 -z-10 w-1/3',
            'animate-button-shine opacity-50 dark:opacity-40',
            '[background:linear-gradient(to_right,transparent,var(--shine-color),transparent)]'
          )}
        />

        {/* Inset gloss that intensifies on hover/press */}
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 [border-radius:var(--radius)]',
            'shadow-[inset_0_-8px_10px_#ffffff1f] transition-shadow duration-300 ease-in-out',
            'group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]',
            'group-active:shadow-[inset_0_-10px_10px_#ffffff3f]'
          )}
        />
      </button>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';
