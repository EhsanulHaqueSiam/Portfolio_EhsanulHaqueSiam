import { useEffect, useState } from 'react';
import { AnimatePresence, m, useScroll, useMotionValueEvent } from 'framer-motion';
import { navItems } from '../data/content';
import { scrollToSection } from '../lib/scrollToSection';
import { ThemeToggle } from './ui/ThemeToggle';
import { GitHubIcon, StarIcon, CommandIcon, MenuIcon, CloseIcon } from './ui/Icons';

const GITHUB_USER = 'EhsanulHaqueSiam';
const PROFILE_URL = `https://github.com/${GITHUB_USER}`;
const STARS_CACHE_KEY = 'gh-total-stars';
const STARS_CACHE_TTL = 6 * 60 * 60 * 1000; // 6h — unauthenticated API is rate-limited

/** Total stars across every owned repo (paginated), cached in localStorage. */
async function fetchTotalStars(signal: AbortSignal): Promise<number | null> {
  try {
    const cached = JSON.parse(localStorage.getItem(STARS_CACHE_KEY) ?? 'null');
    if (cached && Date.now() - cached.t < STARS_CACHE_TTL) return cached.v;
  } catch {
    /* corrupt cache — refetch */
  }
  let total = 0;
  for (let page = 1; page <= 3; page++) {
    const r = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&page=${page}&type=owner`,
      { signal }
    );
    if (!r.ok) return null;
    const repos: Array<{ stargazers_count?: number }> = await r.json();
    total += repos.reduce((sum, repo) => sum + (repo.stargazers_count ?? 0), 0);
    if (repos.length < 100) break;
  }
  try {
    localStorage.setItem(STARS_CACHE_KEY, JSON.stringify({ v: total, t: Date.now() }));
  } catch {
    /* storage full/blocked — fine */
  }
  return total;
}

// The bar shows a compact subset; everything is reachable via Cmd+K.
const NAV_LABELS = ['About', 'Experience', 'Work', 'Research', 'Notes', 'Contact'];
const barItems = navItems.filter((item) => NAV_LABELS.includes(item.label));

/**
 * Glass navbar (reference port): hides on scroll down, returns on scroll up.
 * Logo, section links, GitHub star chip, command palette button, theme toggle.
 * Below md the links collapse into a hamburger menu listing every section.
 */
export function Navbar() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stars, setStars] = useState<number | null>(null);

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (current < 50) setVisible(true);
    else setVisible(current < previous);
  });

  // The bar hides on scroll-down; take the menu with it.
  useEffect(() => {
    if (!visible) setMenuOpen(false);
  }, [visible]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  useEffect(() => {
    const controller = new AbortController();
    fetchTotalStars(controller.signal)
      .then((total) => {
        if (total !== null) setStars(total);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const goTo = (href: string) => {
    scrollToSection(href);
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
          {/* biome-ignore lint/a11y/useValidAnchor: valid #main-content href; onClick only adds smooth scrolling */}
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

          {/* Links (desktop) */}
          <nav aria-label="Primary" className="hidden items-center gap-2 md:flex">
            {barItems.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => goTo(item.href)}
                className="relative rounded-md px-2.5 py-1.5 text-sm font-semibold text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <span aria-hidden className="hidden h-5 w-px bg-border md:block" />

            {/* GitHub chip: total stars across all repos */}
            <a
              href={PROFILE_URL}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={`GitHub profile${stars !== null ? ` (${stars} stars across repositories)` : ''}`}
              className="group hidden items-center gap-1.5 rounded-md border border-border/60 bg-background/40 px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-border hover:bg-background/70 hover:text-foreground sm:inline-flex"
            >
              <GitHubIcon className="h-3.5 w-3.5" />
              {stars !== null && (
                <span className="flex items-center gap-0.5 tabular-nums">
                  <StarIcon className="h-3 w-3 transition-colors group-hover:animate-spin-grow group-hover:text-amber-400" />
                  {stars.toLocaleString()}
                </span>
              )}
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

            {/* Hamburger (mobile) */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground md:hidden"
            >
              {menuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile menu: every section, two columns */}
          <AnimatePresence>
            {menuOpen && (
              <m.nav
                id="mobile-nav"
                aria-label="Primary"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="glass-chrome absolute inset-x-3 top-full mt-2 grid grid-cols-2 gap-1 rounded-xl bg-background/90 p-3 sm:inset-x-0 md:hidden"
              >
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      goTo(item.href);
                    }}
                    className="rounded-md px-3 py-2.5 text-left text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
                  >
                    {item.label}
                  </button>
                ))}
              </m.nav>
            )}
          </AnimatePresence>
        </m.header>
      )}
    </AnimatePresence>
  );
}
