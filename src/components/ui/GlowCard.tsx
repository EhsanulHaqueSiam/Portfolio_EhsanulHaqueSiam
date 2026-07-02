import type React from 'react';
import { cn } from '../../lib/utils';
import { GlowingEffect } from './GlowingEffect';
import { SpotlightGlow } from './SpotlightGlow';

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Classes for the inner content surface (padding lives here). */
  contentClassName?: string;
  cursorEmoji?: string;
}

/**
 * The About-bento card recipe as a reusable shell: pointer-chasing conic
 * border (GlowingEffect) outside, cursor spotlight inside. The outer div must
 * NOT clip (the glow border draws just past the edge); the inner surface does.
 */
export function GlowCard({
  className,
  contentClassName,
  cursorEmoji,
  children,
  ...rest
}: GlowCardProps) {
  return (
    <div
      className={cn('relative h-full rounded-xl border', className)}
      data-cursor-emoji={cursorEmoji}
      {...rest}
    >
      <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} />
      <div
        className={cn(
          'group/glow relative flex h-full flex-col overflow-hidden rounded-[inherit] bg-card/60',
          contentClassName
        )}
      >
        <SpotlightGlow />
        {children}
      </div>
    </div>
  );
}
