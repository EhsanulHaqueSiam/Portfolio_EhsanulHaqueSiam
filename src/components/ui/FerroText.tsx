import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

interface FerroTextProps {
  text: string;
  className?: string;
  /** Entrance stagger baseline (kinetic-char CSS entrance, paints pre-hydration) */
  delay?: number;
  stagger?: number;
  /** Rendered inside the LAST word's nowrap group (e.g. the vermilion period) */
  suffix?: ReactNode;
}

/**
 * Ferrofluid headline: poster-weight characters that bulge — heavier, wider,
 * lifted — around the cursor, with spring-lerped falloff, like liquid ink
 * pulled by a magnet. Pure DOM writes in a single rAF loop (no re-renders).
 *
 * SSR renders plain spans with the CSS kinetic-char entrance, so the headline
 * paints instantly (LCP) and is fully crawlable; the fluid effect attaches
 * after hydration on hover-capable, motion-tolerant devices only.
 */
export function FerroText({ text, className = '', delay = 0.05, stagger = 0.035, suffix }: FerroTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    const chars = Array.from(container.querySelectorAll<HTMLSpanElement>('[data-ferro]'));
    if (!chars.length) return;

    const BASE_WGHT = 800;
    const MAX_WGHT = 900;
    const BASE_WDTH = 115;
    const MAX_WDTH = 125;
    const LIFT = 0.08; // em
    const RADIUS = 160;
    const LERP = 0.16;

    let centers: Array<{ x: number; y: number }> = [];
    let current = chars.map(() => 0); // influence 0..1 per char
    let target = chars.map(() => 0);
    let raf = 0;
    let running = false;
    let pointerInside = false;
    let entranceCleared = false;

    // The kinetic-char entrance uses animation-fill-mode: both, whose final
    // keyframe transform would override our inline writes — drop it first.
    const clearEntrance = () => {
      if (entranceCleared) return;
      entranceCleared = true;
      for (const el of chars) el.style.animation = 'none';
    };

    const measure = () => {
      centers = chars.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };

    const apply = () => {
      let settled = true;
      for (let i = 0; i < chars.length; i++) {
        current[i] += (target[i] - current[i]) * LERP;
        if (Math.abs(target[i] - current[i]) > 0.001) settled = false;
        const f = current[i];
        const wght = BASE_WGHT + (MAX_WGHT - BASE_WGHT) * f;
        const wdth = BASE_WDTH + (MAX_WDTH - BASE_WDTH) * f;
        chars[i].style.fontVariationSettings = `'wght' ${wght.toFixed(0)}, 'wdth' ${wdth.toFixed(1)}`;
        chars[i].style.transform = f > 0.002 ? `translateY(${(-LIFT * f).toFixed(3)}em)` : '';
      }
      if (!settled || pointerInside) {
        raf = requestAnimationFrame(apply);
      } else {
        running = false;
      }
    };

    const kick = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(apply);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      pointerInside = true;
      clearEntrance();
      if (!centers.length) measure();
      for (let i = 0; i < centers.length; i++) {
        const dx = e.clientX - centers[i].x;
        const dy = e.clientY - centers[i].y;
        const d = Math.hypot(dx, dy);
        // Smooth cosine falloff inside RADIUS
        target[i] = d < RADIUS ? 0.5 * (1 + Math.cos((d / RADIUS) * Math.PI)) : 0;
      }
      kick();
    };

    const onPointerLeave = () => {
      pointerInside = false;
      target = target.map(() => 0);
      kick();
    };

    const onResizeOrScroll = () => {
      centers = [];
    };

    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('resize', onResizeOrScroll, { passive: true });
    window.addEventListener('scroll', onResizeOrScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', onResizeOrScroll);
      window.removeEventListener('scroll', onResizeOrScroll);
    };
  }, [text]);

  // Words are grouped in nowrap spans so the browser can only break at spaces --
  // a poster name must never split mid-word.
  const words = text.split(' ');
  let charIndex = 0;
  return (
    <span ref={containerRef} className={className} aria-hidden="true">
      {words.map((word, w) => {
        const start = charIndex;
        charIndex += word.length + 1;
        return (
          <span key={`${word}-${w}`} className="inline-block whitespace-nowrap">
            {word.split('').map((char, i) => (
              <span
                key={`${char}-${i}`}
                data-ferro=""
                className="kinetic-char"
                style={{ animationDelay: `${delay + (start + i) * stagger}s` }}
              >
                {char}
              </span>
            ))}
            {w < words.length - 1 && <span className="inline-block">{'\u00A0'}</span>}
            {w === words.length - 1 && suffix}
          </span>
        );
      })}
    </span>
  );
}
