import { useRef, ReactNode, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useMagneticEffect } from '../../hooks/useMousePosition';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  strength?: number;
  as?: 'button' | 'a';
  target?: string;
  rel?: string;
}

export const MagneticButton = memo(function MagneticButton({
  children,
  className = '',
  href,
  onClick,
  strength = 0.4,
  as = 'button',
  target,
  rel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { offset, isHovered } = useMagneticEffect(ref, strength);

  const Component = as === 'a' ? motion.a : motion.button;

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  return (
    <motion.div
      ref={ref}
      className="relative inline-block"
      animate={{
        x: offset.x,
        y: offset.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
    >
      <Component
        href={href}
        onClick={handleClick}
        target={target}
        rel={rel}
        className={`relative overflow-hidden ${className}`}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.1 }}
      >
        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
          animate={{
            translateX: isHovered ? '200%' : '-100%',
          }}
          transition={{
            duration: 0.6,
            ease: 'easeInOut',
          }}
        />
        {children}
      </Component>
    </motion.div>
  );
});
