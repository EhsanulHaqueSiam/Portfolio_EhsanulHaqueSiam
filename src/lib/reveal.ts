import { type RefObject, useEffect } from 'react';

/**
 * Home blocks that start below the fold fade and rise in once as they scroll into view
 * (motion-primitives' InView, done with one observer and a CSS transition, see index.css).
 * Blocks are hidden only after hydration and only if they start off screen, so the server
 * HTML, no-JS visitors and anything already in view are never hidden.
 * The quote's words stagger in off the same signal.
 */
export function useReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const below = [...el.querySelectorAll<HTMLElement>('[data-reveal]')].filter((b) => b.getBoundingClientRect().top > innerHeight);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.reveal = 'in';
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    for (const b of below) {
      b.dataset.reveal = 'wait';
      io.observe(b);
    }
    return () => io.disconnect();
  }, [root]);
}
