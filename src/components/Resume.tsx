import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import { DownloadIcon, ExternalLinkIcon } from './ui/Icons';
import { profile, experience, cvProjects, education, publications, skills } from '../data/content';
import type { Experience, SkillsData } from '../data/types';

/* ------------------------------------------------------------------ */
/*  Typographic sub-components                                         */
/* ------------------------------------------------------------------ */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="resume-section-title text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-[#171412] whitespace-nowrap">
          {title}
        </h2>
        <div className="flex-1 h-px bg-black/15" aria-hidden="true" />
      </div>
      {children}
    </div>
  );
}

/** One role from experience.json; `date` is "Mon YYYY–Mon YYYY", spaced out for print. */
function Entry({ role, company, date, location, highlights, desc }: Experience) {
  return (
    <div className="mb-3 last:mb-0 break-inside-avoid">
      <div className="flex justify-between items-baseline gap-3">
        <span className="font-semibold text-[#111008] text-[13px] leading-tight">{role}</span>
        <span className="text-[#79705f] text-[10.5px] shrink-0 font-mono tracking-wide">{date.replace('–', ' – ')}</span>
      </div>
      <div className="flex justify-between items-baseline gap-3 mt-px">
        <span className="text-[#5c5346] italic text-[12px]">{company}</span>
        <span className="text-[#5c5346] italic text-[10.5px] shrink-0">{location}</span>
      </div>
      <ul className="resume-bullets mt-1.5">
        {(highlights ?? [desc]).map((b) => <li key={b}>{b}</li>)}
      </ul>
    </div>
  );
}

function Project({ name, tech, badge, highlights }: (typeof cvProjects)[number]) {
  return (
    <div className="mb-2.5 last:mb-0 break-inside-avoid">
      <div className="flex justify-between items-baseline gap-3">
        <span className="text-[13px] leading-tight">
          <span className="font-semibold text-[#111008]">{name}</span>
          <span className="text-[#c2b9a6] mx-1.5">|</span>
          <span className="text-[#5c5346] italic text-[11px]">{tech.join(', ')}</span>
        </span>
        {badge && <span className="text-[#6f5cf2] text-[10.5px] shrink-0 font-mono">{badge}</span>}
      </div>
      <ul className="resume-bullets mt-1">
        {highlights.map((b) => <li key={b}>{b}</li>)}
      </ul>
    </div>
  );
}

