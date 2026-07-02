import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Emoji cursor companion (port of the reference's custom cursor). While the
 * pointer is over any element carrying data-cursor-emoji="<emoji>", the emoji
 * rides the cursor with a little motion physics (tilt by velocity, pop-in).
 * Desktop fine-pointer only; never hides the native cursor.
 */
export function EmojiCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<string | null>(null);
  const [emoji, setEmoji] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    setMounted(true);

    let mouseX = 0;
    let mouseY = 0;
    let lastX = 0;
    let lastY = 0;
    let vx = 0;
    let vy = 0;
    let scale = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = (e.target as Element | null)?.closest?.('[data-cursor-emoji]') as HTMLElement | null;
      const next = target?.dataset.cursorEmoji ?? null;
      if (next !== emojiRef.current) {
        emojiRef.current = next;
        setEmoji(next);
      }
    };

    const onLeave = () => {
      if (emojiRef.current !== null) {
        emojiRef.current = null;
        setEmoji(null);
      }
    };

    let running = false;

    const tick = () => {
      const dx = mouseX - lastX;
      const dy = mouseY - lastY;
      lastX = mouseX;
      lastY = mouseY;
      vx = vx * 0.75 + dx * 0.25;
      vy = vy * 0.75 + dy * 0.25;

      const targetScale = emojiRef.current ? 1 : 0;
      scale += (targetScale - scale) * 0.2;

      const el = cursorRef.current;
      if (el) {
        const tilt = Math.max(-24, Math.min(24, vx * 1.6));
        el.style.transform = `translate(${mouseX + 14}px, ${mouseY + 14}px) rotate(${tilt}deg) scale(${scale.toFixed(3)})`;
      }

      // Sleep once fully shrunk with no active emoji; wake on next hover.
      if (!emojiRef.current && scale < 0.01) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const onMoveWithWake = (e: MouseEvent) => {
      onMove(e);
      if (emojiRef.current) wake();
    };

    window.addEventListener('mousemove', onMoveWithWake, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMoveWithWake);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] text-xl will-change-transform"
      style={{ transform: 'translate(-100px, -100px) scale(0)' }}
    >
      {emoji}
    </div>,
    document.body
  );
}
