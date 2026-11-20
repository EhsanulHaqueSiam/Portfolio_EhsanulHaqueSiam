import { useRef } from 'react';
import { haptic } from '../../lib/haptics';
import { sound } from '../../lib/sound';
import { MoonIcon, SunIcon } from './Icons';

type VTDocument = Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };

/**
 * Light/dark toggle. The new theme grows out of the button as a circle
 * (View Transitions + clip-path, the same idea as Magic UI's Animated Theme
 * Toggler), with a whoosh. Saves the choice in localStorage `theme`.
 * Browsers without View Transitions, and reduced motion, switch instantly.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);

  const toggle = () => {
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
    sound.whoosh();
    haptic();

    const doc = document as VTDocument;
    if (!doc.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return apply();

    const r = ref.current?.getBoundingClientRect();
    const x = r ? r.left + r.width / 2 : innerWidth / 2;
    const y = r ? r.top + r.height / 2 : 0;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.classList.add('theme-vt');
    const vt = doc.startViewTransition(apply);
    vt.ready
      .then(() =>
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 520, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', pseudoElement: '::view-transition-new(root)' },
        ).finished,
      )
      .catch(() => {})
      .finally(() => root.classList.remove('theme-vt'));
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className={`press group relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground ${className}`}
    >
      <SunIcon className="icon-pop h-[18px] w-[18px] dark:hidden" />
      <MoonIcon className="icon-pop hidden h-[18px] w-[18px] dark:block" />
    </button>
  );
}
