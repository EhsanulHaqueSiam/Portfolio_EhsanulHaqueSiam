import { useEffect, useState, useSyncExternalStore } from 'react';
import { sound } from './sound';

/** The hidden cats a visitor can find, one per place. The dock cat is always in view, so it doesn't count. */
export const CATS = ['banner', 'band', 'paper', 'notfound', 'menu'] as const;
export type CatId = (typeof CATS)[number];

const KEY = 'cats-found';
let found = new Set<CatId>();
let last: { count: number; at: number } | null = null;
const listeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    if (Array.isArray(saved)) found = new Set(saved.filter((c): c is CatId => (CATS as readonly string[]).includes(c)));
  } catch {
    /* storage blocked or corrupt: start the hunt fresh */
  }
}

/** Pets a cat: it meows, and the first time it counts toward the hunt (remembered in this browser only). */
export function findCat(id: CatId) {
  sound.meow();
  if (!found.has(id)) {
    found = new Set(found).add(id);
    try {
      localStorage.setItem(KEY, JSON.stringify([...found]));
    } catch {
      /* still counts for this visit */
    }
  }
  last = { count: found.size, at: Date.now() };
  for (const l of listeners) l();
}

/** The latest find, for the "3 of 5 cats found" pill; null once it has been up for a moment. */
export function useCatFind() {
  const find = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => last,
    () => null,
  );
  const [shown, setShown] = useState(find);
  useEffect(() => {
    setShown(find);
    if (!find) return;
    const id = setTimeout(() => setShown(null), 2400);
    return () => clearTimeout(id);
  }, [find]);
  return shown;
}
