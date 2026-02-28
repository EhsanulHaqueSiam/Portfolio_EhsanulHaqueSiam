import { useRef, ReactNode } from 'react';
import { m, useSpring, useTransform } from 'framer-motion';
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
  const ref = useRef<HTMLDivElement>(null);
  const { tilt, isHovered } = useTiltEffect(ref, maxTilt);

  const springRotateX = useSpring(tilt.rotateX, { stiffness: 300, damping: 20 });
  const springRotateY = useSpring(tilt.rotateY, { stiffness: 300, damping: 20 });
  const scale = useTransform(isHovered, [0, 1], [1, 1.02]);
  const springScale = useSpring(scale, { stiffness: 300, damping: 20 });

  return (
    <m.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
        rotateX: springRotateX,
        rotateY: springRotateY,
        scale: springScale,
      }}
    >
      {children}
    </m.div>
  );
}
