import { useEffect, useRef, useState } from 'react';

/**
 * A number whose digits roll up like an odometer the first time it scrolls into view
 * (after Bencho's rolling counter): each digit is a 0-9 strip (CSS generated content, so the
 * page text holds only the real number) moved by a CSS transition,
 * and digits that appear start from 0 (`@starting-style` in index.css). Commas, the
 * decimal point and the "K" of compact numbers are drawn the same way, without a strip.
 * The server HTML carries the real value; only numbers still below the fold reset to 0
 * on hydration so they have something to roll from.
 */
export function RollNumber({ value, format, fromZero = false, className = '' }: { value: number; format?: Intl.NumberFormatOptions; fromZero?: boolean; className?: string }) {
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  // fromZero: a number already on screen at load still rolls up once (the About stats on a
  // tall screen). Snap to 0 with transitions off, then roll to the value a moment later.
  useEffect(() => {
    const el = ref.current;
    if (!fromZero || !el || el.getBoundingClientRect().top >= innerHeight) return;
    el.dataset.instant = '';
    setShown(0);
    const id = setTimeout(() => {
      delete el.dataset.instant;
      setShown(value);
    }, 260);
    return () => clearTimeout(id);
  }, [fromZero, value]);

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

  const text = new Intl.NumberFormat('en', format).format(shown);
  const chars = [...text];
  return (
    <span ref={ref} className={`odo ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {chars.map((ch, i) => {
          // Keyed from the right, so the ones digit stays the ones digit as the number grows.
          const place = chars.length - i;
          return /\d/.test(ch) ? (
            <span key={place} className="odo-digit">
              <span className="odo-strip" style={{ transform: `translateY(${-Number(ch)}lh)`, transitionDelay: `${(place - 1) * 40}ms` }} />
            </span>
          ) : (
            <span key={place} className="odo-ch" data-ch={ch} />
          );
        })}
      </span>
    </span>
  );
}
