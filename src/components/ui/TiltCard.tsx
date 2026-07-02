import { useRef } from 'react';
import { m, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Springy 3D tilt-on-hover wrapper. The card leans toward the cursor with
 * perspective and lifts slightly. Fine-pointer only; no-ops under reduced
 * motion and on touch devices.
 */
export function TiltCard({
  children,
  className = '',
  maxTilt = 7,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 260, damping: 24 });
  const sy = useSpring(py, { stiffness: 260, damping: 24 });
  const rotateX = useTransform(sy, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(sx, [0, 1], [-maxTilt, maxTilt]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== 'mouse') return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const onPointerLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <m.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={
        reduced
          ? undefined
          : { rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: 900 }
      }
      className={`h-full will-change-transform ${className}`}
    >
      {children}
    </m.div>
  );
}
