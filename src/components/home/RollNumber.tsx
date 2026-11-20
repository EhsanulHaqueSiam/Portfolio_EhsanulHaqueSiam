import NumberFlow, { type Format } from '@number-flow/react';
import { useEffect, useRef, useState } from 'react';

/**
 * A number whose digits roll up (NumberFlow) the first time it scrolls into view.
 * The server HTML carries the real value; only numbers still below the fold
 * reset to 0 on hydration so they have something to roll from.
 */
export function RollNumber({ value, format, className }: { value: number; format?: Format; className?: string }) {
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.getBoundingClientRect().top < innerHeight) return;
    setShown(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      setShown(value);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      <NumberFlow value={shown} format={format} />
    </span>
  );
}
