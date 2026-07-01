/**
 * Splits text into per-character spans that reveal with a staggered CSS
 * animation (see `.kinetic-char` in index.css). Because the motion is pure CSS,
 * the text is present in the static HTML and paints on load with NO JavaScript
 * dependency — so it can't delay LCP or cause a hydration mismatch.
 *
 * Purely decorative: mark the parent aria-hidden and provide the real, spaced
 * name via an adjacent sr-only node.
 */
export function KineticText({
  text,
  className = '',
  charClassName = '',
  delay = 0.05,
  stagger = 0.03,
}: {
  text: string;
  className?: string;
  charClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  return (
    <span className={`inline-block ${className}`} aria-hidden="true">
      {[...text].map((ch, i) => (
        <span
          key={i}
          className={`kinetic-char ${charClassName}`}
          style={{ animationDelay: `${delay + i * stagger}s` }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  );
}
