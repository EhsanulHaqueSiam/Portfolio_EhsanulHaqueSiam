import { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { navItems, profile } from '../data/content';
import { ArrowUpRightIcon } from './ui/Icons';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();
  const isHiddenRef = useRef(false);
  const isScrolledRef = useRef(false);
  const navRef = useRef<HTMLElement>(null);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const shouldHide = latest > previous && latest > 150;
    const shouldShowScrolled = latest > 50;

    if (shouldHide !== isHiddenRef.current) {
      isHiddenRef.current = shouldHide;
      setIsHidden(shouldHide);
    }
    if (shouldShowScrolled !== isScrolledRef.current) {
      isScrolledRef.current = shouldShowScrolled;
      setIsScrolled(shouldShowScrolled);
    }
  });

  // Lock body scroll when the index (mobile menu) is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // Escape closes the index; Tab is trapped inside the nav while it's open
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const nav = navRef.current;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !nav) return;
      const focusables = nav.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMobileMenuOpen]);

  // Active-section highlighting via IntersectionObserver
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setActiveSection(window.location.hash.replace('#', ''));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    navItems.forEach(({ href }) => {
      const section = document.querySelector(href);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <m.nav
      ref={navRef}
      aria-label="Primary"
      onFocus={() => {
        if (isHiddenRef.current) {
          isHiddenRef.current = false;
          setIsHidden(false);
        }
      }}
      initial={{ transform: 'translateY(-100px)' }}
      animate={{
        transform: isHidden && !isMobileMenuOpen ? 'translateY(-100px)' : 'translateY(0px)',
      }}
      transition={{ duration: 0.4, ease: EASE }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div
        className={`mx-auto transition-all duration-500 ease-out-expo ${
          isScrolled && !isMobileMenuOpen
            ? 'glass-chrome mt-3 max-w-[1200px] rounded-full px-5 sm:px-7 mx-4 min-[1248px]:mx-auto'
            : 'max-w-[1400px] bg-transparent px-5 sm:px-8 lg:px-12'
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Wordmark */}
          <a
            href="#"
            aria-label="Go to top"
            className="press-feedback inline-flex min-h-[44px] shrink-0 items-center font-mono text-xs uppercase tracking-[0.24em] text-ink-900 hover:text-vermilion-400"
          >
            <span className="hidden md:inline">Ehsanul&nbsp;Haque&nbsp;Siam</span>
            <span className="md:hidden">E.H.S.</span>
          </a>

          {/* Desktop index */}
          <ul className="hidden xl:flex items-center">
            {navItems.map((item, i) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <m.li
                  key={item.href}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.04, ease: EASE }}
                >
                  <a
                    href={item.href}
                    aria-current={isActive ? 'location' : undefined}
                    className={`group press-feedback inline-flex min-h-[44px] items-center gap-1.5 px-2 2xl:px-3 font-mono text-[11px] uppercase tracking-[0.14em] ${
                      isActive ? 'text-vermilion-400' : 'text-ink-600 hover:text-ink-900'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={isActive ? 'text-vermilion-400' : 'text-ink-400'}
                    >
                      {item.no}
                    </span>
                    <span className="link-ink group-hover:[background-size:100%_1px]">
                      {item.label}
                    </span>
                  </a>
                </m.li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Command palette trigger */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
              className="press-feedback hidden md:inline-flex min-h-[44px] items-center gap-2.5 rounded-full border rule bg-white/[0.04] px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-600 hover:text-ink-900 hover:border-vermilion-500/40"
              aria-label="Open command palette"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              Search
              <kbd className="rounded-md border rule px-1.5 py-0.5 text-[10px] normal-case tracking-normal text-ink-500">
                Ctrl K
              </kbd>
            </button>

            {/* [ HIRE ME ] */}
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-primary min-h-[44px] px-4 sm:px-6 text-[11px]"
            >
              <span aria-hidden="true">[&nbsp;</span>
              Hire&nbsp;me
              <span aria-hidden="true">&nbsp;]</span>
            </a>

            {/* Index toggle (mobile / tablet) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="press-feedback xl:hidden flex h-11 w-11 items-center justify-center rounded-full border rule text-ink-900 hover:text-vermilion-400 hover:border-vermilion-500/40"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <m.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  variants={{
                    closed: { d: 'M4 8h16M4 16h16' },
                    open: { d: 'M6 18L18 6M6 6l12 12' },
                  }}
                  initial="closed"
                  animate={isMobileMenuOpen ? 'open' : 'closed'}
                  transition={{ duration: 0.3, ease: EASE }}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Full-screen paper index (mobile menu) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <m.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="xl:hidden absolute left-0 right-0 top-0 -z-10 h-screen bg-paper-100/90 backdrop-blur-2xl"
          >
            <div className="mx-auto flex h-full max-w-[1400px] flex-col overflow-y-auto px-5 pb-8 pt-24 sm:px-8 lg:px-12">
              <p className="folio mb-4" aria-hidden="true">
                Index · {profile.name}
              </p>

              <ul className="border-t rule">
                {navItems.map((item, i) => {
                  const isActive = activeSection === item.href.slice(1);
                  return (
                    <m.li
                      key={item.href}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.08 + i * 0.06, ease: EASE }}
                      className="border-b rule"
                    >
                      <a
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-current={isActive ? 'location' : undefined}
                        className="group press-feedback flex min-h-[64px] items-center gap-5 py-3"
                      >
                        <span
                          aria-hidden="true"
                          className="w-7 shrink-0 font-mono text-xs tracking-[0.14em] text-vermilion"
                        >
                          {item.no}
                        </span>
                        <span
                          className={`font-display text-3xl font-light leading-none min-[420px]:text-4xl sm:text-5xl ${
                            isActive ? 'italic text-vermilion' : 'text-ink-900'
                          }`}
                        >
                          {item.label}
                        </span>
                        <ArrowUpRightIcon
                          className="ml-auto h-5 w-5 shrink-0 text-ink-400 transition-colors duration-300 group-hover:text-vermilion"
                        />
                      </a>
                    </m.li>
                  );
                })}
              </ul>

              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
                className="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t rule pt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-500"
              >
                <a
                  href={`mailto:${profile.email}`}
                  className="link-ink inline-flex min-h-[44px] items-center normal-case tracking-[0.06em] text-ink-700"
                >
                  {profile.email}
                </a>
                <span className="inline-flex min-h-[44px] items-center">{profile.location}</span>
              </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.nav>
  );
}
