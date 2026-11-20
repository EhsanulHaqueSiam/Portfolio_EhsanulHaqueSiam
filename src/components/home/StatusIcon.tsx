import { useEffect, useRef } from 'react';

/**
 * Animated status mark for a project row. `live`: a beating dot with rings.
 * `shipped`: a box drops in, a check badge pops and the check draws (on first
 * view and on every hover of the parent row). The word slides out on row hover.
 * CSS lives in index.css under "Status icons".
 */
export function StatusIcon({ status }: { status: 'live' | 'shipped' }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.setAttribute('data-seen', '');
      el.toggleAttribute('data-off', !e.isIntersecting);
    });
    io.observe(el);
    // Replay the shipped sequence when the row is hovered again.
    const row = el.closest('a');
    const replay = () => {
      if (status !== 'shipped') return;
      el.removeAttribute('data-seen');
      void el.offsetWidth; // restart CSS animations
      el.setAttribute('data-seen', '');
    };
    row?.addEventListener('mouseenter', replay);
    return () => {
      io.disconnect();
      row?.removeEventListener('mouseenter', replay);
    };
  }, [status]);

  return (
    <span ref={ref} className={`st st-${status}`}>
      <span className="st-word" aria-hidden="true">
        {status}
      </span>
      <svg viewBox="0 0 24 24" role="img" aria-label={status === 'live' ? 'Live' : 'Shipped'}>
        {status === 'live' ? (
          <>
            <circle className="st-halo" cx="12" cy="12" r="7" />
            <circle className="st-ring" cx="12" cy="12" r="3.6" />
            <circle className="st-ring st-ring2" cx="12" cy="12" r="3.6" />
            <circle className="st-core" cx="12" cy="12" r="3.6" />
          </>
        ) : (
          <>
            <g className="st-box">
              <path className="st-face st-left" d="M3 7.5 11 12v9l-8-4.5z" />
              <path className="st-face st-right" d="M11 12l8-4.5v9L11 21z" />
              <path className="st-face st-top" d="M11 3l8 4.5-8 4.5-8-4.5z" />
              <path className="st-tape" d="M7 5.25l8 4.5" />
            </g>
            <g className="st-sparks">
              <path d="M20.6 10.6l.9-1.5M23 14.2l1.6-.3M22.6 12l1.4-1" />
            </g>
            <g className="st-badge">
              <circle cx="18.5" cy="17.5" r="4.6" />
              <path className="st-check" pathLength={1} d="M16.4 17.6l1.4 1.4 2.8-3" />
            </g>
          </>
        )}
      </svg>
    </span>
  );
}
