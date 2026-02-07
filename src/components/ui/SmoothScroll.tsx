import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { useFrame } from '../../hooks/useFrame';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  useFrame((time) => {
    lenisRef.current?.raf(time);
  });

  return <>{children}</>;
}
