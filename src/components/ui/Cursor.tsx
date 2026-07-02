import { useEffect, useRef, useState } from 'react';

/**
 * Crosshair cursor for the "Proof of Work" print aesthetic: a small square dot
 * with a trailing square frame that rotates 45° over interactive elements.
 * White + mix-blend-difference so it self-inverts on paper and ink spreads.
 * All state lives outside React; positions are lerped in a single rAF loop.
 */
export function CustomCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const dotRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const supportsDesktopHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setIsTouchDevice(!supportsDesktopHover);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    if (!dotRef.current || !frameRef.current || !textRef.current) return;

    const dot = dotRef.current!;
    const frame = frameRef.current!;
    const text = textRef.current!;

    // ---- All cursor state lives outside React ----
    let targetX = -100;
    let targetY = -100;
    let dotX = -100;
    let dotY = -100;
    let frameX = -100;
    let frameY = -100;
    let visible = false;
    let hovering = false;

    let dotScale = 1;
    let dotTargetScale = 1;
    let frameScale = 1;
    let frameTargetScale = 1;
    let frameRot = 0;
    let frameTargetRot = 0;

    const DOT_LERP = 1;      // Dot position: instant
    const FRAME_LERP = 0.16; // Frame trails behind
    const SCALE_LERP = 0.2;
    let running = false;

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function tick() {
      dotX = lerp(dotX, targetX, DOT_LERP);
      dotY = lerp(dotY, targetY, DOT_LERP);
      frameX = lerp(frameX, targetX, FRAME_LERP);
      frameY = lerp(frameY, targetY, FRAME_LERP);
      dotScale = lerp(dotScale, dotTargetScale, SCALE_LERP);
      frameScale = lerp(frameScale, frameTargetScale, SCALE_LERP);
      frameRot = lerp(frameRot, frameTargetRot, SCALE_LERP);

      // Scale/rotate AFTER translate — only affects visual size, not position
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%) scale(${dotScale})`;
      frame.style.transform = `translate3d(${frameX}px, ${frameY}px, 0) translate(-50%, -50%) rotate(${frameRot}deg) scale(${frameScale})`;

      // Settle: stop scheduling once everything has converged (battery-friendly)
      const settled =
        Math.abs(frameX - targetX) < 0.1 &&
        Math.abs(frameY - targetY) < 0.1 &&
        Math.abs(dotScale - dotTargetScale) < 0.005 &&
        Math.abs(frameScale - frameTargetScale) < 0.005 &&
        Math.abs(frameRot - frameTargetRot) < 0.05;
      if (settled) {
        running = false;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    function kickLoop() {
      if (!running) {
        running = true;
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    kickLoop();

    function setHoverStyle(isHover: boolean, cursorText: string) {
      hovering = isHover;
      dotTargetScale = isHover ? 0.5 : 1;
      frameTargetScale = isHover ? 2.4 : 1;
      frameTargetRot = isHover ? 45 : 0;
      frame.style.borderColor = isHover ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)';

      text.textContent = cursorText;
      text.style.opacity = cursorText ? '1' : '0';
    }

    function setClickStyle(isClick: boolean) {
      dotTargetScale = isClick ? 0.4 : hovering ? 0.5 : 1;
      frameTargetScale = isClick ? (hovering ? 2.1 : 0.85) : hovering ? 2.4 : 1;
    }

    function setVisibility(show: boolean) {
      if (visible === show) return;
      visible = show;
      const opacity = show ? '1' : '0';
      dot.style.opacity = opacity;
      frame.style.opacity = opacity;
    }

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setVisibility(true);
      kickLoop();
    };

    const onMouseDown = () => {
      setClickStyle(true);
      kickLoop();
    };
    const onMouseUp = () => {
      setClickStyle(false);
      kickLoop();
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive =
        ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'SUMMARY'].includes(target.tagName) ||
        target.closest('a, button, summary, [data-cursor], [role="button"]') ||
        target.classList.contains('cursor-pointer');

      if (interactive) {
        const cursorData = target.getAttribute('data-cursor') ||
                          target.closest('[data-cursor]')?.getAttribute('data-cursor') || '';
        setHoverStyle(true, cursorData);
        kickLoop();
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      if (relatedTarget?.closest('a, button, summary, [data-cursor], [role="button"]')) return;
      if (hovering) {
        setHoverStyle(false, '');
        kickLoop();
      }
    };

    const onDocumentLeave = () => setVisibility(false);
    const onDocumentEnter = () => setVisibility(true);

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
      <div
        ref={dotRef}
        className="fixed top-0 left-0 bg-white pointer-events-none z-[9999] mix-blend-difference"
        style={{
          width: 5,
          height: 5,
          opacity: 0,
          transition: 'opacity 0.15s ease',
          willChange: 'transform',
        }}
      />

      <div
        ref={frameRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference flex items-center justify-center"
        style={{
          width: 26,
          height: 26,
          border: '1px solid rgba(255,255,255,0.55)',
          opacity: 0,
          transition: 'border-color 0.25s ease, opacity 0.15s ease',
          willChange: 'transform',
        }}
      >
        <span
          ref={textRef}
          className="text-[8px] font-mono font-medium text-white uppercase tracking-[0.2em] whitespace-nowrap"
          style={{
            opacity: 0,
            transform: 'rotate(-45deg)',
            transition: 'opacity 0.15s ease',
          }}
        />
      </div>
    </>
  );
}
