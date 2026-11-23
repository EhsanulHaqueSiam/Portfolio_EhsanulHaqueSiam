import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import { DownloadIcon, ExternalLinkIcon } from './ui/Icons';
import { Marked } from './ui/Marked';
// Charis SIL: an open Charter, so the PDF prints the same on any machine
import '@fontsource/charis-sil/400.css';
import '@fontsource/charis-sil/400-italic.css';
import '@fontsource/charis-sil/700.css';
import { profile, experience, cvProjects, education, publications, skills } from '../data/content';
import type { Experience, Publication } from '../data/types';
import { repos } from '../data/opensource';

/* ------------------------------------------------------------------ */
/*  Two documents from the same hq facts, in a Jake's Resume layout:   */
/*  one column, Charis serif, bold titles, and one blue accent only on */
/*  the AI-signal numbers (hq `**x**`, .resume-paper strong):          */
/*  the one-page résumé for jobs, and the 2-page CV for academia.      */
/* ------------------------------------------------------------------ */

/** "https://www.github.com/x/" -> "github.com/x": links print as readable text. */
const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
/** 70257 -> "70k stars", 2786 -> "2.8k stars" */
const kStars = (n: number) => `${n >= 10_000 ? Math.round(n / 1000) : (n / 1000).toFixed(1)}k stars`;
/** publications.json `date` is "<when> | <status note>". */
const pubParts = (date: string) => {
  const [when, note] = date.split(' | ');
  return { when, note };
};
/** Like the site's paper pages: a "presentation" or "talk" status is a talk, not a publication. */
const isTalk = (p: Publication) => /presentation|talk/i.test(p.date);
/** Research roles get their own CV section: a "Researcher" title (Arché), not engineering at a research company. */
const isResearch = (e: Experience) => /researcher/i.test(e.role);
const listed = experience.filter((e) => e.cv !== false);

/** Upstream repos with merged PRs only (the site also shows open ones), one line each; the accent marks repeat merges. */
const openSource = repos.flatMap(({ name, repo, stars, prs, cv }) => {
  const merged = prs.filter((p) => p.state === 'merged');
  if (!merged.length) return [];
  const count = `${merged.length} merged PR${merged.length > 1 ? 's' : ''}`;
  const coauthor = merged.some((p) => p.note === 'co-author') ? ', co-author' : '';
  return [{ repo, line: <><b>{name}</b> ({kStars(stars)}) · {merged.length > 1 ? <strong>{count}</strong> : count}{coauthor}: {cv}</> }];
});

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-2">
      {/* break-after-avoid: a section title never ends a printed page alone */}
      <h2 className="resume-section-title break-after-avoid mb-1.5 border-b border-black pb-0.5 text-[12px] font-bold uppercase tracking-[0.08em] text-black">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Bold left, plain right: the head line of every role, project and degree. */
function Row({ left, right }: { left: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-[12.5px] leading-snug text-black">
      <span className="min-w-0">{left}</span>
      {right && <span className="shrink-0 text-[12px]">{right}</span>}
    </div>
  );
}

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="resume-bullets mt-0.5">
      {items.map((b, i) => <li key={i}>{typeof b === 'string' ? <Marked text={b} /> : b}</li>)}
    </ul>
  );
}

/** Keeps a block's key numbers black: each document puts the blue only on its reader's signal. */
const Quiet = ({ children }: { children: ReactNode }) => <div className="resume-quiet">{children}</div>;

function Item({ children }: { children: ReactNode }) {
  return <div className="mb-1 last:mb-0 break-inside-avoid">{children}</div>;
}

const Link = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} className="underline decoration-black/30 underline-offset-2">{children}</a>
);

