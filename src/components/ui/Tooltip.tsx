import { cn } from '../../lib/utils';

/**
 * Dependency-free hover/focus tooltip. Wrap the trigger; the bubble fades in
 * above (or below) on hover and keyboard focus. Touch devices fall back to
 * the trigger's own semantics (no tooltip).
 */
export function Tooltip({
  label,
  side = 'top',
  className,
  children,
}: {
  label: string;
  side?: 'top' | 'bottom';
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn('group/tip relative inline-flex', className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md',
          'border border-border bg-card px-2.5 py-1 text-xs font-medium text-card-foreground shadow-md',
          'opacity-0 transition-all duration-200',
          side === 'top'
            ? 'bottom-full mb-2 translate-y-1 group-hover/tip:translate-y-0 group-focus-within/tip:translate-y-0'
            : 'top-full mt-2 -translate-y-1 group-hover/tip:translate-y-0 group-focus-within/tip:translate-y-0',
          'group-hover/tip:opacity-100 group-focus-within/tip:opacity-100'
        )}
      >
        {label}
      </span>
    </span>
  );
}
