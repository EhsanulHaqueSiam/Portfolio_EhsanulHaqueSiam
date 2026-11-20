import { type ReactNode, useRef } from 'react';

/**
 * A list whose hover highlight glides from row to row (motion-primitives'
 * Animated Background, done with one measured element and CSS transitions on
 * transform and height instead of a layout animation). Mouse and keyboard only. Rows are the direct `<li>` children; the
 * highlight is a hidden last `<li>` so divide-y borders stay on the rows.
 */
export function GlideList({ children, className = '' }: { children: ReactNode; className?: string }) {
  const glide = useRef<HTMLLIElement>(null);

  const moveTo = (target: EventTarget | null) => {
    const el = glide.current;
    const row = target instanceof Element ? target.closest('li') : null;
    if (!el || !row || row === el || row.parentElement !== el.parentElement) return;
    const first = el.style.opacity !== '1';
    if (first) el.style.transition = 'none';
    el.style.transform = `translateY(${row.offsetTop}px)`;
    el.style.height = `${row.offsetHeight}px`;
    if (first) {
      void el.offsetWidth;
      el.style.transition = '';
    }
    el.style.opacity = '1';
  };
  const hide = () => {
    if (glide.current) glide.current.style.opacity = '0';
  };

  return (
    <ul
      className={`relative isolate ${className}`}
      onPointerOver={(e) => e.pointerType === 'mouse' && moveTo(e.target)}
      onFocus={(e) => moveTo(e.target)}
      onMouseLeave={hide}
      onBlur={hide}
      onPointerDown={hide}
    >
      {children}
      <li ref={glide} role="presentation" aria-hidden="true" className="glide !border-0" />
    </ul>
  );
}
