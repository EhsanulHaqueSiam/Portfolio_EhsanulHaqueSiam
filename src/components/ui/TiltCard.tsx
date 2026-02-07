import { useRef, ReactNode } from 'react';
import { motion } from 'framer-motion';
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

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
    >
      {children}

      {/* Glare effect */}
      {glareEnabled && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `linear-gradient(
              ${105 + tilt.rotateY * 2}deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.03) 50%,
              rgba(255, 255, 255, 0) 100%
            )`,
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}
