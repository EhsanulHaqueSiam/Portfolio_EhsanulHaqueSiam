import { m, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  pauseOnHover?: boolean;
}

export function Marquee({
  children,
  speed = 50,
  direction = 'left',
  className = '',
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div
      className={`overflow-hidden whitespace-nowrap ${className}`}
      style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}
    >
      <div
        className={`inline-flex ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
        }}
      >
        <span className="inline-flex">{children}</span>
        <span className="inline-flex">{children}</span>
      </div>
    </div>
  );
}

// Scroll-velocity based marquee
interface VelocityMarqueeProps {
  children: React.ReactNode;
  baseVelocity?: number;
  className?: string;
}

export function VelocityMarquee({
  children,
  baseVelocity = 3,
  className = '',
}: VelocityMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const scrollVelocity = useSpring(
    useTransform(scrollY, [0, 1000], [0, baseVelocity * 5]),
    { damping: 50, stiffness: 400 }
  );

  const x = useTransform(scrollVelocity, (v) => `${-v}%`);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden whitespace-nowrap ${className}`}
      style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
    >
      <m.div className="inline-flex" style={{ x }}>
        <span className="inline-flex">{children}</span>
        <span className="inline-flex">{children}</span>
        <span className="inline-flex">{children}</span>
        <span className="inline-flex">{children}</span>
      </m.div>
    </div>
  );
}
