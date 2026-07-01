import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  // Always start `false` on the server AND the first client render so the
  // island hydrates without a mismatch; the real value is applied post-mount.
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }

    // Safari < 14 fallback
    mql.addListener(handler);
    return () => mql.removeListener(handler);
  }, [query]);

  return matches;
}
