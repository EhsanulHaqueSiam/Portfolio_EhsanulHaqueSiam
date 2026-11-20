import { type CSSProperties, useRef, useState } from 'react';
import { AnimatePresence, m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { featuredProjects, getProjectImage, projectIcon } from '../../data/content';
import type { Project } from '../../data/types';
import { haptic } from '../../lib/haptics';
import { sound } from '../../lib/sound';
import { GitHubIcon } from '../ui/Icons';
import { SegmentedControl, SegmentedControlIndicator, SegmentedControlItem } from '@ui-sdk/react/segmented-control';
import { ChevronIcon, GlobeIcon } from './icons';
import { StatusIcon } from './StatusIcon';
import { ext, Section } from './chrome';

const PILE = 5;
const COLLAPSED_ROWS = 8;
const COLLAPSED_CARDS = 4;
// Resting tilts for the stacked prints, and the fanned-out tilt step.
const TILT = [-7, 4, -2, 6, -4];

const href = (p: Project) => p.links.view ?? p.links.code ?? '#';
const cover = (p: Project) => (p.images[0] ? getProjectImage(p.images[0]) : null);
/** One-line pitch: the first metric reads better in a dense row than the long problem statement. */
const pitch = (p: Project) => p.metrics[0] ?? p.desc.split('. ')[0];
/** The card's one line: the project's first sentence (what problem it answers). */
const summary = (p: Project) => p.desc.split(/(?<=\.)\s/)[0];

function Pile({ items }: { items: Project[] }) {
  const mid = (items.length - 1) / 2;
  return (
    // Prints are mouse-only shortcuts; the rows below carry the same links for keyboards and screen readers.
    <div className="pile" aria-hidden="true" onPointerEnter={(e) => e.pointerType === 'mouse' && sound.open(true)} onPointerLeave={(e) => e.pointerType === 'mouse' && sound.open(false)}>
      {items.map((p, i) => {
        return (
        <a
          key={p.name}
          href={href(p)}
          {...ext(href(p))}
          tabIndex={-1}
          aria-label={p.name}
          onMouseEnter={() => sound.note(i)}
          onClick={() => haptic()}
          className="print"
          style={
            {
              '--x': `${(i - mid) * 10}px`,
              '--r': `${TILT[i % TILT.length]}deg`,
              '--sx': `${(i - mid) * 112}px`,
              '--sr': `${(i - mid) * 4}deg`,
              zIndex: i === Math.round(mid) ? 5 : i,
            } as CSSProperties
          }
        >
          <img src={cover(p) ?? ''} alt="" loading="lazy" decoding="async" width={184} height={115} />
          <span>{p.name}</span>
        </a>
        );
      })}
    </div>
  );
}

/** Screenshot that trails the cursor beside the hovered row (fine pointers only). */
function usePreview() {
  const [shown, setShown] = useState<Project | null>(null);
  const y = useMotionValue(0);
  const sy = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });
  return { shown, setShown, y, sy };
}

// Backdrops for the cards, cycled by position (after samworks' tinted corners).
const GRADIENTS = [
  'linear-gradient(135deg, #ffffff 0%, #a3e635 45%, #0f172a 100%)',
  'linear-gradient(135deg, #ffffff 0%, #60a5fa 45%, #1e3a8a 100%)',
  'linear-gradient(135deg, #ffffff 0%, #fb923c 45%, #7c2d12 100%)',
  'linear-gradient(135deg, #ffffff 0%, #38bdf8 40%, #4ade80 100%)',
  'linear-gradient(135deg, #ffffff 0%, #c084fc 45%, #3b0764 100%)',
  'linear-gradient(135deg, #ffffff 0%, #fb7185 45%, #4c0519 100%)',
];
/** A reach number for the corner ribbon: "12,000+ scholarships indexed daily" -> "12,000+ scholarships". */
export const ribbon = (p: Project) => {
  for (const m of p.metrics) {
    // Only reach numbers earn a ribbon (people, scale), not feature counts.
    const hit = m.match(/^[\d,.]+\+?\s+(?:[A-Za-z]+\s+)?(?:users|customers|clients|scholarships|reviews|spiders)\b/i);
    if (hit) return hit[0];
  }
  return null;
};

