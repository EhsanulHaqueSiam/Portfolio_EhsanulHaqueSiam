import { useEffect, useRef, useState } from 'react';
import { m, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface ImageDistortionProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function ImageDistortion({ children, className = '', intensity = 8 }: ImageDistortionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);

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

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 280, damping: 28, mass: 0.8 });
  const mouseY = useSpring(y, { stiffness: 280, damping: 28, mass: 0.8 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]);
  const transform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  const handleMouseEnter = () => {
    if (!canAnimate) return;
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
    setIsHovered(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canAnimate) return;
    const rect = rectRef.current;
    if (!rect) return;

    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    const xPct = mouseXPos / rect.width - 0.5;
    const yPct = mouseYPos / rect.height - 0.5;

    x.set(xPct);
    y.set(yPct);
    if (ref.current) {
      ref.current.style.setProperty('--glare-x', `${(xPct + 0.5) * 100}%`);
      ref.current.style.setProperty('--glare-y', `${(yPct + 0.5) * 100}%`);
    }
  };

  const handleMouseLeave = () => {
    if (!canAnimate) return;
    setIsHovered(false);
    rectRef.current = null;
    x.set(0);
    y.set(0);
  };

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
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      <m.div
        style={{
          transform,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}

        {/* Glare effect — CSS variables avoid per-frame string building */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{
            background: 'radial-gradient(600px circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(139, 92, 246, 0.15), transparent 40%)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 180ms cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        />
      </m.div>
    </m.div>
  );
}

// Magnetic hover effect for elements
interface MagneticHoverProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticHover({ children, className = '', strength = 30 }: MagneticHoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const [canAnimate, setCanAnimate] = useState(false);

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

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 220, damping: 26, mass: 0.8 });
  const springY = useSpring(y, { stiffness: 220, damping: 26, mass: 0.8 });
  const transform = useMotionTemplate`translate3d(${springX}px, ${springY}px, 0)`;

  const handleMouseEnter = () => {
    if (!canAnimate || strength === 0) return;
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canAnimate || strength === 0) return;
    const rect = rectRef.current;
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    const rawX = distanceX / strength;
    const rawY = distanceY / strength;
    const maxOffset = 10;
    x.set(Math.max(-maxOffset, Math.min(maxOffset, rawX)));
    y.set(Math.max(-maxOffset, Math.min(maxOffset, rawY)));
  };

  const handleMouseLeave = () => {
    if (!canAnimate) return;
    rectRef.current = null;
    x.set(0);
    y.set(0);
  };

  if (!canAnimate || strength === 0) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <m.div
      ref={ref}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform }}
    >
      {children}
    </m.div>
  );
}
