import React from 'react';
import { cn } from '../../lib/utils';

const rainbowClasses = cn(
  'relative cursor-pointer group transition-all animate-rainbow',
  'inline-flex items-center justify-center gap-2 shrink-0',
  'rounded-md outline-none text-sm font-medium whitespace-nowrap',
  'h-10 px-5',
  // light: dark pill with rainbow border + underglow; dark: white pill
  'text-primary-foreground',
  'bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))]',
  'dark:bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))]',
  'bg-[length:200%] [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.09rem)_solid_transparent]',
  'before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow',
  'before:bg-[linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] before:[filter:blur(0.75rem)]'
);

/**
 * Rainbow-ring CTA button (magicui port, simplified: no cva/slot).
 * The animated band lives on the border + a blurred underglow.
 */
export const RainbowButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button ref={ref} className={cn(rainbowClasses, className)} {...props}>
    {children}
  </button>
));

RainbowButton.displayName = 'RainbowButton';
