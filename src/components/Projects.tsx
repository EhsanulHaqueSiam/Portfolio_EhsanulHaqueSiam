import { useCallback, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { featuredProjects, profile, getProjectImage } from '../data/content';
import type { Project } from '../data/types';
import { SectionHeader } from './ui/SectionHeader';
import { OptimizedImage } from './ui/OptimizedImage';
import { ArrowUpRightIcon } from './ui/Icons';
import { useMediaQuery } from '../hooks/useMediaQuery';

const EASE = [0.16, 1, 0.3, 1] as const;

/* The three works with the strongest case-study evidence open the spread as
   large editorial plates; everything else files into the ledger index below. */
const CASE_PLATE_NAMES = ['ScholarHub', 'Indian Claypit', 'TTT Autos'];

const casePlates = CASE_PLATE_NAMES.map((name) =>
  featuredProjects.find((p) => p.name === name)
).filter((p): p is Project => Boolean(p));

const indexProjects = featuredProjects.filter(
  (p) => !CASE_PLATE_NAMES.includes(p.name)
);

const indexNumber = (i: number) =>
  String(i + casePlates.length + 1).padStart(3, '0');

const hasLiveDemo = (view?: string): view is string =>
  typeof view === 'string' && view.trim() !== '' && view !== '#';

/* Floating preview plate dimensions (desktop cursor-follow) */
const PREVIEW_W = 320;
const PREVIEW_H = 200;

/* Print crop corners drawn with inverse hairlines (reg marks on ink) */
function RegMarksInverse() {
  return (
    <>
      <span aria-hidden="true" className="pointer-events-none absolute -left-px -top-px h-4 w-4 border-l border-t rule-inverse" />
      <span aria-hidden="true" className="pointer-events-none absolute -right-px -top-px h-4 w-4 border-r border-t rule-inverse" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-px -left-px h-4 w-4 border-b border-l rule-inverse" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-px -right-px h-4 w-4 border-b border-r rule-inverse" />
    </>
  );
}

function CasePlate({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;
  const liveHref = hasLiveDemo(project.links.view) ? project.links.view : undefined;
  const codeHref = project.links.code;
  const plateHref = liveHref ?? codeHref;
  const plateLabel = `View ${project.name} ${liveHref ? 'live demo' : 'source code on GitHub'}`;

  const chips: Array<{ label?: string; value: string }> =
    project.caseStudy?.results?.slice(0, 3) ??
    project.metrics.slice(0, 3).map((value) => ({ value }));

  const image = project.images[0];

  const plateInner = image && (
    <OptimizedImage
      src={getProjectImage(image)}
      alt={`${project.name} — project interface`}
      aspectRatio="16/10"
      sizes="(max-width: 1024px) 100vw, 58vw"
      className="h-full w-full"
    />
  );

  return (
    <article className="group grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
      {/* Image plate + FIG caption */}
      <m.div
        className={`lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div className="relative p-2 sm:p-3">
          <RegMarksInverse />
          {plateHref ? (
            <a
              href={plateHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={plateLabel}
              className="plate block"
            >
              {plateInner}
            </a>
          ) : (
            <div className="plate">{plateInner}</div>
          )}
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-4 px-2 sm:px-3">
          <span className="folio-inverse">
            FIG. 0{index + 1} — {project.name}
          </span>
          {project.tags[0] && (
            <span className="folio-inverse hidden sm:block text-right">
              {project.tags[0]}
            </span>
          )}
        </div>
      </m.div>

      {/* Titling, one-line brief, result chips, links */}
      <m.div
        className={`lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none block select-none font-display font-light leading-none text-outline-inverse text-[clamp(3.5rem,8vw,6.5rem)]"
        >
          00{index + 1}
        </span>
        <h3 className="mt-2 font-display font-light leading-[0.98] text-paper-100 text-4xl sm:text-5xl xl:text-6xl">
          {project.name}
        </h3>
        <p className="mt-4 max-w-prose text-base leading-relaxed text-ink-300 sm:mt-5 sm:text-lg">
          {project.desc}
        </p>

        <ul role="list" className="mt-6 flex flex-wrap gap-2 sm:mt-8">
          {chips.map((chip) => (
            <li
              key={`${chip.value}-${chip.label ?? ''}`}
              className="border rule-inverse px-3 py-2 font-mono text-xs uppercase tracking-[0.14em]"
            >
              <span className="font-semibold text-vermilion-400">{chip.value}</span>
              {chip.label && <span className="text-ink-300"> {chip.label}</span>}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-1 sm:mt-8">
          {liveHref && (
            <a
              href={liveHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.name} live demo`}
              className="link-ink press-feedback inline-flex min-h-[44px] items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-paper-100 transition-colors hover:text-vermilion-400"
            >
              Live
              <ArrowUpRightIcon className="h-3.5 w-3.5" />
            </a>
          )}
          {codeHref && (
            <a
              href={codeHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.name} source code on GitHub`}
              className="link-ink press-feedback inline-flex min-h-[44px] items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-paper-100 transition-colors hover:text-vermilion-400"
            >
              Code
              <ArrowUpRightIcon className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </m.div>
    </article>
  );
}

export function Projects() {
  /* Cursor-following preview: desktop fine-pointer + motion-safe only.
     `useMediaQuery` is false on the server, so nothing here affects SSR HTML —
     the false branch renders the complete ledger with static thumbnails. */
  const isFinePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const prefersReducedMotion = useReducedMotion();
  const previewEnabled = isFinePointer && !prefersReducedMotion;

  const ledgerRef = useRef<HTMLDivElement | null>(null);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const lastRowRef = useRef(0);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const springX = useSpring(px, { stiffness: 320, damping: 30, mass: 0.6 });
  const springY = useSpring(py, { stiffness: 320, damping: 30, mass: 0.6 });

  /* Position the plate near the pointer. The preview is absolutely positioned
     inside the ledger wrapper (the section sits in a `cv-auto` container whose
     layout containment would hijack `position: fixed`), so viewport coords are
     translated into wrapper-local space. */
  const placePreview = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>, jump = false) => {
      const wrap = ledgerRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const viewportX = Math.min(e.clientX + 32, window.innerWidth - PREVIEW_W - 24);
      const x = viewportX - rect.left;
      const y = Math.min(
        Math.max(e.clientY - rect.top - PREVIEW_H * 0.55, -32),
        rect.height - PREVIEW_H
      );
      if (jump) {
        px.jump(x);
        py.jump(y);
      } else {
        px.set(x);
        py.set(y);
      }
    },
    [px, py]
  );

  const showRow = useCallback((i: number) => {
    lastRowRef.current = i;
    setActiveRow(i);
  }, []);

  const shownIdx = activeRow ?? lastRowRef.current;
  const shownProject = indexProjects[shownIdx];
  const shownImage = shownProject?.images[0];

  return (
    <section
      id="projects"
      aria-label="Selected works and projects"
      className="relative bg-ink-900 text-paper-100 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeader
          number="05"
          name="SELECTED WORK"
          title={
            <>
              Selected <em>work</em>
            </>
          }
          annotation={`EXHIBITS 001—${String(featuredProjects.length).padStart(3, '0')}`}
          inverse
        />

        {/* ————— Zone 1 · Case plates ————— */}
        <div className="mb-8 flex items-baseline justify-between gap-4 border-t rule-inverse pt-3 sm:mb-12">
          <span className="folio-inverse">
            <span className="text-vermilion-400">05.1</span>
            <span aria-hidden="true"> — </span>CASE PLATES
          </span>
          <span className="folio-inverse text-right">
            {casePlates.length} SYSTEMS IN PRODUCTION
          </span>
        </div>

        <div className="space-y-20 sm:space-y-28 lg:space-y-32">
          {casePlates.map((project, i) => (
            <CasePlate key={project.name} project={project} index={i} />
          ))}
        </div>

        {/* ————— Zone 2 · The index ————— */}
        <div className="mt-24 sm:mt-32">
          <div className="flex items-baseline justify-between gap-4 border-t rule-inverse pt-3">
            <span className="folio-inverse">
              <span className="text-vermilion-400">05.2</span>
              <span aria-hidden="true"> — </span>THE INDEX
            </span>
            <span className="folio-inverse text-right">
              {indexProjects.length} FURTHER WORKS
            </span>
          </div>

          <div
            ref={ledgerRef}
            className="relative mt-6 sm:mt-8"
            onMouseEnter={previewEnabled ? (e) => placePreview(e, true) : undefined}
            onMouseMove={previewEnabled ? (e) => placePreview(e) : undefined}
            onMouseLeave={previewEnabled ? () => setActiveRow(null) : undefined}
          >
            <ul role="list">
              {indexProjects.map((project, i) => {
                const isDemo = hasLiveDemo(project.links.view);
                const href = isDemo ? project.links.view : project.links.code;
                const thumb = project.images[0];

                const rowInner = (
                  <>
                    <span className="w-9 shrink-0 font-mono text-[11px] tracking-[0.18em] text-ink-400 sm:w-12">
                      {indexNumber(i)}
                    </span>

                    {/* Static thumbnail plate — the touch / no-JS / reduced-motion
                        rendition; hidden once the cursor preview takes over. */}
                    <span
                      aria-hidden="true"
                      className={`${previewEnabled ? 'hidden' : 'block'} plate h-12 w-16 shrink-0 sm:h-14 sm:w-20`}
                    >
                      {thumb && (
                        <img
                          src={getProjectImage(thumb)}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          width={160}
                          height={120}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </span>

                    <span className="min-w-0 flex-1 md:flex-none">
                      <span className="block font-display font-light leading-tight text-paper-100 transition-colors duration-200 group-hover:text-vermilion-400 text-2xl sm:text-3xl lg:text-4xl">
                        {project.name}
                      </span>
                      <span className="mt-1 block truncate font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400 md:hidden">
                        {project.tags.slice(0, 3).join(' · ')}
                      </span>
                    </span>

                    <span className="leader leader-inverse hidden md:block" aria-hidden="true" />

                    <span className="hidden shrink-0 items-baseline gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-300 md:flex">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </span>

                    <ArrowUpRightIcon className="h-5 w-5 shrink-0 text-ink-300 transition-all duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-vermilion-400 sm:h-6 sm:w-6" />
                  </>
                );

                return (
                  <m.li
                    key={project.name}
                    className="border-b rule-inverse"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.6, ease: EASE, delay: Math.min(i * 0.04, 0.24) }}
                  >
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${project.name} ${isDemo ? 'live demo' : 'source code on GitHub'}`}
                        className="group flex min-h-[44px] items-center gap-4 py-5 sm:gap-6 sm:py-6"
                        onMouseEnter={previewEnabled ? () => showRow(i) : undefined}
                      >
                        {rowInner}
                      </a>
                    ) : (
                      <div
                        className="group flex min-h-[44px] items-center gap-4 py-5 sm:gap-6 sm:py-6"
                        onMouseEnter={previewEnabled ? () => showRow(i) : undefined}
                      >
                        {rowInner}
                      </div>
                    )}
                  </m.li>
                );
              })}
            </ul>

            {/* Cursor-following floating plate (decorative, desktop only, never
                rendered on the server since previewEnabled is false there). */}
            {previewEnabled && shownProject && (
              <m.div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 z-30 hidden lg:block"
                style={{ x: springX, y: springY, width: PREVIEW_W }}
                initial={false}
                animate={
                  activeRow !== null
                    ? { opacity: 1, scale: 1, rotate: 0 }
                    : { opacity: 0, scale: 0.96, rotate: -1.5 }
                }
                transition={{ duration: 0.3, ease: EASE }}
              >
                {/* Full color — no .plate duotone here: at 320px on the ink spread,
                    dark app screenshots must stay legible. Static row thumbnails
                    and case plates keep their duotone treatment. */}
                <div className="relative overflow-hidden bg-paper-200 shadow-plate-lg">
                  {shownImage && (
                    <img
                      key={shownProject.name}
                      src={getProjectImage(shownImage)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      width={640}
                      height={400}
                      className="h-[200px] w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex items-baseline justify-between gap-3 border border-t-0 rule-inverse bg-ink-950 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-paper-300">
                  <span>{indexNumber(shownIdx)}</span>
                  <span className="truncate">{shownProject.name}</span>
                </div>
              </m.div>
            )}
          </div>
        </div>

        {/* ————— Section footer ————— */}
        <m.div
          className="mt-16 flex justify-center sm:mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <a
            href={profile.github}
            target="_blank"
            rel="me noopener noreferrer"
            aria-label="View the full project archive on GitHub"
            className="press-feedback inline-flex min-h-[44px] items-center gap-2 border rule-inverse px-6 py-4 font-mono text-xs uppercase tracking-[0.16em] text-paper-100 transition-colors hover:border-vermilion hover:text-vermilion-400"
          >
            Full archive on GitHub
            <ArrowUpRightIcon className="h-4 w-4" />
          </a>
        </m.div>
      </div>
    </section>
  );
}
