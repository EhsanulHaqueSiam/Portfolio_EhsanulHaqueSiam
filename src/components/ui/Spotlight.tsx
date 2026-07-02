import { useEffect } from 'react';

/**
 * Cursor spotlight for glass cards. One delegated pointermove listener sets
 * --mx/--my custom properties on whichever `.glass-card` the pointer is over;
 * the CSS ::before radial highlight (see index.css) follows the cursor.
 * Renders nothing. Desktop-pointer only.
 */
export function Spotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let raf = 0;
    let lastEvent: PointerEvent | null = null;

    const apply = () => {
      raf = 0;
      const e = lastEvent;
      if (!e) return;
      const card = (e.target as Element | null)?.closest?.<HTMLElement>('.glass-card');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };

    const onMove = (e: PointerEvent) => {
      lastEvent = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
