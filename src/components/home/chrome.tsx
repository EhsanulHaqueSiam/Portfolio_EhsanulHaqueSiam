import { type ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, type MotionValue, m, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { profile } from '../../data/content';
import { haptic } from '../../lib/haptics';
import { sound, toggleSound, useSoundState } from '../../lib/sound';
import { ArrowUpRightIcon, EmailIcon, GitHubIcon, LinkedInIcon, ResumeIcon } from '../ui/Icons';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Brand, SpeakerIcon } from './icons';

/** Every place to reach Siam, in dock order. `sep` puts a divider before the item. */
export const links = [
  { label: 'Email', href: `mailto:${profile.email}`, icon: <EmailIcon className="h-full w-full" /> },
  { label: 'GitHub', href: profile.github, icon: <GitHubIcon className="h-full w-full" /> },
  { label: 'X', href: profile.x, icon: <Brand name="x" className="h-full w-full" /> },
  { label: 'LinkedIn', href: profile.linkedin, icon: <LinkedInIcon className="h-full w-full" /> },
  { label: 'Google Scholar', href: profile.scholar, icon: <Brand name="scholar" className="h-full w-full" /> },
  { label: 'ORCID', href: profile.orcid, icon: <Brand name="orcid" className="h-full w-full" /> },
  { label: 'CV', href: '#resume', icon: <ResumeIcon className="h-full w-full" />, sep: true },
];

/** Extra profiles shown as Contact chips but kept out of the dock. */
export const moreLinks = [
  { label: 'ResearchGate', href: profile.researchgate, icon: <Brand name="researchgate" className="h-full w-full" /> },
  { label: 'Kaggle', href: profile.kaggle, icon: <Brand name="kaggle" className="h-full w-full" /> },
];

export const isExternal = (href: string) => href.startsWith('http');
export const ext = (href: string) => (isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {});

/** A titled block between hatched bands. `aside` sits right of the title (a link or a hint). */
export function Section({ id, title, aside, children, flush }: { id?: string; title: ReactNode; aside?: ReactNode; children: ReactNode; flush?: boolean }) {
  return (
    <section id={id} aria-labelledby={id && `${id}-title`} className="scroll-mt-16">
      <div className="hatch" aria-hidden="true" />
      <div className={flush ? 'pt-4' : 'px-4 py-5'}>
        <div className={`mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-2 ${flush ? 'px-4' : ''}`}>
          <h2 id={id && `${id}-title`} className="text-balance font-serif text-[28px] leading-none tracking-[-0.01em]">
            {title}
          </h2>
          {aside && <div className="text-xs text-muted-foreground">{aside}</div>}
        </div>
        {children}
      </div>
    </section>
  );
}

/** Small "Label ↗" link used in section headers. */
export function HeaderLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} {...ext(href)} onMouseEnter={sound.tick} className="group -my-1.5 inline-flex items-center gap-1 py-1.5 transition-colors hover:text-foreground">
      {children}
      <ArrowUpRightIcon className="icon-arrow h-3 w-3" />
    </a>
  );
}

export function SoundToggle() {
  const state = useSoundState();
  const hint = state === 'off' ? 'Sound off' : state === 'locked' ? 'Sound on: click anywhere to hear it' : 'Sound on';
  return (
    <button
      type="button"
      aria-pressed={state !== 'off'}
      aria-label="Sound"
      title={hint}
      onClick={() => {
        toggleSound();
        haptic('selection');
      }}
      className="press group grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
    >
      <SpeakerIcon on={state !== 'off'} className={`icon-pop h-4 w-4 transition-opacity ${state === 'locked' ? 'opacity-50' : ''}`} />
    </button>
  );
}

export type Page = 'home' | 'publications' | 'work' | 'paper';