/** Name, positioning line and contact as plain text (parsers skip page headers and icons). */
function Header({ academic = false }: { academic?: boolean }) {
  const lines: [string, string][][] = [
    [
      [profile.email, `mailto:${profile.email}`],
      [bare(profile.linkedin), profile.linkedin],
      [bare(profile.github), profile.github],
      ['ehsanulhaquesiam.netlify.app', 'https://ehsanulhaquesiam.netlify.app'],
    ],
    // research identities get their own line so neither line wraps
    ...(academic ? [[[bare(profile.orcid), profile.orcid], ['Google Scholar', profile.scholar]] as [string, string][]] : []),
  ];
  const tagline = academic
    ? `Research interests: ${profile.researchInterests ?? ''} · ${profile.location}`
    : `${profile.cvHeadline ?? profile.title} · ${profile.location}`;
  return (
    <header className="resume-header-border mb-2 text-center">
      <h2 className="resume-name text-[1.6rem] sm:text-[1.9rem] font-bold uppercase tracking-[0.04em] leading-none text-black">
        {profile.name}
      </h2>
      <p className="mt-1 text-[14px] text-black">{tagline}</p>
      {lines.map((line) => (
        <p key={line[0][0]} className="resume-contact mt-0.5 flex flex-wrap justify-center gap-x-2 text-[11.5px] text-black">
          {line.map(([text, href], i) => (
            <span key={text}>
              {i > 0 && <span className="mr-2" aria-hidden="true">|</span>}
              <Link href={href}>{text}</Link>
            </span>
          ))}
        </p>
      ))}
      {academic && profile.publishesAs && (
        <p className="resume-contact mt-0.5 text-[11.5px] italic text-black">Publishes as {profile.publishesAs}</p>
      )}
    </header>
  );
}

/** One role: "**Role**, Company" left, "Location · dates" right, an earlier title under it, then up to `max` bullets. */
function Entry({ e, max }: { e: Experience; max?: number }) {
  return (
    <Item>
      <Row left={<><b className="text-[13px]">{e.role}</b>, {e.company}</>} right={[e.location, e.date.replace('–', ' – ')].filter(Boolean).join(' · ')} />
      {e.earlier && <Row left={<i>{e.earlier.role}</i>} right={<i>{e.earlier.date.replace('–', ' – ')}</i>} />}
      <Bullets items={(e.highlights ?? [e.desc]).slice(0, max)} />
    </Item>
  );
}

function Projects({ list, title = 'Projects', max }: { list: typeof cvProjects; title?: string; max?: number }) {
  return (
    <Section title={title}>
      {list.map(({ name, tech, links, badge, highlights }) => (
        <Item key={name}>
          <Row
            left={<><b>{name}</b> | <i>{tech.join(', ')}</i>{badge && ` | ${badge}`}</>}
            right={links.map((l, i) => <span key={l}>{i > 0 && ' · '}<Link href={l}>{bare(l)}</Link></span>)}
          />
          <Bullets items={highlights.slice(0, max)} />
        </Item>
      ))}
    </Section>
  );
}

function OpenSource() {
  return (
    <Section title="Open Source">
      <Bullets items={openSource.map((r) => r.line)} />
    </Section>
  );
}

function Skills() {
  return (
    <Section title="Technical Skills">
      <div className="space-y-px text-[12px] leading-snug text-black">
        {skills.cv.map(({ label, skills: list }) => (
          <div key={label}><b>{label}:</b> {list.join(', ')}</div>
        ))}
      </div>
    </Section>
  );
}

/** "B.Sc." keeps degree, school and dates on one row; parsers read it as a bachelor's. */
const Degree = ({ degree, institution, start, end }: (typeof education)[number]) => (
  <Row left={<><b>{degree.replace('Bachelor of Science', 'B.Sc.')}</b>, {institution}</>} right={`${start} – ${end}`} />
);
/** Education details; `accent` puts the CGPA value in the blue (the CV's signal, not the résumé's). */
const details = (ds: string[], accent = false) => {
  const line = ds.join(' · ');
  return <Marked text={accent ? line.replace(/(CGPA )([\d.]+ \/ [\d.]+)/, '$1**$2**') : line} />;
};
const Detail = ({ children }: { children: ReactNode }) => (
  <div className="resume-detail text-[12px] leading-snug text-black">{children}</div>
);

/**
 * The one-page résumé (2026 hiring norms, hq research/resume-format-2026.md): Experience, Skills,
 * Open Source, Projects, Education, Publications; talks are left off. Blue marks only production and
 * open-source AI signal, so research roles stay quiet here.
 */
