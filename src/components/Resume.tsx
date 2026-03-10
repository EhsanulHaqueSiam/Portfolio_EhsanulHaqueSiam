import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { m, AnimatePresence } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Typographic sub-components                                         */
/* ------------------------------------------------------------------ */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-[11px] font-display font-bold uppercase tracking-[0.22em] text-violet-400 whitespace-nowrap">
          {title}
        </h2>
        <div className="flex-1 h-px bg-white/[0.07]" />
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
        <span className="font-semibold text-white text-[13px] leading-tight">{role}</span>
        <span className="text-gray-500 text-[10.5px] shrink-0 font-mono tracking-wide">{period}</span>
      </div>
      <div className="flex justify-between items-baseline gap-3 mt-px">
        <span className="text-gray-400 italic text-[12px]">{company}</span>
        <span className="text-gray-600 italic text-[10.5px] shrink-0">{location}</span>
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
          <span className="font-semibold text-white">{name}</span>
          <span className="text-white/10 mx-1.5">|</span>
          <span className="text-gray-500 italic text-[11px]">{tech}</span>
        </span>
        {extra && <span className="text-amber-500/60 text-[10.5px] shrink-0 font-mono">{extra}</span>}
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
      <span className="font-semibold text-white">{label}: </span>
      <span className="text-gray-400">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Resume overlay                                                     */
/* ------------------------------------------------------------------ */

