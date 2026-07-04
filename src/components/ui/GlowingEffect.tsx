import { memo, useCallback, useEffect, useRef } from 'react';
import { animate } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}

/**
 * Pointer-tracking conic border glow (aceternity port). A multicolor arc
 * chases the cursor around the card border while the pointer is near.
 */
export const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 1,
    disabled = false,
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>(0);
    const angleAnimRef = useRef<ReturnType<typeof animate> | null>(null);

    const handleMove = useCallback(
      (e?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current) return;
        // Mid-scroll the pointer isn't meaningfully "on" anything; skip the
        // rect read + tween churn entirely (many instances share each move).
        if (document.documentElement.classList.contains('is-scrolling')) return;

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;

          const { left, top, width, height } = element.getBoundingClientRect();
          const mouseX = e?.x ?? lastPosition.current.x;
          const mouseY = e?.y ?? lastPosition.current.y;

          if (e) {
            lastPosition.current = { x: mouseX, y: mouseY };
          }

          const center = [left + width * 0.5, top + height * 0.5];
          const distanceFromCenter = Math.hypot(mouseX - center[0], mouseY - center[1]);
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty('--active', '0');
            return;
          }

          const isActive =
            mouseX > left - proximity &&
            mouseX < left + width + proximity &&
            mouseY > top - proximity &&
            mouseY < top + height + proximity;

          element.style.setProperty('--active', isActive ? '1' : '0');

          if (!isActive) return;

          const currentAngle = parseFloat(element.style.getPropertyValue('--start')) || 0;
          const targetAngle = (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) / Math.PI + 90;

          const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
          const newAngle = currentAngle + angleDiff;

          // Replace, never stack: each move retargets one running tween.
          angleAnimRef.current?.stop();
          angleAnimRef.current = animate(currentAngle, newAngle, {
            duration: movementDuration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) => {
              element.style.setProperty('--start', String(value));
            },
          });
        });
      },
      [inactiveZone, proximity, movementDuration]
    );

    useEffect(() => {
      if (disabled) return;
      const el = containerRef.current;
      if (!el) return;

      // Only track the pointer while the card is actually on screen; nine of
      // these reading layout on every pointermove is real jank otherwise.
      // No scroll listener on purpose: Lenis emits scroll every frame, and
      // reacting to it spawned a fresh tween per card per frame.
      let attached = false;
      const handlePointerMove = (e: PointerEvent) => handleMove(e);

      const attach = () => {
        if (attached) return;
        attached = true;
        document.body.addEventListener('pointermove', handlePointerMove, { passive: true });
      };
      const detach = () => {
        if (!attached) return;
        attached = false;
        document.body.removeEventListener('pointermove', handlePointerMove);
      };

      const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? attach() : detach()), {
        rootMargin: '15%',
      });
      io.observe(el);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        angleAnimRef.current?.stop();
        io.disconnect();
        detach();
      };
    }, [handleMove, disabled]);

    return (
      <>
        <div
          className={cn(
            'pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity',
            glow && 'opacity-100',
            disabled && '!block'
          )}
        />
        <div
          ref={containerRef}
          style={
            {
              '--blur': `${blur}px`,
              '--spread': spread,
              '--start': '0',
              '--active': '0',
              '--glowingeffect-border-width': `${borderWidth}px`,
              '--repeating-conic-gradient-times': '5',
              // Sealed signal palette (iris-violet → signal-cyan), matching the
              // ASCII fields — keeps the card-hover glow on-identity instead of
              // a 4-color rainbow (the brand has exactly two sealed exceptions).
              '--gradient': `radial-gradient(circle, #8b7cff 10%, #8b7cff00 20%),
                radial-gradient(circle at 40% 40%, #5ee7f5 5%, #5ee7f500 15%),
                radial-gradient(circle at 60% 60%, #6ea8ff 10%, #6ea8ff00 20%),
                radial-gradient(circle at 40% 60%, #a99dff 10%, #a99dff00 20%),
                repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  #8b7cff 0%,
                  #5ee7f5 calc(25% / var(--repeating-conic-gradient-times)),
                  #6ea8ff calc(50% / var(--repeating-conic-gradient-times)),
                  #a99dff calc(75% / var(--repeating-conic-gradient-times)),
                  #8b7cff calc(100% / var(--repeating-conic-gradient-times))
                )`,
            } as React.CSSProperties
          }
          className={cn(
            'pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity',
            glow && 'opacity-100',
            blur > 0 && 'blur-[var(--blur)]',
            className,
            disabled && '!hidden'
          )}
        >
          <div
            className={cn(
              'glow rounded-[inherit]',
              'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
              'after:[border:var(--glowingeffect-border-width)_solid_transparent]',
              'after:[background:var(--gradient)] after:[background-attachment:fixed]',
              'after:opacity-[var(--active)] after:transition-opacity after:duration-300',
              'after:[mask-clip:padding-box,border-box]',
              'after:[mask-composite:intersect]',
              'after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]'
            )}
          />
        </div>
      </>
    );
  }
);

GlowingEffect.displayName = 'GlowingEffect';
