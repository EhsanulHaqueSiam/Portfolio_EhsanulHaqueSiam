import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import { DownloadIcon, ExternalLinkIcon } from './ui/Icons';

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

function Entry({
  role, company, period, location, bullets, isLast,
}: {
  role: string; company: string; period: string; location: string;
  bullets: string[]; isLast?: boolean;
}) {
  return (
    <div className={isLast ? '' : 'mb-3'}>
      <div className="flex justify-between items-baseline gap-3">
        <span className="font-semibold text-[#111008] text-[13px] leading-tight">{role}</span>
        <span className="text-[#79705f] text-[10.5px] shrink-0 font-mono tracking-wide">{period}</span>
      </div>
      <div className="flex justify-between items-baseline gap-3 mt-px">
        <span className="text-[#5c5346] italic text-[12px]">{company}</span>
        <span className="text-[#5c5346] italic text-[10.5px] shrink-0">{location}</span>
      </div>
      <ul className="resume-bullets mt-1.5">
        {bullets.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
    </div>
  );
}

function Project({
  name, tech, extra, bullets, isLast,
}: {
  name: string; tech: string; extra?: string;
  bullets: string[]; isLast?: boolean;
}) {
  return (
    <div className={isLast ? '' : 'mb-2.5'}>
      <div className="flex justify-between items-baseline gap-3">
        <span className="text-[13px] leading-tight">
          <span className="font-semibold text-[#111008]">{name}</span>
          <span className="text-[#c2b9a6] mx-1.5">|</span>
          <span className="text-[#5c5346] italic text-[11px]">{tech}</span>
        </span>
        {extra && <span className="text-[#6f5cf2] text-[10.5px] shrink-0 font-mono">{extra}</span>}
      </div>
      <ul className="resume-bullets mt-1">
        {bullets.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
    </div>
  );
}

function SkillRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="leading-snug">
      <span className="font-semibold text-[#111008]">{label}: </span>
      <span className="text-[#5c5346]">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Resume overlay                                                     */
/* ------------------------------------------------------------------ */

export function Resume() {
  const [isOpen, setIsOpen] = useState(false);
  const [instantClose, setInstantClose] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  /* ── hash sync ── */
  useEffect(() => {
    const sync = () => {
      const nextIsOpen = window.location.hash === '#resume';
      if (nextIsOpen) setInstantClose(false);
      setIsOpen(nextIsOpen);
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  /* ── lock body + stop Lenis ── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.dispatchEvent(new Event('lenis:stop'));
    } else {
      document.body.style.overflow = '';
      window.dispatchEvent(new Event('lenis:start'));
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.classList.remove('resume-printing');
      window.dispatchEvent(new Event('lenis:start'));
    };
  }, [isOpen]);

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion || instantClose ? 0 : 0.2 }}
        >
          {/* ═══ TOP BAR ═══ */}
          <div className="glass-chrome shrink-0 flex items-center justify-between gap-2 px-3 sm:px-5 h-12 sm:h-14 !rounded-none border-x-0 border-t-0">
            <button
              ref={backButtonRef}
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
                  <div role="heading" aria-level={2} className="resume-name text-[1.35rem] sm:text-[1.7rem] md:text-[2rem] font-sans font-semibold text-ink-950 tracking-[0.04em] uppercase leading-none mb-2">
                    Ehsanul Haque Siam
                  </div>
                  <div className="resume-contact flex flex-wrap items-center justify-center gap-x-1.5 sm:gap-x-2.5 gap-y-0.5 text-[11px] sm:text-[12px] text-ink-600 leading-relaxed">
                    <a href="mailto:ehsanul.siamdev@gmail.com" className="press-feedback text-ink-700 hover:text-vermilion-600 active:text-vermilion-600 underline decoration-ink-900/20 underline-offset-2">
                      ehsanul.siamdev@gmail.com
                    </a>
                    <span className="text-ink-300">/</span>
                    <a href="https://linkedin.com/in/EhsanulHaqueSiam" target="_blank" rel="me noopener noreferrer" className="press-feedback text-ink-700 hover:text-vermilion-600 active:text-vermilion-600 underline decoration-ink-900/20 underline-offset-2">
                      LinkedIn
                    </a>
                    <span className="text-ink-300">/</span>
                    <a href="https://github.com/EhsanulHaqueSiam" target="_blank" rel="me noopener noreferrer" className="press-feedback text-ink-700 hover:text-vermilion-600 active:text-vermilion-600 underline decoration-ink-900/20 underline-offset-2">
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
                  <Entry
                    role="Research Assistant"
                    company="Deepchain Labs"
                    period="Apr 2026 – Present"
                    location="Remote"
                    bullets={[
                      'Driving R&D initiatives in blockchain, cybersecurity, and quantum cryptography',
                      'Producing academic papers and technical documentation across multiple security domains',
                    ]}
                  />
                  <Entry
                    role="AI Engineering Intern"
                    company="Unies"
                    period="Feb 2026 – May 2026"
                    location="Remote"
                    bullets={[
                      'Developed RAG pipelines with Pinecone, ChromaDB, LangChain, and LlamaIndex for academic retrieval',
                      'Implemented LLM evaluation pipelines and FastAPI backends for curriculum-aligned tutoring systems',
                    ]}
                  />
                  <Entry
                    role="Solo Developer"
                    company="BetaScript LLC (US-based)"
                    period="Jan 2026 – Present"
                    location="Remote"
                    bullets={[
                      'Shipped 4 production React websites driving 1.5x revenue growth, serving 50,000+ users across 3 industries',
                      'Owned full lifecycle with React 19, TanStack Start, and TailwindCSS from design to Netlify deployment',
                    ]}
                  />
                  <Entry
                    role="AI & Data Engineer"
                    company="BDTracks"
                    period="Aug 2025 – Present"
                    location="Dhaka, Bangladesh"
                    bullets={[
                      'Developed 15+ web scrapers powering Bangladesh\'s commodity and accident tracking platform',
                      'Fine-tuned Gemini 2.5 Flash/Pro via Vertex AI for automated data classification across daily national feeds',
                    ]}
                  />
                  <Entry
                    role="Team Lead – Game Development"
                    company="AIUB Computer Graphics Course"
                    period="Oct 2024 – Dec 2024"
                    location="Dhaka, Bangladesh"
                    bullets={[
                      'Led 5-developer team shipping a 2D platformer with 3 levels and 4 GitHub forks in 3 months',
                      'Built custom OpenGL rendering engine with SFML audio and SQLite persistence in C++',
                    ]}
                    isLast
                  />
                </Section>

                {/* ── Projects ── */}
                <Section title="Projects">
                  <Project
                    name="TTT Autos"
                    tech="React, TypeScript, TanStack Start, Drizzle ORM, SQLite, Spline 3D"
                    bullets={[
                      'Shipped dealership platform with 3D Spline showcases, admin CRUD dashboard, and 7 indexed database tables',
                      'Designed polymorphic inventory supporting 3 vehicle types with multi-filter search across 12+ facets',
                    ]}
                  />
                  <Project
                    name="KaajKormo"
                    tech="React, TypeScript, Rust/Axum, PostgreSQL, Clerk Auth"
                    bullets={[
                      'Created job portal with swipe-to-apply UX and AI-powered CV parsing with skill-match scoring',
                      'Architected full-stack with React 19 frontend and Rust Axum backend serving PostgreSQL 17',
                    ]}
                  />
                  <Project
                    name="Student Management System"
                    tech="Java, MySQL, JDBC, Design Patterns"
                    extra="17 Stars"
                    bullets={[
                      'Reduced query time from 50ms to 7ms (7x faster) via 3NF normalization and connection pooling',
                      'Served 45+ active university users with centralized admin and student dashboards',
                    ]}
                  />
                  <Project
                    name="BD News Scraper & Analytics"
                    tech="Python, Scrapy, FastAPI, Docker, GitHub Actions"
                    bullets={[
                      'Automated daily scraping of 74+ news sources with 82 spiders and live Kaggle dataset',
                      'Built ML sentiment analysis with TF-IDF clustering and GitHub Actions CI/CD pipeline',
                    ]}
                    isLast
                  />
                </Section>

                {/* ── Education ── */}
                <Section title="Education">
                  <div className="flex justify-between items-baseline gap-3">
                    <span className="font-semibold text-ink-950 text-[13px]">
                      American International University-Bangladesh (AIUB)
                    </span>
                    <span className="text-ink-500 text-[10.5px] shrink-0">Dhaka, Bangladesh</span>
                  </div>
                  <div className="flex justify-between items-baseline gap-3 mt-px">
                    <span className="text-ink-600 italic text-[12px]">
                      Bachelor of Science in Computer Science and Engineering
                    </span>
                    <span className="text-ink-600 italic text-[10.5px] shrink-0 font-mono tracking-wide">
                      2022 – 2026
                    </span>
                  </div>
                  <ul className="resume-bullets mt-1.5">
                    <li>3x Dean's List Award for academic excellence (CGPA 3.95, 3.89, 3.75+)</li>
                    <li>1st Runner-Up at AIUB CS Fest 2024 App Showcase competing against 20+ teams</li>
                    <li>Certified Ethical Hacker (CEH) – Team Matrix; 29-module program covering OWASP Top 10, CTF &amp; bug bounty</li>
                  </ul>
                </Section>

                {/* ── Publications ── */}
                <Section title="Publications">
                  <ul className="resume-pub-list list-none pl-0 space-y-1.5 text-[12px] leading-relaxed">
                    <li>
                      <span className="text-ink-950 font-medium">"Decoding Research Trends: A Clustering Based Topic Modeling Framework"</span>
                      <span className="text-ink-600"> – IEEE QPAIN 2026 (Accepted, IEEE Xplore/Scopus)</span>
                    </li>
                    <li>
                      <span className="text-ink-950 font-medium">"Beyond NER: Medical BERTs for Multi-Label ADR Classification"</span>
                      <span className="text-ink-600"> – Taylor &amp; Francis, IDAA 2025</span>
                    </li>
                    <li>
                      <span className="text-ink-950 font-medium">"Unfolding Emerging Issues in Changing Climatic Scenario"</span>
                      <span className="text-ink-600"> – 2nd South Asian Climate Conference, 2024</span>
                    </li>
                  </ul>
                </Section>

                {/* ── Technical Skills ── */}
                <Section title="Technical Skills">
                  <div className="space-y-0.5 text-[12px]">
                    <SkillRow label="Languages" value="Java, Python, C++, JavaScript, TypeScript, Kotlin, C#, SQL" />
                    <SkillRow label="AI/ML" value="scikit-learn, TensorFlow, PyTorch, LLMs, BERT, NLP, RAG, LangChain, LlamaIndex, Computer Vision" />
                    <SkillRow label="Web & Mobile" value="React, TailwindCSS, FastAPI, TanStack Start/Router, REST APIs, Android SDK, Firebase" />
                    <SkillRow label="Databases" value="MySQL, PostgreSQL, SQLite, SQL Server, Drizzle ORM, Room Database" />
                    <SkillRow label="DevOps & Tools" value="Git, Docker, Linux, Vertex AI, GitHub Actions, Scrapy, Jupyter" />
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
