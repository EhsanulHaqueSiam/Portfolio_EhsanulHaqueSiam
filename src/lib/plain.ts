import { useSyncExternalStore } from 'react';

/**
 * The plain version: no motion, no sound, no playful extras, just the text and links.
 * Saved in localStorage `plain`; Layout.astro sets `data-plain` on <html> before first paint
 * (and on every page the client router swaps in), and index.css does the rest.
 */
export const isPlain = () => typeof document !== 'undefined' && document.documentElement.hasAttribute('data-plain');

export function togglePlain() {
  const on = !isPlain();
  document.documentElement.toggleAttribute('data-plain', on);
  try {
    localStorage.setItem('plain', on ? 'on' : 'off');
  } catch {
    /* applies for this visit */
  }
}

const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-plain'] });
  return () => mo.disconnect();
};

export const usePlain = () => useSyncExternalStore(subscribe, isPlain, () => false);
