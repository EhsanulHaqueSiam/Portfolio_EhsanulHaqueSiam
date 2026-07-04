import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';

/**
 * The hero name that alternates between two forms ("Siam." / "Ehsanul.")
 * with a soft blur crossfade. The slot is sized to the widest name so the
 * headline never reflows. SSR renders the first form as plain text so
 * crawlers always see the name.
 */
export function AnimatedName({
  names = ['Siam', 'Ehsanul'],
  suffix = '.',
  holdMs = 3400,
  className = '',
}: {
  names?: string[];
  suffix?: string;
  holdMs?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const longest = useMemo(
    () => names.reduce((a, b) => (b.length > a.length ? b : a), ''),
    [names]
  );

  useEffect(() => {
    setHydrated(true);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % names.length), holdMs);
    return () => clearInterval(timer);
  }, [holdMs, names.length]);

  if (!hydrated) {
    return (
      <span className={className}>
        {names[0]}
        {suffix}
      </span>
    );
  }

  return (
    <span className={`relative inline-grid overflow-visible align-baseline ${className}`}>
      {/* invisible widest form reserves the slot width */}
      <span className="invisible whitespace-nowrap [grid-area:1/1]" aria-hidden="true">
        {longest}
        {suffix}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={names[index]}
          className="whitespace-nowrap text-left [grid-area:1/1]"
          initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {names[index]}
          {suffix}
        </m.span>
      </AnimatePresence>
    </span>
  );
}
