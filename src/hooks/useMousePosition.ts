import { useEffect, useRef, RefObject } from 'react';
import { MotionValue, useMotionValue } from 'framer-motion';

export function useTiltEffect<T extends HTMLElement>(
  ref: RefObject<T>,
  maxTilt: number = 10
): { tilt: { rotateX: MotionValue<number>; rotateY: MotionValue<number> }; isHovered: MotionValue<number> } {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const isHovered = useMotionValue(0);
  const rectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof window !== 'undefined') {
      const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!hasFinePointer || shouldReduceMotion) {
        rotateX.set(0);
        rotateY.set(0);
        isHovered.set(0);
        return;
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = rectRef.current;
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const percentX = (e.clientX - centerX) / (rect.width / 2);
      const percentY = (e.clientY - centerY) / (rect.height / 2);

      rotateX.set(-percentY * maxTilt);
      rotateY.set(percentX * maxTilt);
    };

    const handleMouseEnter = () => {
      rectRef.current = element.getBoundingClientRect();
      isHovered.set(1);
      element.addEventListener('mousemove', handleMouseMove);
    };

    const handleMouseLeave = () => {
      isHovered.set(0);
      rectRef.current = null;
      rotateX.set(0);
      rotateY.set(0);
      element.removeEventListener('mousemove', handleMouseMove);
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ref, maxTilt, rotateX, rotateY, isHovered]);

  return { tilt: { rotateX, rotateY }, isHovered };
}
