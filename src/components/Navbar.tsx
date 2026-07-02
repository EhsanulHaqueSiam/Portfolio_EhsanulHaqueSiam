import { useEffect, useState } from 'react';
import { AnimatePresence, m, useScroll, useMotionValueEvent } from 'framer-motion';
import { navItems } from '../data/content';
import { ThemeToggle } from './ui/ThemeToggle';
import { GitHubIcon, StarIcon, CommandIcon } from './ui/Icons';

const REPO_URL = 'https://github.com/EhsanulHaqueSiam/Portfolio_EhsanulHaqueSiam';
const REPO_API = 'https://api.github.com/repos/EhsanulHaqueSiam/Portfolio_EhsanulHaqueSiam';

// The bar shows a compact subset; everything is reachable via Cmd+K.
const NAV_LABELS = ['About', 'Experience', 'Work', 'Research', 'Notes', 'Contact'];
const barItems = navItems.filter((item) => NAV_LABELS.includes(item.label));

/**
 * Glass navbar (reference port): hides on scroll down, returns on scroll up.
 * Logo, section links, GitHub star chip, command palette button, theme toggle.
 */
export function Navbar() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [stars, setStars] = useState<number | null>(null);

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (current < 50) setVisible(true);
    else setVisible(current < previous);
  });

  useEffect(() => {
    const controller = new AbortController();
    fetch(REPO_API, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json && typeof json.stargazers_count === 'number') setStars(json.stargazers_count);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const goTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', href);
  };

  const openPalette = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <m.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="glass-chrome fixed inset-x-0 top-0 z-[500] mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:top-4 sm:rounded-xl sm:px-6"
        >
          {/* Logo */}
          <a
            href="#main-content"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            title="Back to top"
            className="script-accent select-none text-lg text-foreground transition-transform duration-300 hover:-rotate-6"
          >
            es.
          </a>

          {/* Links */}
          <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
            {barItems.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => goTo(item.href)}
                className="relative rounded-md px-1.5 py-1.5 text-[13px] font-semibold text-muted-foreground transition-colors duration-300 hover:text-foreground sm:px-2.5 sm:text-sm max-[480px]:[&:nth-child(n+4)]:hidden"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <span aria-hidden className="hidden h-5 w-px bg-border sm:block" />

            {/* GitHub star chip */}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Star this site on GitHub${stars !== null ? ` (${stars} stars)` : ''}`}
              className="group hidden items-center gap-1.5 rounded-md border border-border/60 bg-background/40 px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-border hover:bg-background/70 hover:text-foreground sm:inline-flex"
            >
              <GitHubIcon className="h-3.5 w-3.5" />
              <span className="flex items-center gap-0.5 tabular-nums">
                <StarIcon className="h-3 w-3 transition-colors group-hover:animate-spin-grow group-hover:text-amber-400" />
                {stars ?? 0}
              </span>
            </a>

            {/* Command palette */}
            <button
              type="button"
              onClick={openPalette}
              aria-label="Open command palette (Ctrl+K)"
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
            >
              <CommandIcon className="h-5 w-5" />
            </button>

            <ThemeToggle />
          </div>
        </m.header>
      )}
    </AnimatePresence>
  );
}