const NAV = [
  { label: 'Home', href: '/', page: 'home' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Research', href: '/publications/', page: 'publications' },
  { label: 'CV', href: '#resume' },
] as const;
// Detail pages light up their parent link without claiming to be that page.
const PARENT: Record<Page, string> = { home: 'Home', publications: 'Research', work: 'Home', paper: 'Research' };

/**
 * The dot under the active link slides to whichever link is hovered (the
 * transitions.dev tabs-sliding pattern: measure the link, let CSS tween the dot).
 */
export function Nav({ current }: { current: Page }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);
  const active = PARENT[current];
  const target = hovered ?? active;

  const targetRef = useRef(target);
  targetRef.current = target;

  const place = useCallback((snap: boolean) => {
    const dot = dotRef.current;
    const link = listRef.current?.querySelector<HTMLElement>(`[data-nav="${targetRef.current}"]`);
    if (!dot || !link?.offsetParent) return;
    const x = link.offsetLeft + link.offsetWidth / 2 - 2;
    if (snap || !placed.current) {
      dot.style.transition = 'none';
      dot.style.transform = `translateX(${x}px)`;
      void dot.offsetWidth;
      dot.style.transition = '';
      placed.current = true;
    } else dot.style.transform = `translateX(${x}px)`;
    dot.style.opacity = '1';
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: place reads the target through a ref; re-run when it changes
  useLayoutEffect(() => place(false), [target, place]);
  // Links move when the webfont swaps in or the "Projects" link appears at sm: snap the dot back under.
  useEffect(() => {
    const ul = listRef.current;
    if (!ul) return;
    const ro = new ResizeObserver(() => place(true));
    ro.observe(ul);
    document.fonts?.ready.then(() => place(true));
    return () => ro.disconnect();
  }, [place]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <nav aria-label="Primary" className="flex items-center justify-between gap-3 px-4 py-2.5">
        <a href="/" className="font-serif text-[26px] leading-none" onMouseEnter={sound.tick}>
          Siam
        </a>
        <div className="flex items-center gap-1 sm:gap-3">
          <ul ref={listRef} className="relative flex items-center gap-3 text-[13px] sm:gap-4" onMouseLeave={() => setHovered(null)}>
            {NAV.map((it) => (
              <li key={it.label} className={it.label === 'Projects' ? 'hidden sm:block' : undefined}>
                <a
                  href={it.href}
                  data-nav={it.label}
                  aria-current={'page' in it && it.page === current ? 'page' : it.label === active ? 'true' : undefined}
                  onMouseEnter={() => {
                    setHovered(it.label);
                    sound.tick();
                  }}
                  className="block py-1 text-muted-foreground transition-colors hover:text-foreground aria-[current]:text-foreground"
                >
                  {it.label}
                </a>
              </li>
            ))}
            <span ref={dotRef} aria-hidden="true" className="nav-dot" />
          </ul>
          <div className="ml-1 flex items-center gap-1.5">
            <SoundToggle />
            <ThemeToggle className="!h-8 !w-8 border border-border" />
          </div>
        </div>
      </nav>
    </header>
  );
}

const DOCK_BASE = 36;
const DOCK_MAX = 54;
const DOCK_RANGE = 120;

function DockItem({ item, i, mouseX }: { item: (typeof links)[number]; i: number; mouseX: MotionValue<number> }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [tip, setTip] = useState(false);
  const distance = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? x - (r.left + r.width / 2) : Number.POSITIVE_INFINITY;
  });
  const size = useSpring(useTransform(distance, [-DOCK_RANGE, 0, DOCK_RANGE], [DOCK_BASE, DOCK_MAX, DOCK_BASE]), {
    mass: 0.12,
    stiffness: 190,
    damping: 13,
  });
  const glyph = useTransform(size, [DOCK_BASE, DOCK_MAX], [1, 1.3]);

  return (
    <m.a
      ref={ref}
      href={item.href}
      {...ext(item.href)}
      aria-label={item.label}
      style={{ width: size, height: size }}
      whileTap={{ scale: 0.9 }}
      onMouseEnter={() => {
        setTip(true);
        sound.note(i);
      }}
      onMouseLeave={() => setTip(false)}
      onFocus={() => setTip(true)}
      onBlur={() => setTip(false)}
      onClick={() => haptic()}
      className="relative grid shrink-0 place-items-center rounded-[10px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
    >
      <AnimatePresence>
        {tip && (
          <m.span
            initial={{ opacity: 0, y: 6, x: '-50%', filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, x: '-50%', filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 4, x: '-50%', filter: 'blur(3px)' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
            className="pointer-events-none absolute -top-8 left-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-[11px] text-foreground"
          >
            {item.label}
          </m.span>
        )}
      </AnimatePresence>
      <m.span style={{ scale: glyph }} className="block h-[17px] w-[17px]">
        {item.icon}
      </m.span>
    </m.a>
  );
}

/** Floating bottom dock; icons magnify under the cursor on desktop, static on touch. */
export function Dock() {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
  const reduce = useReducedMotion();
  return (
    <nav
      aria-label="Elsewhere"
      onMouseMove={(e) => !reduce && matchMedia('(hover: hover) and (pointer: fine)').matches && mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
      className="fixed bottom-4 left-1/2 z-40 flex h-[50px] -translate-x-1/2 items-end gap-1 rounded-2xl border border-border bg-card/95 px-1.5 pb-[6px] shadow-[0_10px_30px_rgb(0_0_0/0.35)] print:hidden"
    >
      {links.map((item, i) => (
        <span key={item.label} className="contents">
          {item.sep && <span aria-hidden="true" className="mx-0.5 mb-1.5 h-6 w-px self-end bg-border" />}
          <DockItem item={item} i={i} mouseX={mouseX} />
        </span>
      ))}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border px-4 pb-24 pt-5 font-mono text-[11px] text-muted-foreground">
      © {new Date().getFullYear()} {profile.name}. Dhaka, Bangladesh.
    </footer>
  );
}
