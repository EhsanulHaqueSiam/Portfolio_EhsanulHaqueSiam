import { useEffect, useRef, useState } from 'react';
import { SegmentedControl, SegmentedControlIndicator, SegmentedControlItem } from '@ui-sdk/react/segmented-control';
import { profile, quote, skills } from '../../data/content';
import { haptic } from '../../lib/haptics';
import { sound } from '../../lib/sound';
import { HeaderLink, Section } from './chrome';
import { RollNumber } from './RollNumber';

// Short tab labels for the skills.json categories; unlisted ones show only under "All".
const TABS: Record<string, string> = {
  'AI & Machine Learning': 'AI',
  'Web Development': 'Web',
  'Backend & Databases': 'Backend',
  'Mobile Development': 'Mobile',
  'Tools & Platforms': 'Tools',
};

export function Stack() {
  const [tab, setTab] = useState('All');
  // Settle-in only after a pointer change; keyboard changes stay instant (DESIGN.md: no motion on keyboard actions).
  const [changed, setChanged] = useState(false);
  const byPointer = useRef(false);
  // "All" keeps the strongest skills so the strip stays short; a tab shows its whole category.
  const shown = skills.categories
    .filter((c) => tab === 'All' || TABS[c.name] === tab)
    .flatMap((c) => c.skills.filter((s) => tab !== 'All' || s.level === 'advanced' || s.level === 'expert').map((s) => s.name));
  const unique = [...new Set(shown)];

  return (
    <Section
      id="stack"
      title="Tech Stack"
      aside={
        <SegmentedControl
          onPointerDown={() => {
            byPointer.current = true;
          }}
          onKeyDown={() => {
            byPointer.current = false;
          }}
          aria-label="Filter skills"
          value={tab}
          onValueChange={(next) => {
            if (typeof next !== 'string') return;
            setTab(next);
            setChanged(byPointer.current);
            sound.click();
            haptic('selection');
          }}
          className="flex-wrap"
        >
          <SegmentedControlIndicator />
          {['All', ...Object.values(TABS)].map((t) => (
            <SegmentedControlItem key={t} value={t}>
              {t}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      }
    >
      <p aria-hidden="true" className="-mt-1 mb-2 hidden font-mono text-[11px] text-muted-foreground [@media(hover:hover)_and_(pointer:fine)]:block">
        ( hover to play )
      </p>
      {/* Keyed by tab so a new filter re-staggers every chip in. */}
      <ul key={tab} className="flex flex-wrap gap-1.5">
        {unique.map((name, i) => (
          <li key={name} className={changed ? 'swap-in' : undefined} style={{ '--n': Math.min(i, 16) } as React.CSSProperties}>
            {/* biome-ignore lint/a11y/noStaticElementInteractions: hover/tap only plays a note; the chip has no action */}
            <span
              onMouseEnter={() => sound.note(i)}
              onPointerDown={(e) => {
                if (e.pointerType === 'mouse') return;
                sound.note(i);
                haptic();
              }}
              className="press inline-block cursor-default rounded-md border border-border bg-card px-2.5 py-1 text-[12.5px] text-foreground/85 transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              {name}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

type Day = { date: string; count: number; level: number };
const USER = profile.github.split('/').pop() ?? '';
const FILL = ['hsl(var(--foreground)/0.07)', 'hsl(var(--foreground)/0.22)', 'hsl(var(--foreground)/0.42)', 'hsl(var(--foreground)/0.68)', 'hsl(var(--foreground)/0.95)'];
// The grid spans two calendar years, so the year disambiguates days at either end.
const fmt = new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

/** Last year of GitHub contributions; hovering a day rings it, names its count and plays a note for its level. */
export function Activity() {
  const [days, setDays] = useState<Day[] | null>(null);
  const [total, setTotal] = useState(0);
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGRectElement>(null);
  const tip = useRef<HTMLSpanElement>(null);

  // Fetch once the grid nears the viewport; the API is third-party and not needed above the fold.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        fetch(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`)
          .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
          .then((d: { total: { lastYear: number }; contributions: Day[] }) => {
            setDays(d.contributions);
            setTotal(d.total.lastYear);
          })
          .catch(() => setFailed(true));
      },
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const weeks: Day[][] = [];
  if (days) for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  // One ring and one tooltip travel to the day under the pointer (after Bencho's stacked bars).
  // Both are moved by hand, so sweeping the grid never re-renders its 365 cells.
  const point = (target: EventTarget) => {
    if (!(target instanceof SVGRectElement)) return;
    const day = days?.[Number(target.dataset.i)];
    const r = ring.current;
    const t = tip.current;
    const box = ref.current;
    if (!day || !r || !t || !box) return;
    const fresh = t.dataset.on !== 'true';
    for (const el of [r, t]) if (fresh) el.style.transition = 'none';
    r.style.transform = `translate(${target.getAttribute('x')}px, ${target.getAttribute('y')}px)`;
    t.textContent = `${day.count === 0 ? 'No' : day.count} contribution${day.count === 1 ? '' : 's'} on ${fmt.format(new Date(`${day.date}T00:00:00`))}`;
    const cell = target.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    // Centred over the cell, kept inside the section.
    const x = Math.min(Math.max(cell.left + cell.width / 2 - b.left - t.offsetWidth / 2, 0), b.width - t.offsetWidth);
    t.style.transform = `translate(${x}px, ${cell.top - b.top - t.offsetHeight - 6}px)`;
    if (fresh) {
      void t.offsetWidth;
      for (const el of [r, t]) el.style.transition = '';
    }
    r.dataset.on = t.dataset.on = 'true';
    if (day.count) sound.note(day.level * 2);
  };
  const leave = () => {
    if (ring.current) ring.current.dataset.on = 'false';
    if (tip.current) tip.current.dataset.on = 'false';
  };

  return (
    <Section id="github" title="GitHub Activity" aside={<HeaderLink href={profile.github}>@{USER}</HeaderLink>}>
      <div ref={ref} className="relative">
        {failed && <p className="text-[13px] text-muted-foreground">Couldn’t load contributions right now. Try the GitHub link above.</p>}
        {!failed && (
          <>
            {/* biome-ignore lint/a11y/useSemanticElements: a fieldset implies form controls; this only names the scroller */}
            <div
              // biome-ignore lint/a11y/noNoninteractiveTabindex: the grid overflows on phones, so its scroller must take focus for keyboard scrolling (WCAG 2.1.1)
              tabIndex={0}
              role="group"
              aria-label="Contribution grid, scrollable"
              // 3px of room on every side so the hover ring and its stroke are not clipped by the scroller.
              className="-m-[3px] overflow-x-auto p-[3px] pb-1.5"
              ref={(el) => {
                // Narrow screens open on the most recent weeks (once, so later renders don't yank it back).
                if (el && days && !el.dataset.scrolled) {
                  el.scrollLeft = el.scrollWidth;
                  el.dataset.scrolled = '1';
                }
              }}
              onPointerOver={(e) => point(e.target)}
              onMouseLeave={leave}
              onScroll={leave}
            >
              {days ? (
                <svg viewBox={`0 0 ${weeks.length * 12} 84`} className="block h-auto w-full min-w-[520px] overflow-visible" role="img" aria-label={`${total} contributions in the last year`}>
                  {weeks.map((w, x) => w.map((d, y) => <rect key={d.date} data-i={x * 7 + y} x={x * 12} y={y * 12} width={10} height={10} rx={2} fill={FILL[d.level] ?? FILL[0]} />))}
                  <rect ref={ring} className="gh-ring" x={-1.5} y={-1.5} width={13} height={13} rx={3} />
                </svg>
              ) : (
                // The empty grid, at the loaded grid's exact size, so nothing moves when the data lands.
                <svg viewBox="0 0 636 84" aria-hidden="true" className="block h-auto w-full min-w-[520px]">
                  <defs>
                    <pattern id="gh-cell" width="12" height="12" patternUnits="userSpaceOnUse">
                      <rect width="10" height="10" rx="2" fill={FILL[0]} />
                    </pattern>
                  </defs>
                  <rect width="636" height="84" fill="url(#gh-cell)" />
                </svg>
              )}
            </div>
            <span ref={tip} aria-hidden="true" className="gh-tip" />
            <div className="mt-2 flex items-center justify-between gap-3 text-[12px] text-muted-foreground">
              <span className="tabular-nums">
                {days ? (
                  <>
                    <RollNumber value={total} /> contributions in the last year
                  </>
                ) : (
                  'Loading contributions…'
                )}
              </span>
              <span className="flex items-center gap-1">
                Less
                {FILL.map((f) => (
                  <span key={f} className="h-2.5 w-2.5 rounded-[2px]" style={{ background: f }} />
                ))}
                More
              </span>
            </div>
          </>
        )}
      </div>
    </Section>
  );
}

export function Outro() {
  return (
    <section aria-labelledby="outro-title">
      <div className="hatch" aria-hidden="true" />
      <div className="px-4 py-12 text-center">
        <h2 id="outro-title" className="font-serif text-[30px] leading-none">
          Scrolled Too Far
        </h2>
        <p className="mx-auto mt-3 max-w-[34ch] text-[14px] text-muted-foreground">If you read this far, you might like what I build. My inbox is open.</p>
        <a
          href={`mailto:${profile.email}`}
          onMouseEnter={sound.tick}
          onClick={() => haptic()}
          className="press group mt-5 inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2 text-[13px] font-medium text-background"
        >
          Let’s talk <span className="icon-nudge">→</span>
        </a>
      </div>
    </section>
  );
}

/** Closing quote, after samworks: the one on Siam's Ledgercross team page. */
export function Quote() {
  return (
    <figure className="border-t border-dashed border-border px-4 py-12 text-center">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="mx-auto h-6 w-6 text-muted-foreground" fill="currentColor">
        <path d="M7.2 6C4.9 7.2 3.5 9.3 3.5 12.3V18h6v-6H6.7c.1-1.8 1-3 2.6-3.8L7.2 6zm10 0c-2.3 1.2-3.7 3.3-3.7 6.3V18h6v-6h-2.8c.1-1.8 1-3 2.6-3.8L17.2 6z" />
      </svg>
      <blockquote className="mx-auto mt-4 max-w-[28ch] text-balance font-serif text-[30px] italic leading-[1.2]">“{quote.text}”</blockquote>
      <figcaption className="mt-5 flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className="h-px w-10 bg-border" aria-hidden="true" />
        {quote.by}
        <span className="h-px w-10 bg-border" aria-hidden="true" />
      </figcaption>
    </figure>
  );
}
