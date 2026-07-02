/**
 * A tiny cat that peeks up from behind a card edge while the card is hovered.
 * Drop inside any `group/glow` card (GlowCard content, or add the class
 * yourself). Decorative only — pointer-events-none, aria-hidden.
 */
export function PeekCat({ className = 'right-8' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-0 z-10 translate-y-full transition-transform duration-500 ease-out group-hover/glow:translate-y-[30%] ${className}`}
    >
      <svg width="44" height="34" viewBox="0 0 44 34" fill="none" aria-hidden="true">
        {/* ears */}
        <path d="M8 12 L10 1 L18 8 Z" fill="hsl(var(--muted-foreground))" />
        <path d="M36 12 L34 1 L26 8 Z" fill="hsl(var(--muted-foreground))" />
        {/* head */}
        <ellipse cx="22" cy="16" rx="15" ry="12" fill="hsl(var(--muted-foreground))" />
        {/* eyes */}
        <g className="cat-eyes">
          <circle cx="16" cy="14" r="2" fill="hsl(var(--background))" />
          <circle cx="28" cy="14" r="2" fill="hsl(var(--background))" />
        </g>
        {/* nose */}
        <path d="M21 19 L23 19 L22 20.5 Z" fill="#8B7CFF" />
        {/* paws gripping the edge */}
        <ellipse cx="10" cy="31" rx="4" ry="3" fill="hsl(var(--muted-foreground))" />
        <ellipse cx="34" cy="31" rx="4" ry="3" fill="hsl(var(--muted-foreground))" />
      </svg>
    </span>
  );
}