function ResumeSheet() {
  return (
    <>
      <Header />
      <Section title="Experience">
        {listed.map((e) => (isResearch(e) ? <Quiet key={e.company}><Entry e={e} max={2} /></Quiet> : <Entry key={e.company} e={e} />))}
      </Section>
      <Skills />
      <OpenSource />
      <Projects list={cvProjects.filter((p) => p.resume)} max={1} />
      <Section title="Education">
        {education.map((ed) => (
          <Item key={ed.institution}>
            <Degree {...ed} />
            <Detail>{details(ed.details)}</Detail>
          </Item>
        ))}
      </Section>
      <Section title="Publications">
        <Bullets
          items={publications.filter((p) => !isTalk(p)).map(({ title, conference, date, doi }) => {
            const venue = conference.match(/\(([^)]+)\)$/)?.[1] ?? conference; // "(IDAA 2025)"
            // "Published (IEEE Xplore, …)" -> "IEEE Xplore"; "Book Chapter (Taylor & Francis)" -> "Taylor & Francis book chapter"
            const where = (pubParts(date).note ?? '').replace(/^Published \(([^,)]+).*$/, '$1').replace(/^Book Chapter \((.+)\)$/, '$1 book chapter');
            const t = <i>{title}</i>;
            return <>{doi ? <Link href={`https://doi.org/${doi}`}>{t}</Link> : t}. {venue}{where && `, ${where}`}</>;
          })}
        />
      </Section>
    </>
  );
}

/** Full citation: authors (his name bold), title, venue, date, status, DOI. */
function Citation({ p }: { p: Publication }) {
  const { when, note } = pubParts(p.date);
  return (
    <>
      {p.authors?.length ? (
        <>
          {p.authors.map((a, i) => (
            <span key={a}>{i > 0 && ', '}{a === profile.publishesAs ? <b>{a}</b> : a}</span>
          ))}
          .{' '}
        </>
      ) : null}
      <i>{p.title}</i>. {p.conference}, {when}{note ? `. ${note}` : ''}
      {p.doi && <>. DOI <Link href={`https://doi.org/${p.doi}`}>{p.doi}</Link></>}
      {p.method && <span className="block text-[11.5px] italic">{p.method}.</span>}
    </>
  );
}

/**
 * The 2-page academic CV for a professor's read: Education, papers, research roles, research projects,
 * then industry (two bullets per role), other projects, open source, skills and referees. Blue marks
 * only research signal (CGPA, research roles and projects).
 */
