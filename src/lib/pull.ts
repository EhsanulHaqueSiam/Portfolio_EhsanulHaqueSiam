import { type PointerEvent as ReactPointerEvent, useRef } from 'react';
import { animate, useMotionValue } from 'framer-motion';

type PullOptions = {
  /** How far the element follows the pointer: 1 = exactly, 0.35 = a third of the way (a rubber band). */
  follow: number;
  /** The spring that brings it home on release; low damping swings past rest a few times. */
  stiffness: number;
  damping: number;
  onGrab?: (e: ReactPointerEvent) => void;
  onRelease?: () => void;
};

/**
 * Grab-and-pull for one element: it follows the pointer while held and springs back to where it
 * started on release, carrying the pointer's speed into the spring. Spread `handlers` on the
 * element and pass `x`/`y` in its style. Written by hand because the site's motion bundle
 * (LazyMotion `domAnimation`) leaves out framer-motion's drag feature to stay small.
 */
export function usePull({ follow, stiffness, damping, onGrab, onRelease }: PullOptions) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const grab = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  const release = () => {
    if (!grab.current) return;
    grab.current = null;
    // Standalone animate() doesn't read MotionConfig, so reduced motion is checked here: snap home.
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    for (const v of [x, y]) {
      if (still) v.set(0);
      else animate(v, 0, { type: 'spring', stiffness, damping, velocity: v.getVelocity() });
    }
    onRelease?.();
  };

  const handlers = {
    onPointerDown: (e: ReactPointerEvent<HTMLElement>) => {
      if (e.button !== 0) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      x.stop();
      y.stop();
      grab.current = { px: e.clientX, py: e.clientY, x: x.get(), y: y.get() };
      onGrab?.(e);
    },
    onPointerMove: (e: ReactPointerEvent<HTMLElement>) => {
      const g = grab.current;
      if (!g) return;
      x.set(g.x + (e.clientX - g.px) * follow);
      y.set(g.y + (e.clientY - g.py) * follow);
    },
    onPointerUp: release,
    onPointerCancel: release,
    onLostPointerCapture: release,
  };
  return { x, y, handlers };
}
