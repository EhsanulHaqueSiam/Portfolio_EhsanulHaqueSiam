import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { useFrame } from '../../hooks/useFrame';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    // Check if we're on a touch device - use native scroll for better performance
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      // Don't initialize Lenis on mobile - native scroll is smoother and saves battery
      return;
    }

    try {
      lenisRef.current = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      });
    } catch (e) {
      console.error('Failed to initialize smooth scroll:', e);
      return;
    }

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
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('lenis:stop', handleLenisStop);
      window.removeEventListener('lenis:start', handleLenisStart);
      lenisRef.current?.destroy();
    };
  }, []);

  useFrame((time) => {
    if (isVisibleRef.current && lenisRef.current) {
      lenisRef.current.raf(time);
    }
  });

  return <>{children}</>;
}
