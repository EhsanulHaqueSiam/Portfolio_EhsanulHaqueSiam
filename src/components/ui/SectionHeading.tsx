import React from 'react';
import { ScrambleText } from './ScrambleText';

export const headingIconClass = 'h-5 w-5 sm:h-6 sm:w-6 text-secondary-foreground';

/**
 * Centered icon + title section heading (reference style). String titles
 * decode in with a scramble effect on first scroll into view.
 */
export function SectionHeading({
  icon,
  children,
  className = '',
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-8 flex items-center justify-center ${className}`}>
      <span className="mr-2 text-secondary-foreground">{icon}</span>
      <h2 className="text-xl font-bold text-secondary-foreground sm:text-2xl">
        {typeof children === 'string' ? <ScrambleText text={children} /> : children}
      </h2>
    </div>
  );
}
