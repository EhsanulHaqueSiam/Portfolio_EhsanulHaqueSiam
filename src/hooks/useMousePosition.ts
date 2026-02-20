import { useState, useEffect, useCallback, useRef, RefObject } from 'react';
import { MotionValue, useMotionValue } from 'framer-motion';

interface MousePosition {
  x: number;
  y: number;
}

export function useMousePosition() {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
}

export function useMagneticEffect<T extends HTMLElement>(
  ref: RefObject<T>,
  strength: number = 0.3
) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const rect = rectRef.current;
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      setOffset({
        x: distanceX * strength,
        y: distanceY * strength,
      });
    },
    [strength]
  );

  const handleMouseEnter = useCallback(() => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
    setIsHovered(true);
    window.addEventListener('mousemove', handleMouseMove);
  }, [ref, handleMouseMove]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    rectRef.current = null;
    setOffset({ x: 0, y: 0 });
    window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ref, handleMouseEnter, handleMouseLeave, handleMouseMove]);

  return { offset, isHovered };
}

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
