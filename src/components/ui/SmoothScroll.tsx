import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { frame, cancelFrame } from 'framer-motion';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const isVisibleRef = useRef(true);

  // While the page is actively scrolling, tag <html> with .is-scrolling.
  // Canvas loops (constellation, globe, ASCII) hold a frozen frame for the
  // duration — measured as the #1 scroll-FPS cost — and CSS disables pointer
  // events inside <main>, so hover recomputation + transition storms stop as
  // content moves under a stationary cursor. Runs on touch too (the canvas
  // pause is the win there).
  useEffect(() => {
    let idleTimer = 0;
    const onScroll = () => {
      if (!idleTimer) document.documentElement.classList.add('is-scrolling');
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        idleTimer = 0;
        document.documentElement.classList.remove('is-scrolling');
      }, 140);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(idleTimer);
      document.documentElement.classList.remove('is-scrolling');
    };
  }, []);

  useEffect(() => {
    // Check if we're on a touch device - use native scroll for better performance
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouchDevice || shouldReduceMotion) {
      // Don't initialize Lenis on mobile - native scroll is smoother and saves battery
      return;
    }

    try {
      lenisRef.current = new Lenis({
        duration: 0.8,
        easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      });
    } catch (e) {
      console.error('Failed to initialize smooth scroll:', e);
      return;
    }

    // Use Framer Motion's frame scheduler instead of a separate RAF loop
    const update = ({ timestamp }: { timestamp: number; delta: number }) => {
      if (isVisibleRef.current && lenisRef.current) {
        lenisRef.current.raf(timestamp);
      }
    };
    frame.update(update, true);

    // Pause RAF loop when tab is hidden to save battery
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisibleRef.current = false;
        lenisRef.current?.stop();
      } else {
        isVisibleRef.current = true;
        lenisRef.current?.start();
      }
    };

    // Allow other components to stop/start Lenis via custom events
    const handleLenisStop = () => lenisRef.current?.stop();
    const handleLenisStart = () => lenisRef.current?.start();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('lenis:stop', handleLenisStop);
    window.addEventListener('lenis:start', handleLenisStart);

    return () => {
      cancelFrame(update);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('lenis:stop', handleLenisStop);
      window.removeEventListener('lenis:start', handleLenisStart);
      lenisRef.current?.destroy();
    };
  }, []);

  return <>{children}</>;
}
