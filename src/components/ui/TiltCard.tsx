import { useEffect, useRef, useState, ReactNode } from 'react';
import { m, useMotionTemplate, useSpring, useTransform } from 'framer-motion';
import { useTiltEffect } from '../../hooks/useMousePosition';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 8,
}: TiltCardProps) {
  const [canAnimate, setCanAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { tilt, isHovered } = useTiltEffect(ref, maxTilt);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setCanAnimate(pointerQuery.matches && !motionQuery.matches);

    sync();
    pointerQuery.addEventListener('change', sync);
    motionQuery.addEventListener('change', sync);
    return () => {
      pointerQuery.removeEventListener('change', sync);
      motionQuery.removeEventListener('change', sync);
    };
  }, []);

  const springRotateX = useSpring(tilt.rotateX, { stiffness: 300, damping: 20 });
  const springRotateY = useSpring(tilt.rotateY, { stiffness: 300, damping: 20 });
  const scale = useTransform(isHovered, [0, 1], [1, 1.01]);
  const springScale = useSpring(scale, { stiffness: 260, damping: 24, mass: 0.85 });
  const transform = useMotionTemplate`perspective(1000px) rotateX(${springRotateX}deg) rotateY(${springRotateY}deg) scale(${springScale})`;

  if (!canAnimate) {
    return (
      <div className={`relative ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <m.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transform,
      }}
    >
      {children}
    </m.div>
  );
}
