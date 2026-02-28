import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    setIsTouchDevice(hasTouch && hasCoarsePointer);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    if (!dotRef.current || !ringRef.current || !textRef.current) return;

    // Capture non-null refs once — guaranteed by the guard above.
    // These elements are always mounted when isTouchDevice is false.
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const text = textRef.current!;

    // ---- All cursor state lives outside React ----
    let targetX = -100;
    let targetY = -100;
    let dotX = -100;
    let dotY = -100;
    let ringX = -100;
    let ringY = -100;
    let visible = false;
    let hovering = false;

    // Lerp factor: 1 = instant, 0 = frozen
    const DOT_LERP = 1;     // Dot locked to cursor — zero lag
    const RING_LERP = 0.15; // Ring trails behind smoothly

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    // ---- rAF loop: runs every frame, independent of event timing ----
    function tick() {
      dotX = lerp(dotX, targetX, DOT_LERP);
      dotY = lerp(dotY, targetY, DOT_LERP);
      ringX = lerp(ringX, targetX, RING_LERP);
      ringY = lerp(ringY, targetY, RING_LERP);

      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    // ---- Hover styling via direct DOM — no React re-renders ----
    function setHoverStyle(isHover: boolean, cursorText: string) {
      hovering = isHover;
      // Dot
      dot.style.width = isHover ? '8px' : '12px';
      dot.style.height = isHover ? '8px' : '12px';
      dot.style.scale = isHover ? '0.5' : '1';

      // Ring
      ring.style.width = isHover ? '80px' : '40px';
      ring.style.height = isHover ? '80px' : '40px';
      ring.style.border = isHover
        ? '2px solid rgba(139, 92, 246, 0.6)'
        : '1px solid rgba(139, 92, 246, 0.25)';
      ring.style.boxShadow = isHover
        ? '0 0 20px rgba(139, 92, 246, 0.3), inset 0 0 20px rgba(139, 92, 246, 0.1)'
        : 'none';
      ring.style.backgroundColor = isHover ? 'rgba(139, 92, 246, 0.08)' : 'transparent';

      // Text
      text.textContent = cursorText;
      text.style.opacity = cursorText ? '1' : '0';
      text.style.transform = cursorText ? 'scale(1)' : 'scale(0.5)';
    }

    function setClickStyle(isClick: boolean) {
      dot.style.scale = isClick ? '0.5' : hovering ? '0.5' : '1';
      ring.style.scale = isClick ? '0.85' : '1';
    }

    function setVisibility(show: boolean) {
      if (visible === show) return;
      visible = show;
      const opacity = show ? '1' : '0';
      dot.style.opacity = opacity;
      ring.style.opacity = opacity;
    }

    // ---- Event handlers ----
    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setVisibility(true);
    };

    const onMouseDown = () => setClickStyle(true);
    const onMouseUp = () => setClickStyle(false);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive =
        ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
        target.closest('a, button, [data-cursor], [role="button"]') ||
        target.classList.contains('cursor-pointer');

      if (interactive) {
        const cursorData = target.getAttribute('data-cursor') ||
                          target.closest('[data-cursor]')?.getAttribute('data-cursor') || '';
        setHoverStyle(true, cursorData);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      if (relatedTarget?.closest('a, button, [data-cursor], [role="button"]')) return;
      if (hovering) setHoverStyle(false, '');
    };

    const onDocumentLeave = () => setVisibility(false);
    const onDocumentEnter = () => setVisibility(true);

    // ---- Attach listeners ----
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver, true);
    document.addEventListener('mouseout', onMouseOut, true);
    document.documentElement.addEventListener('mouseleave', onDocumentLeave);
    document.documentElement.addEventListener('mouseenter', onDocumentEnter);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver, true);
      document.removeEventListener('mouseout', onMouseOut, true);
      document.documentElement.removeEventListener('mouseleave', onDocumentLeave);
      document.documentElement.removeEventListener('mouseenter', onDocumentEnter);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Dot — white circle, mix-blend-difference */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference"
        style={{
          width: 12,
          height: 12,
          opacity: 0,
          // Smooth size/scale changes, but NO transition on transform — that stays instant
          transition: 'width 0.15s ease, height 0.15s ease, scale 0.12s ease, opacity 0.15s ease',
          willChange: 'transform',
        }}
      />

      {/* Ring — violet border, trails behind dot */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] flex items-center justify-center"
        style={{
          width: 40,
          height: 40,
          border: '1px solid rgba(139, 92, 246, 0.25)',
          opacity: 0,
          // Smooth visual property changes. NO transition on transform — rAF lerp handles trailing.
          transition: 'width 0.25s cubic-bezier(0.22, 1, 0.36, 1), height 0.25s cubic-bezier(0.22, 1, 0.36, 1), border 0.25s ease, box-shadow 0.3s ease, background-color 0.25s ease, scale 0.15s ease, opacity 0.15s ease',
          willChange: 'transform',
        }}
      >
        {/* Cursor text label */}
        <span
          ref={textRef}
          className="relative z-10 text-[11px] font-semibold text-violet-300 uppercase tracking-wider whitespace-nowrap"
          style={{
            opacity: 0,
            transform: 'scale(0.5)',
            transition: 'opacity 0.15s ease, transform 0.15s ease',
          }}
        />
      </div>
    </>
  );
}
