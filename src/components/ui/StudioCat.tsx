import { useEffect, useRef, useState } from 'react';

/**
 * The studio cat — a small ink-drawn cat that sits on a hairline rule.
 * Tail sways (CSS), it blinks on an interval, its head follows the cursor
 * a few degrees, and clicking it earns you a "mrrp." Purely decorative.
 */
export function StudioCat({ className = '' }: { className?: string }) {
  const headRef = useRef<SVGGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [mrrp, setMrrp] = useState(false);
  const [hopping, setHopping] = useState(false);

  useEffect(() => {
    const head = headRef.current;
    const root = rootRef.current;
    if (!head || !root) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    let raf = 0;
    let currentRot = 0;
    let targetRot = 0;
    let running = false;

    const tick = () => {
      currentRot += (targetRot - currentRot) * 0.08;
      head.style.transform = `rotate(${currentRot.toFixed(2)}deg)`;
      if (Math.abs(targetRot - currentRot) > 0.05) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.35;
      const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
      // Look toward the cursor, clamped to a plausible neck range
      targetRot = Math.max(-12, Math.min(12, angle / 8));
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  const onPoke = () => {
    setMrrp(true);
    setHopping(true);
    window.setTimeout(() => setHopping(false), 450);
    window.setTimeout(() => setMrrp(false), 1400);
  };

  return (
    <div
      ref={rootRef}
      className={`relative inline-block select-none ${className}`}
      aria-hidden="true"
      data-cursor-emoji="🐾"
    >
      {/* speech bubble */}
      <span
        className={`absolute -top-7 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-all duration-300 ${
          mrrp ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-1'
        }`}
      >
        mrrp.
      </span>

      <button
        type="button"
        tabIndex={-1}
        onClick={onPoke}
        className={`block cat-hop-host ${hopping ? 'cat-hop' : ''}`}
        style={{ background: 'transparent', border: 'none', padding: 0, minHeight: 0, minWidth: 0 }}
      >
        <svg width="72" height="64" viewBox="0 0 72 64" fill="none">
          {/* tail */}
          <path
            className="cat-tail"
            d="M52 56 C64 56 68 48 66 42"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {/* body */}
          <path
            d="M20 60 C14 44 18 32 30 28 L42 28 C54 32 58 44 52 60 Z"
            fill="hsl(var(--muted-foreground))"
          />
          {/* chest patch */}
          <path d="M32 60 C30 48 32 40 36 36 C40 40 42 48 40 60 Z" fill="hsl(var(--background))" opacity="0.85" />
          {/* head group (rotates toward cursor) */}
          <g ref={headRef} style={{ transformOrigin: '36px 24px', willChange: 'transform' }}>
            {/* ears */}
            <path d="M24 16 L26 4 L34 12 Z" fill="hsl(var(--muted-foreground))" />
            <path d="M48 16 L46 4 L38 12 Z" fill="hsl(var(--muted-foreground))" />
            {/* head */}
            <ellipse cx="36" cy="18" rx="14" ry="12" fill="hsl(var(--muted-foreground))" />
            {/* eyes (blink via CSS scaleY) */}
            <g className="cat-eyes">
              <circle cx="30.5" cy="17" r="1.8" fill="hsl(var(--background))" />
              <circle cx="41.5" cy="17" r="1.8" fill="hsl(var(--background))" />
            </g>
            {/* nose */}
            <path d="M35 22 L37 22 L36 23.5 Z" fill="#8B7CFF" />
          </g>
          {/* ground glow */}
          <ellipse cx="36" cy="61.5" rx="20" ry="2" fill="#8B7CFF" opacity="0.14" />
        </svg>
      </button>
    </div>
  );
}