function SkillRow({ label, skills }: SkillsData['cv'][number]) {
  return (
    <div className="leading-snug">
      <span className="font-semibold text-[#111008]">{label}: </span>
      <span className="text-[#5c5346]">{skills.join(', ')}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Resume overlay                                                     */
/* ------------------------------------------------------------------ */

/**
 * URL hash -> overlay state. `#resume` opens the overlay; `#resume-print` opens it with no fade and
 * the print stylesheet engaged, so `chromium --headless=new --print-to-pdf <site>/#resume-print`
 * renders the same PDF as the Print button.
 */
type View = 'closed' | 'screen' | 'print';
const viewFor = (hash: string): View =>
  hash === '#resume-print' ? 'print' : hash === '#resume' ? 'screen' : 'closed';

export function Resume() {
  const [view, setView] = useState<View>('closed');
  const isOpen = view !== 'closed';
  const printing = view === 'print';
  const [instantClose, setInstantClose] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  /* ── hash sync ── */
  useEffect(() => {
    const sync = () => {
      const next = viewFor(window.location.hash);
      if (next !== 'closed') setInstantClose(false);
      setView(next);
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  /* ── lock body + <html> (the real scroller) + stop Lenis; the print view also scopes the print rules ── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (printing) document.documentElement.classList.add('resume-printing');
      window.dispatchEvent(new Event('lenis:stop'));
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.dispatchEvent(new Event('lenis:start'));
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.documentElement.classList.remove('resume-printing');
      window.dispatchEvent(new Event('lenis:start'));
    };
  }, [isOpen, printing]);

  /* ── CRITICAL: block wheel/touch propagation to Lenis ── */
  useEffect(() => {
    const el = overlayRef.current;
    if (!isOpen || !el) return;
    const stop = (e: Event) => e.stopPropagation();
    // passive: true – we don't call preventDefault, just stop bubbling
    el.addEventListener('wheel', stop, { passive: true });
    el.addEventListener('touchmove', stop, { passive: true });
    return () => {
      el.removeEventListener('wheel', stop);
      el.removeEventListener('touchmove', stop);
    };
  }, [isOpen]);

  const close = useCallback((instant = false) => {
    setInstantClose(instant);
    window.location.hash = '';
  }, []);

  /* ── ESC key ── */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(true); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  /* ── dialog focus management: save/restore focus + trap Tab ── */
  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    backButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const el = overlayRef.current;
      if (!el) return;
      const focusables = el.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;
      if (e.shiftKey) {
        if (active === first || !el.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !el.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    };
  }, [isOpen]);

  /* ── print flow: html.resume-printing scopes the @media print rules ── */
  const handlePrint = useCallback(() => {
    const root = document.documentElement;
    root.classList.add('resume-printing');
    const done = () => root.classList.remove('resume-printing');
    window.addEventListener('afterprint', done, { once: true });
    window.print();
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Résumé"
          className="fixed inset-0 z-[100] flex flex-col bg-background/85 backdrop-blur-xl"
          style={{ touchAction: 'pan-y' }}
          initial={printing ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion || instantClose ? 0 : 0.2 }}
        >
          {/* ═══ TOP BAR ═══ */}
          <div className="glass-chrome shrink-0 flex items-center justify-between gap-2 px-3 sm:px-5 h-12 sm:h-14 !rounded-none border-x-0 border-t-0">
            <button
              ref={backButtonRef}
              type="button"
              onClick={() => close(false)}
              className="press-feedback flex items-center gap-2 -ml-1 px-2 py-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground active:text-foreground min-h-[48px] min-w-[48px]"
              aria-label="Close resume"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>

            {/* Desktop: show actions in top bar too */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="btn-glass gap-2 px-4 py-2 min-h-[44px]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6v-7z" />
                </svg>
                Print
              </button>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass gap-2 px-4 py-2 min-h-[44px]"
              >
                <ExternalLinkIcon className="w-4 h-4" />
                View PDF
              </a>
              <a
                href="/resume.pdf"
                download="Ehsanul_Haque_Siam_Resume.pdf"
                className="btn-primary gap-2 px-5 py-2 min-h-[44px] font-semibold"
              >
                <DownloadIcon className="w-4 h-4" />
                Download
              </a>
            </div>

            {/* ESC hint – desktop only */}
            <kbd className="hidden lg:inline font-mono text-[10px] tracking-[0.14em] text-muted-foreground border rule rounded-md px-1.5 py-0.5">
              ESC
            </kbd>
          </div>

          {/* ═══ SCROLLABLE RESUME CONTENT ═══ */}
          <div
            className="flex-1 overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="px-3 sm:px-6 py-4 sm:py-8">
              {/* The white sheet – print contract root (.resume-paper) */}
              <div className="resume-paper mx-auto w-full max-w-[760px] bg-white text-ink-900 shadow-2xl px-4 sm:px-8 pt-6 sm:pt-8 pb-7 sm:pb-10">

                {/* ── Header ── */}
                <div className="resume-header-border text-center mb-6 pb-5 border-b rule">
                  <h2 className="resume-name text-[1.35rem] sm:text-[1.7rem] md:text-[2rem] font-sans font-semibold text-ink-950 tracking-[0.04em] uppercase leading-none mb-2">
                    {profile.name}
                  </h2>
                  <div className="resume-contact flex flex-wrap items-center justify-center gap-x-1.5 sm:gap-x-2.5 gap-y-0.5 text-[11px] sm:text-[12px] text-ink-600 leading-relaxed">
                    <a href={`mailto:${profile.email}`} className="press-feedback text-ink-700 hover:text-vermilion-600 active:text-vermilion-600 underline decoration-ink-900/20 underline-offset-2">
                      {profile.email}
                    </a>
                    <span className="text-ink-300">/</span>
                    <a href={profile.linkedin} target="_blank" rel="me noopener noreferrer" className="press-feedback text-ink-700 hover:text-vermilion-600 active:text-vermilion-600 underline decoration-ink-900/20 underline-offset-2">
                      LinkedIn
                    </a>
                    <span className="text-ink-300">/</span>
                    <a href={profile.github} target="_blank" rel="me noopener noreferrer" className="press-feedback text-ink-700 hover:text-vermilion-600 active:text-vermilion-600 underline decoration-ink-900/20 underline-offset-2">
                      GitHub
                    </a>
                    <span className="text-ink-300">/</span>
                    <a href="https://ehsanulhaquesiam.netlify.app" target="_blank" rel="noopener noreferrer" className="press-feedback text-ink-700 hover:text-vermilion-600 active:text-vermilion-600 underline decoration-ink-900/20 underline-offset-2">
                      Portfolio
                    </a>
                  </div>
                </div>

                {/* ── Experience ── */}
                <Section title="Experience">
                  {experience.map((role) => <Entry key={role.company} {...role} />)}
                </Section>

                {/* ── Projects ── */}
                <Section title="Projects">
                  {cvProjects.map((project) => <Project key={project.name} {...project} />)}
                </Section>

                {/* ── Education ── */}
                <Section title="Education">
                  {education.map(({ institution, degree, location, start, end, details }) => (
                    <div key={institution} className="mb-3 last:mb-0 break-inside-avoid">
                      <div className="flex justify-between items-baseline gap-3">
                        <span className="font-semibold text-ink-950 text-[13px]">{institution}</span>
                        <span className="text-ink-500 text-[10.5px] shrink-0">{location}</span>
                      </div>
                      <div className="flex justify-between items-baseline gap-3 mt-px">
                        <span className="text-ink-600 italic text-[12px]">{degree}</span>
                        <span className="text-ink-600 italic text-[10.5px] shrink-0 font-mono tracking-wide">
                          {start} – {end}
                        </span>
                      </div>
                      <ul className="resume-bullets mt-1.5">
                        {details.map((d) => <li key={d}>{d}</li>)}
                      </ul>
                    </div>
                  ))}
                </Section>

                {/* ── Publications ── */}
                {/* publications.json `date` is "<when> | <status note>"; the CV prints the note */}
                <Section title="Publications">
                  <ul className="resume-pub-list list-none pl-0 space-y-1.5 text-[12px] leading-relaxed">
                    {publications.map(({ title, conference, date }) => {
                      const [, note] = date.split(' | ');
                      return (
                        <li key={title}>
                          <span className="text-ink-950 font-medium">"{title}"</span>
                          <span className="text-ink-600"> – {note ? `${conference}, ${note}` : conference}</span>
                        </li>
                      );
                    })}
                  </ul>
                </Section>

                {/* ── Technical Skills ── */}
                <Section title="Technical Skills">
                  <div className="space-y-0.5 text-[12px]">
                    {skills.cv.map((row) => <SkillRow key={row.label} {...row} />)}
                  </div>
                </Section>

              </div>
            </div>
          </div>

          {/* ═══ STICKY BOTTOM ACTION BAR ═══ */}
          {/* Always visible – the primary way to download/view on all devices */}
          <div
            className="shrink-0 border-t rule-inverse bg-ink-950 px-3 sm:px-5"
            style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
          >
            <div className="max-w-[760px] mx-auto flex gap-2.5 pt-3">
              <a
                href="/resume.pdf"
                download="Ehsanul_Haque_Siam_Resume.pdf"
                className="press-feedback flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] bg-paper-50 text-ink-900 hover:bg-vermilion hover:text-paper-50 active:bg-vermilion-600 active:text-paper-50 min-h-[52px]"
              >
                <DownloadIcon className="w-[18px] h-[18px]" />
                Download PDF
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="press-feedback flex items-center justify-center gap-2 px-5 py-3.5 font-mono text-xs uppercase tracking-[0.16em] text-paper-100 border rule-inverse hover:border-paper-100 min-h-[52px]"
              >
                <ExternalLinkIcon className="w-[18px] h-[18px]" />
                View PDF
              </a>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
