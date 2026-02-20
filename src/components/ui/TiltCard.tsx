import { useRef, ReactNode } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useTiltEffect } from '../../hooks/useMousePosition';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  glareEnabled?: boolean;
  maxTilt?: number;
}

export function TiltCard({
  children,
  className = '',
  glareEnabled = true,
  maxTilt = 8,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { tilt, isHovered } = useTiltEffect(ref, maxTilt);

  const springRotateX = useSpring(tilt.rotateX, { stiffness: 300, damping: 20 });
  const springRotateY = useSpring(tilt.rotateY, { stiffness: 300, damping: 20 });
  const scale = useTransform(isHovered, [0, 1], [1, 1.02]);
  const springScale = useSpring(scale, { stiffness: 300, damping: 20 });
  const glareOpacity = useSpring(isHovered, { stiffness: 300, damping: 20 });

  const glareAngle = useTransform(springRotateY, (v) => `${105 + v * 2}deg`);
  const glareBackground = useTransform(
    glareAngle,
    (angle) => `linear-gradient(${angle}, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.03) 50%, rgba(255, 255, 255, 0) 100%)`
  );

  return (
    <motion.div
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

      {/* Glare effect */}
      {glareEnabled && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: glareBackground,
            opacity: glareOpacity,
          }}
        />
      )}
    </motion.div>
  );
}
