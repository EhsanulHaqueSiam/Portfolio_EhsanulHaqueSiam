import { type CSSProperties, useRef, useState } from 'react';
import { AnimatePresence, m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { featuredProjects, getProjectImage } from '../../data/content';
import type { Project } from '../../data/types';
import { haptic } from '../../lib/haptics';
import { sound } from '../../lib/sound';
import { BoxIcon, ChevronIcon } from './icons';
import { ext, Section } from './chrome';

const PILE = 5;
const COLLAPSED = 8;
// Resting tilts for the stacked prints, and the fanned-out tilt step.
const TILT = [-7, 4, -2, 6, -4];

const href = (p: Project) => p.links.view ?? p.links.code ?? '#';
const cover = (p: Project) => (p.images[0] ? getProjectImage(p.images[0]) : null);
/** One-line pitch: the first metric reads better in a dense row than the long problem statement. */
const pitch = (p: Project) => p.metrics[0] ?? p.desc.split('. ')[0];

function Pile({ items }: { items: Project[] }) {
  const mid = (items.length - 1) / 2;
  return (
    <div className="pile" onPointerEnter={(e) => e.pointerType === 'mouse' && sound.paper(true)} onPointerLeave={(e) => e.pointerType === 'mouse' && sound.paper(false)}>
      {items.map((p, i) => (
        <a
          key={p.name}
          href={href(p)}
          {...ext(href(p))}
          aria-label={`${p.name} (${p.links.view ? 'live site' : 'source code'})`}
          onMouseEnter={() => sound.note(i)}
          onClick={haptic}
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
      ))}
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

export function Shipped() {
  const [all, setAll] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const { shown, setShown, y, sy } = usePreview();
  const withCovers = featuredProjects.filter(cover);
  const rows = all ? featuredProjects : featuredProjects.slice(0, COLLAPSED);

  return (
    <Section id="projects" title="Things I’ve shipped" aside={<span className="font-mono">{featuredProjects.length} projects</span>}>
      <Pile items={withCovers.slice(0, PILE)} />
      <p className="mb-3 mt-1 hidden text-center text-[11px] text-muted-foreground [@media(hover:hover)_and_(pointer:fine)]:block">Hover the pile to spread it.</p>

      <div className="relative">
        <ul
          ref={listRef}
          className="divide-y divide-border"
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
                  onClick={haptic}
                  className="group -mx-2 grid grid-cols-[24px_1fr_auto] items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary/60"
                >
                  <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-md border border-border bg-card text-[11px] font-semibold">
                    {p.name[0]}
                  </span>
                  <span className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                    <span className="block shrink-0 text-[14px] font-medium">{p.name}</span>
                    <span className="block truncate text-[13px] text-muted-foreground">{pitch(p)}</span>
                  </span>
                  {live ? (
                    <span className="flex items-center gap-2 text-[12px] text-signal-success">
                      <span aria-hidden="true" className="hidden opacity-0 transition-opacity group-hover:opacity-100 sm:inline">live</span>
                      <span role="img" aria-label="Live" className="h-[7px] w-[7px] rounded-full bg-current shadow-[0_0_0_3px_hsl(var(--signal-success)/0.18)]" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-[12px] text-muted-foreground">
                      <span aria-hidden="true" className="hidden opacity-0 transition-opacity group-hover:opacity-100 sm:inline">code</span>
                      <BoxIcon aria-label="Source code" className="icon-pop h-4 w-4" />
                    </span>
                  )}
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

      {featuredProjects.length > COLLAPSED && (
        <button
          type="button"
          aria-expanded={all}
          onClick={() => {
            setAll(!all);
            sound.paper(!all);
            haptic();
          }}
          className="press group mt-3 inline-flex items-center gap-1 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
        >
          {all ? 'Show fewer' : `Show all ${featuredProjects.length}`}
          <ChevronIcon className={`h-3.5 w-3.5 transition-transform duration-200 ${all ? 'rotate-180' : ''}`} />
        </button>
      )}
    </Section>
  );
}