function CvSheet() {
  return (
    <>
      <Header academic />
      <Section title="Education">
        {education.map((ed) => (
          <Item key={ed.institution}>
            <Degree {...ed} />
            {/* with an Honors section, the CV's education line keeps only the CGPA */}
            <Detail>{details(ed.honors ? ed.details.filter((d) => /CGPA/.test(d)) : ed.details, true)}</Detail>
            {ed.coursework && <Detail><b>Coursework:</b> {ed.coursework.join(', ')}</Detail>}
          </Item>
        ))}
      </Section>
      <Section title="Publications">
        <Bullets items={publications.filter((p) => !isTalk(p)).map((p) => <Citation p={p} />)} />
      </Section>
      <Section title="Research Experience">
        {listed.filter(isResearch).map((e) => <Entry key={e.company} e={e} />)}
      </Section>
      <Projects title="Research Projects" list={cvProjects.filter((p) => p.research)} />
      <Quiet>
        <Section title="Industry Experience">
          {listed.filter((e) => !isResearch(e)).map((e) => <Entry key={e.company} e={e} max={2} />)}
        </Section>
        <Projects list={cvProjects.filter((p) => !p.research)} max={1} />
        <OpenSource />
      </Quiet>
      <Skills />
      {education.some((ed) => ed.honors) && (
        <Section title="Honors & Awards">
          <Bullets items={education.flatMap((ed) => ed.honors ?? [])} />
        </Section>
      )}
      {education.find((ed) => ed.languages) && (
        <Section title="Languages">
          <Detail>{education.find((ed) => ed.languages)?.languages}</Detail>
        </Section>
      )}
      {education.some((ed) => ed.referees) && (
        <Section title="References">
          <Bullets items={education.flatMap((ed) => ed.referees ?? [])} />
        </Section>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Resume overlay                                                     */
/* ------------------------------------------------------------------ */

/**
 * URL hash -> overlay state. `#resume` and `#cv` open the overlay on that document; `#resume-print`
 * and `#cv-print` open it with no fade and the print stylesheet engaged, so
 * `chromium --headless=new --print-to-pdf <site>/#cv-print` renders the same PDF as the Print button.
 */
type View = 'closed' | 'screen' | 'print';
type Doc = 'resume' | 'cv';
const parse = (hash: string): { doc: Doc; view: View } => {
  const m = /^#(resume|cv)(-print)?$/.exec(hash);
  return m ? { doc: m[1] as Doc, view: m[2] ? 'print' : 'screen' } : { doc: 'resume', view: 'closed' };
};
const DOCS: Record<Doc, { label: string; file: string }> = {
  resume: { label: 'Résumé', file: 'Ehsanul_Haque_Siam_Resume.pdf' },
  cv: { label: 'CV', file: 'Ehsanul_Haque_Siam_CV.pdf' },
};

export function Resume() {
  const [{ doc, view }, setState] = useState(() => parse(''));
  const pdf = `/${doc}.pdf`;
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
      const next = parse(window.location.hash);
      if (next.view !== 'closed') setInstantClose(false);
      // closing keeps the document so the fade-out does not swap sheets
      setState((cur) => (next.view === 'closed' ? { ...cur, view: 'closed' } : next));
    };
    sync();
    // Astro's client router takes over same-page "#resume" and "#cv" links and updates the URL with
    // pushState, which fires no hashchange; so re-read the hash right after any such click,
    // and on back/forward (popstate) too.
    const onClick = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest('a[href$="#resume"], a[href$="#cv"]')) requestAnimationFrame(sync);
    };
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    document.addEventListener('click', onClick, true);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
      document.removeEventListener('click', onClick, true);
    };
  }, []);

  /* ── lock body + <html> (the real scroller); the print view also scopes the print rules ── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (printing) document.documentElement.classList.add('resume-printing');
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.documentElement.classList.remove('resume-printing');
    };
  }, [isOpen, printing]);

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
          aria-label={DOCS[doc].label}
          className="fixed inset-0 z-[100] flex flex-col bg-background"
          style={{ touchAction: 'pan-y' }}
          initial={printing ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion || instantClose ? 0 : 0.2 }}
        >
          {/* ═══ TOP BAR ═══ */}
          <div className="shrink-0 flex items-center justify-between gap-2 px-3 sm:px-5 h-12 sm:h-14 border-b border-border bg-background">
            <button
              ref={backButtonRef}
              type="button"
              onClick={() => close(false)}
              className="press-feedback flex items-center gap-2 -ml-1 px-2 py-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground active:text-foreground min-h-[48px] min-w-[48px]"
              aria-label={`Close ${DOCS[doc].label}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>

            {/* One-page résumé for jobs, 2-3 page CV for academia */}
            <nav aria-label="Document" className="flex items-center gap-1 rounded-full border border-border p-0.5">
              {(Object.keys(DOCS) as Doc[]).map((d) => (
                <a
                  key={d}
                  href={`#${d}`}
                  aria-current={d === doc ? 'page' : undefined}
                  className={`press-feedback rounded-full px-3.5 py-1.5 min-h-[36px] inline-flex items-center text-sm font-medium ${d === doc ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {DOCS[d].label}
                </a>
              ))}
            </nav>

            {/* Desktop: show actions in top bar too */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="press-feedback inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2 min-h-[44px] text-sm font-medium text-foreground hover:bg-secondary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6v-7z" />
                </svg>
                Print
              </button>
              <a
                href={pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="press-feedback inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2 min-h-[44px] text-sm font-medium text-foreground hover:bg-secondary"
              >
                <ExternalLinkIcon className="w-4 h-4" />
                View PDF
              </a>
              <a
                href={pdf}
                download={DOCS[doc].file}
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

                {doc === 'cv' ? <CvSheet /> : <ResumeSheet />}
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
                href={pdf}
                download={DOCS[doc].file}
                className="press-feedback flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] bg-paper-50 text-ink-900 hover:bg-vermilion hover:text-paper-50 active:bg-vermilion-600 active:text-paper-50 min-h-[52px]"
              >
                <DownloadIcon className="w-[18px] h-[18px]" />
                Download PDF
              </a>
              <a
                href={pdf}
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