export function Resume() {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  /* ── hash sync ── */
  useEffect(() => {
    const sync = () => setIsOpen(window.location.hash === '#resume');
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
      window.dispatchEvent(new Event('lenis:start'));
    };
  }, [isOpen]);

  /* ── CRITICAL: block wheel/touch propagation to Lenis ── */
  useEffect(() => {
    const el = overlayRef.current;
    if (!isOpen || !el) return;
    const stop = (e: Event) => e.stopPropagation();
    // passive: true — we don't call preventDefault, just stop bubbling
    el.addEventListener('wheel', stop, { passive: true });
    el.addEventListener('touchmove', stop, { passive: true });
    return () => {
      el.removeEventListener('wheel', stop);
      el.removeEventListener('touchmove', stop);
    };
  }, [isOpen]);

  const close = useCallback(() => { window.location.hash = ''; }, []);

  /* ── ESC key ── */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          ref={overlayRef}
          className="fixed inset-0 z-[100] flex flex-col bg-[#08080d]"
          style={{ touchAction: 'pan-y' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* ═══ TOP BAR ═══ */}
          <div className="shrink-0 flex items-center justify-between px-3 sm:px-5 h-12 sm:h-14 border-b border-white/[0.06]">
            <button
              onClick={close}
              className="flex items-center gap-1.5 -ml-1 px-2 py-2 text-gray-400 hover:text-white active:text-white rounded-lg transition-colors min-h-[48px] min-w-[48px]"
              aria-label="Close resume"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-[13px] font-medium">Back</span>
            </button>

            {/* Desktop: show actions in top bar too */}
            <div className="hidden sm:flex items-center gap-2">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 text-[13px] text-gray-500 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors min-h-[44px]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View PDF
              </a>
              <a
                href="/resume.pdf"
                download="Ehsanul_Haque_Siam_Resume.pdf"
                className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors min-h-[44px]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </a>
            </div>

            {/* ESC hint — desktop only */}
            <kbd className="hidden lg:inline text-[10px] text-gray-600 border border-white/[0.06] rounded px-1.5 py-0.5 font-mono">
              ESC
            </kbd>
          </div>

          {/* ═══ SCROLLABLE RESUME CONTENT ═══ */}
          <div
            className="flex-1 overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="max-w-[760px] mx-auto px-4 sm:px-6 pt-5 sm:pt-7 pb-6 sm:pb-10">

              {/* ── Header ── */}
              <div className="text-center mb-6">
                <h1 className="text-[1.35rem] sm:text-[1.7rem] md:text-[2rem] font-display font-bold text-white tracking-[0.04em] uppercase leading-none mb-2">
                  Ehsanul Haque Siam
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-x-1.5 sm:gap-x-2.5 gap-y-0.5 text-[11px] sm:text-[12px] text-gray-500 leading-relaxed">
                  <a href="mailto:ehsanul.siamdev@gmail.com" className="hover:text-violet-400 active:text-violet-400 transition-colors underline decoration-white/[0.08] underline-offset-2">
                    ehsanul.siamdev@gmail.com
                  </a>
                  <span className="text-white/[0.08]">/</span>
                  <a href="https://linkedin.com/in/EhsanulHaqueSiam" target="_blank" rel="noopener noreferrer" className="hover:text-violet-400 active:text-violet-400 transition-colors underline decoration-white/[0.08] underline-offset-2">
                    LinkedIn
                  </a>
                  <span className="text-white/[0.08]">/</span>
                  <a href="https://github.com/EhsanulHaqueSiam" target="_blank" rel="noopener noreferrer" className="hover:text-violet-400 active:text-violet-400 transition-colors underline decoration-white/[0.08] underline-offset-2">
                    GitHub
                  </a>
                  <span className="text-white/[0.08]">/</span>
                  <a href="https://ehsanulhaquesiam.netlify.app" target="_blank" rel="noopener noreferrer" className="hover:text-violet-400 active:text-violet-400 transition-colors underline decoration-white/[0.08] underline-offset-2">
                    Portfolio
                  </a>
                </div>
              </div>

              {/* ── Experience ── */}
              <Section title="Experience">
                <Entry
                  role="AI & Data Engineer"
                  company="BDTracks"
                  period="Aug 2025 — Present"
                  location="Dhaka, Bangladesh"
                  bullets={[
                    'Developed 15+ web scrapers powering Bangladesh\'s commodity and accident tracking platform',
                    'Fine-tuned Gemini 2.5 Flash/Pro via Vertex AI for automated data classification across daily national feeds',
                  ]}
                />
                <Entry
                  role="Solo Developer"
                  company="BetaScript LLC (US-based)"
                  period="Jan 2026 — Present"
                  location="Remote"
                  bullets={[
                    'Shipped 4 production React websites driving 1.5x revenue growth, serving 50,000+ users across 3 industries',
                    'Owned full lifecycle with React 19, TanStack Start, and TailwindCSS from design to Netlify deployment',
                  ]}
                />
                <Entry
                  role="AI Engineering Intern"
                  company="Unies"
                  period="Feb 2026 — May 2026"
                  location="Remote"
                  bullets={[
                    'Developed RAG pipelines with Pinecone, ChromaDB, LangChain, and LlamaIndex for academic retrieval',
                    'Implemented LLM evaluation pipelines and FastAPI backends for curriculum-aligned tutoring systems',
                  ]}
                />
                <Entry
                  role="Team Lead — Game Development"
                  company="AIUB Computer Graphics Course"
                  period="Oct 2024 — Dec 2024"
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
                  <span className="font-semibold text-white text-[13px]">
                    American International University-Bangladesh (AIUB)
                  </span>
                  <span className="text-gray-600 text-[10.5px] shrink-0">Dhaka, Bangladesh</span>
                </div>
                <div className="flex justify-between items-baseline gap-3 mt-px">
                  <span className="text-gray-400 italic text-[12px]">
                    Bachelor of Science in Computer Science and Engineering
                  </span>
                  <span className="text-gray-600 italic text-[10.5px] shrink-0 font-mono tracking-wide">
                    2022 — 2026
                  </span>
                </div>
                <ul className="resume-bullets mt-1.5">
                  <li>3x Dean's List Award for academic excellence (CGPA 3.95, 3.89, 3.75+)</li>
                  <li>1st Runner-Up at AIUB CS Fest 2024 App Showcase competing against 20+ teams</li>
                </ul>
              </Section>

              {/* ── Publications ── */}
              <Section title="Publications">
                <div className="space-y-1.5 text-[12px] leading-relaxed">
                  <p>
                    <span className="text-white font-medium">"Decoding Research Trends: A Clustering Based Topic Modeling Framework"</span>
                    <span className="text-gray-600"> — IEEE QPAIN 2026 (Accepted, IEEE Xplore/Scopus)</span>
                  </p>
                  <p>
                    <span className="text-white font-medium">"Beyond NER: Medical BERTs for Multi-Label ADR Classification"</span>
                    <span className="text-gray-600"> — Taylor &amp; Francis, IDAA 2025</span>
                  </p>
                  <p>
                    <span className="text-white font-medium">"Unfolding Emerging Issues in Changing Climatic Scenario"</span>
                    <span className="text-gray-600"> — 2nd South Asian Climate Conference, 2024</span>
                  </p>
                </div>
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

          {/* ═══ STICKY BOTTOM ACTION BAR ═══ */}
          {/* Always visible — the primary way to download/view on all devices */}
          <div
            className="shrink-0 border-t border-white/[0.06] bg-[#08080d] px-3 sm:px-5"
            style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
          >
            <div className="max-w-[760px] mx-auto flex gap-2.5 pt-3">
              <a
                href="/resume.pdf"
                download="Ehsanul_Haque_Siam_Resume.pdf"
                className="flex-1 flex items-center justify-center gap-2.5 py-3.5 text-[14px] font-semibold text-white bg-violet-600 hover:bg-violet-500 active:bg-violet-700 rounded-xl transition-colors min-h-[52px]"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3.5 text-[14px] font-medium text-gray-300 bg-white/[0.05] hover:bg-white/[0.08] active:bg-white/[0.12] border border-white/[0.08] rounded-xl transition-colors min-h-[52px]"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View PDF
              </a>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
