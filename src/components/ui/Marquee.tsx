import { useEffect, useState } from 'react';

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
  const [canHover, setCanHover] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setCanHover(hoverQuery.matches);
      setShouldReduceMotion(motionQuery.matches);
    };

    sync();
    hoverQuery.addEventListener('change', sync);
    motionQuery.addEventListener('change', sync);
    return () => {
      hoverQuery.removeEventListener('change', sync);
      motionQuery.removeEventListener('change', sync);
    };
  }, []);

  return (
    <div
      className={`overflow-hidden whitespace-nowrap ${className}`}
      style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}
    >
      <div
        className={`inline-flex ${pauseOnHover && canHover ? 'hover:[animation-play-state:paused]' : ''}`}
        style={{
          animation: shouldReduceMotion ? 'none' : `marquee-${direction} ${speed}s linear infinite`,
        }}
      >
        <span className="inline-flex">{children}</span>
        <span className="inline-flex">{children}</span>
      </div>
    </div>
  );
}
