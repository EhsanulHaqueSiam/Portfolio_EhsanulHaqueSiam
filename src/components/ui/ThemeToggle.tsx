import { useState } from 'react';
import { SunIcon, MoonIcon } from './Icons';

/**
 * Light/dark toggle. Flips the html.dark class inside a View Transition
 * (cross-fade), persists to localStorage, then spins the icon.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const [spinning, setSpinning] = useState(false);

  const handleToggle = () => {
    const root = document.documentElement;
    const next = root.classList.contains('dark') ? 'light' : 'dark';

    const apply = () => {
      root.classList.toggle('dark', next === 'dark');
      try {
        localStorage.setItem('theme', next);
      } catch {
        /* private mode */
      }
    };

    const spin = () => {
      setSpinning(true);
      window.setTimeout(() => setSpinning(false), 500);
    };

    const doc = document as Document & {
      startViewTransition?: (cb: () => unknown) => { finished: Promise<void> };
    };

    if (typeof doc.startViewTransition !== 'function') {
      apply();
      spin();
      return;
    }

    doc.startViewTransition(apply).finished.then(spin).catch(spin);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Toggle color theme"
      className={`relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground ${className}`}
    >
      <SunIcon className={`h-5 w-5 dark:hidden ${spinning ? 'animate-spin-grow' : ''}`} />
      <MoonIcon className={`hidden h-5 w-5 dark:block ${spinning ? 'animate-spin-grow' : ''}`} />
    </button>
  );
}
