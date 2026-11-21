import { useRef, useSyncExternalStore } from 'react';
import { haptic } from '../../lib/haptics';
import { sound } from '../../lib/sound';
import { MoonIcon, SunIcon } from './Icons';

type VTDocument = Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> } };

export const isDark = () => document.documentElement.classList.contains('dark');
export const subscribeTheme = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => mo.disconnect();
};

/**
 * Switches light/dark. The new theme grows out of `from` (a point on screen) as a circle
 * (View Transitions + clip-path, like Magic UI's Animated Theme Toggler), with a whoosh.
 * Saves the choice in localStorage `theme`. Without View Transitions, or with reduced
 * motion, it switches instantly. The header button and the command menu both use it.
 */
export function toggleTheme(from?: { x: number; y: number }) {
  const root = document.documentElement;
  const next = isDark() ? 'light' : 'dark';
  const apply = () => {
    root.classList.toggle('dark', next === 'dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#000000' : '#ffffff');
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode */
    }
  };
  sound.whoosh();
  haptic('selection');

  const doc = document as VTDocument;
  if (!doc.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches || root.hasAttribute('data-plain')) return apply();

  const x = from?.x ?? innerWidth / 2;
  const y = from?.y ?? 0;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  // The new snapshot starts clipped to a dot in CSS, so no frame shows it whole
  // before the animation begins; page transitions are paused so colors don't fade after.
  root.style.setProperty('--vt-from', `circle(0px at ${x}px ${y}px)`);
  root.classList.add('theme-vt');
  const vt = doc.startViewTransition(apply);
  vt.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 600, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards', pseudoElement: '::view-transition-new(root)' },
      );
    })
    .catch(() => {});
  vt.finished.finally(() => root.classList.remove('theme-vt'));
}

/** Light/dark toggle button; the new theme grows out of it. */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const dark = useSyncExternalStore(subscribeTheme, isDark, () => true);

  const toggle = () => {
    const r = ref.current?.getBoundingClientRect();
    toggleTheme(r && { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`press group relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground ${className}`}
    >
      <SunIcon className="icon-pop h-[18px] w-[18px] dark:hidden" />
      <MoonIcon className="icon-pop hidden h-[18px] w-[18px] dark:block" />
    </button>
  );
}