function ProjectCards({ items }: { items: Project[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((p, i) => {
        const shot = cover(p);
        const tag = ribbon(p);
        return (
          <li key={p.name} className="group flex flex-col rounded-[10px] border border-border p-3" onMouseEnter={sound.tick}>
            {/* biome-ignore lint/a11y/useAnchorContent: mouse-only shortcut; the site and code icons are the accessible links */}
            <a href={href(p)} {...ext(href(p))} onClick={() => haptic()} tabIndex={-1} aria-hidden="true" className="pcard-art block" style={{ background: GRADIENTS[i % GRADIENTS.length] }}>
              {shot && <img src={shot} alt="" loading="lazy" decoding="async" width={560} height={350} className="pcard-shot" />}
              <span className="pcard-sheen" aria-hidden="true" />
              {tag && (
                <span className="pcard-ribbon" aria-hidden="true">
                  {tag}
                </span>
              )}
            </a>
            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-[16px] font-medium leading-tight">{p.name}</h3>
                <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted-foreground">{summary(p)}</p>
              </div>
              {p.links.view ? (
                <span className="flex shrink-0 items-center gap-1.5 text-[12px] text-signal-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                  Live
                </span>
              ) : (
                <span className="shrink-0 text-[12px] text-muted-foreground">Shipped</span>
              )}
            </div>
            <div className="mt-auto flex items-center justify-between gap-2 pt-3">
              <ul className="flex flex-wrap gap-1.5" aria-label={`${p.name} stack`}>
                {p.tags.slice(0, 3).map((t) => (
                  <li key={t} className="rounded-md border border-border bg-card px-2 py-0.5 text-[11px] text-foreground/80">
                    {t}
                  </li>
                ))}
              </ul>
              <span className="flex shrink-0 items-center gap-1 text-muted-foreground">
                {p.links.view && (
                  <a href={p.links.view} {...ext(p.links.view)} onMouseEnter={sound.tick} onClick={() => haptic()} aria-label={`${p.name} website`} className="press grid h-7 w-7 place-items-center rounded-md transition-colors hover:text-foreground">
                    <GlobeIcon className="h-4 w-4" />
                  </a>
                )}
                {p.links.code && (
                  <a href={p.links.code} {...ext(p.links.code)} onMouseEnter={sound.tick} onClick={() => haptic()} aria-label={`${p.name} source on GitHub`} className="press grid h-7 w-7 place-items-center rounded-md transition-colors hover:text-foreground">
                    <GitHubIcon className="h-4 w-4" />
                  </a>
                )}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function ProjectList({ rows }: { rows: Project[] }) {
  const listRef = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const { shown, setShown, y, sy } = usePreview();
  return (
    <>
      <Pile items={featuredProjects.filter(cover).slice(0, PILE)} />
      <p className="mb-3 mt-1 hidden text-center text-[11px] text-muted-foreground [@media(hover:hover)_and_(pointer:fine)]:block">Hover the pile to spread it.</p>

      <div className="relative">
        <ul
          ref={listRef}
          className="relative isolate divide-y divide-border"
          onMouseMove={(e) => {
            const top = listRef.current?.getBoundingClientRect().top ?? 0;
            y.set(e.clientY - top - 60);
          }}
          onMouseLeave={() => setShown(null)}
        >
          {rows.map((p) => {
            const live = Boolean(p.links.view);
            return (
              <li key={p.name}>
                <a
                  href={href(p)}
                  {...ext(href(p))}
                  onMouseEnter={() => {
                    sound.tick();
                    if (matchMedia('(hover: hover) and (pointer: fine)').matches) setShown(cover(p) ? p : null);
                  }}
                  onClick={() => haptic()}
                  className="group -mx-2 grid grid-cols-[24px_1fr_auto] items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary/60"
                >
                  {projectIcon(p.name) ? (
                    <img src={projectIcon(p.name) ?? ''} alt="" width={24} height={24} loading="lazy" className="h-6 w-6 rounded-[6px] object-cover" />
                  ) : (
                    <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-md border border-border bg-card text-[11px] font-semibold">
                      {p.name[0]}
                    </span>
                  )}
                  <span className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                    <span className="block shrink-0 text-[14px] font-medium">{p.name}</span>
                    <span className="block truncate text-[13px] text-muted-foreground">{pitch(p)}</span>
                  </span>
                  <StatusIcon status={live ? 'live' : 'shipped'} />
                </a>
              </li>
            );
          })}
        </ul>

        <AnimatePresence>
          {shown && (
            <m.div
              key="preview"
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.97, filter: 'blur(4px)' }}
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
              style={{ y: reduce ? y : sy }}
              className="pointer-events-none absolute left-full top-0 z-30 ml-6 hidden w-[260px] origin-left rounded-md bg-[#f4f4f1] p-1.5 pb-6 shadow-[0_14px_36px_rgb(0_0_0/0.5)] xl:block"
            >
              <img src={cover(shown) ?? ''} alt="" className="aspect-[16/10] w-full rounded-sm object-cover" />
              <span className="absolute bottom-1.5 left-2 font-mono text-[11px] font-medium text-[#111]">{shown.name}</span>
            </m.div>
          )}
        </AnimatePresence>
      </div>

    </>
  );
}

export function Shipped() {
  const [view, setView] = useState<'cards' | 'list'>('cards');
  const [all, setAll] = useState(false);
  const limit = view === 'cards' ? COLLAPSED_CARDS : COLLAPSED_ROWS;
  const items = all ? featuredProjects : featuredProjects.slice(0, limit);

  return (
    <Section
      id="projects"
      title="Things I’ve Shipped"
      aside={
        <SegmentedControl
          aria-label="Project view"
          value={view}
          onValueChange={(next) => {
            if (next !== 'cards' && next !== 'list') return;
            setView(next);
            sound.click();
            haptic('selection');
          }}
        >
          <SegmentedControlIndicator />
          <SegmentedControlItem value="cards">Cards</SegmentedControlItem>
          <SegmentedControlItem value="list">List</SegmentedControlItem>
        </SegmentedControl>
      }
    >
      {view === 'cards' ? <ProjectCards items={items} /> : <ProjectList rows={items} />}

      {featuredProjects.length > limit && (
        <button
          type="button"
          aria-expanded={all}
          onClick={(e) => {
            const collapsing = all;
            setAll(!all);
            sound.open(!all);
            haptic();
            if (collapsing) e.currentTarget.closest('section')?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
          }}
          className="press group -my-2 mt-1 inline-flex items-center gap-1 py-2 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
        >
          {all ? 'Show fewer' : `Show all ${featuredProjects.length}`}
          <ChevronIcon className={`h-3.5 w-3.5 transition-transform duration-200 ${all ? 'rotate-180' : ''}`} />
        </button>
      )}
    </Section>
  );
}
