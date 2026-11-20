import { useEffect, useRef, useState } from 'react';
import { SegmentedControl, SegmentedControlIndicator, SegmentedControlItem } from '@ui-sdk/react/segmented-control';
import { profile, quote, skills } from '../../data/content';
import { haptic } from '../../lib/haptics';
import { sound } from '../../lib/sound';
import { HeaderLink, Section } from './chrome';

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
  // "All" keeps the strongest skills so the strip stays short; a tab shows its whole category.
  const shown = skills.categories
    .filter((c) => tab === 'All' || TABS[c.name] === tab)
    .flatMap((c) => c.skills.filter((s) => tab !== 'All' || s.level === 'advanced' || s.level === 'expert').map((s) => s.name));
  const unique = [...new Set(shown)];

  return (
    <Section
      id="stack"
      title={
        <>
          Tech Stack <span className="align-middle font-mono text-[11px] tracking-normal text-muted-foreground">( hover to play )</span>
        </>
      }
      aside={
        <SegmentedControl
          aria-label="Filter skills"
          value={tab}
          onValueChange={(next) => {
            if (typeof next !== 'string') return;
            setTab(next);
            sound.click();
            haptic();
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
      <ul className="flex flex-wrap gap-1.5">
        {unique.map((name, i) => (
          <li key={name}>
            {/* biome-ignore lint/a11y/noStaticElementInteractions: hover/tap only plays a note; the chip has no action */}
            <span
              onMouseEnter={() => sound.note(i)}
              onPointerDown={(e) => {
                if (e.pointerType === 'mouse') return;
                sound.note(i);
                haptic();
              }}
              className="press inline-block cursor-default rounded-md border border-border bg-card px-2.5 py-1 text-[12.5px] text-foreground/85 transition-colors hover:border-foreground/30 hover:text-foreground active:scale-95"
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
const fmt = new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' });

/** Last year of GitHub contributions; hovering a day plays a note for its level. */
export function Activity() {
  const [days, setDays] = useState<Day[] | null>(null);
  const [total, setTotal] = useState(0);
  const [failed, setFailed] = useState(false);
  const [hover, setHover] = useState<Day | null>(null);
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <Section id="github" title="GitHub Activity" aside={<HeaderLink href={profile.github}>@{USER}</HeaderLink>}>
      <div ref={ref} className="min-h-[120px]">
        {failed && <p className="text-[13px] text-muted-foreground">Couldn’t load contributions right now. Try the GitHub link above.</p>}
        {!days && !failed && (
          <div className="overflow-x-auto pb-1" aria-hidden="true">
            <svg viewBox="0 0 636 84" aria-hidden="true" className="block h-auto w-full min-w-[520px]">
              {Array.from({ length: 53 * 7 }, (_, k) => (
                <rect key={k} x={Math.floor(k / 7) * 12} y={(k % 7) * 12} width={10} height={10} rx={2} fill={FILL[0]} />
              ))}
            </svg>
          </div>
        )}
        {days && (
          <>
            <div className="overflow-x-auto pb-1">
              <svg viewBox={`0 0 ${weeks.length * 12} 84`} className="block h-auto w-full min-w-[520px]" role="img" aria-label={`${total} contributions in the last year`}>
                {weeks.map((w, x) =>
                  w.map((d, y) => (
                    // biome-ignore lint/a11y/noStaticElementInteractions: hover shows the day's count below and plays a note; the svg's label carries the total
                    <rect
                      key={d.date}
                      x={x * 12}
                      y={y * 12}
                      width={10}
                      height={10}
                      rx={2}
                      fill={FILL[d.level] ?? FILL[0]}
                      onMouseEnter={() => {
                        setHover(d);
                        if (d.count) sound.note(d.level * 2);
                      }}
                    />
                  )),
                )}
              </svg>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 text-[12px] text-muted-foreground">
              <span className="tabular-nums">
                {hover ? `${hover.count} on ${fmt.format(new Date(`${hover.date}T00:00:00`))}` : `${total.toLocaleString()} contributions in the last year`}
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
          Scrolled too far
        </h2>
        <p className="mx-auto mt-3 max-w-[34ch] text-[14px] text-muted-foreground">If you read this far, you might like what I build. My inbox is open.</p>
        <a
          href={`mailto:${profile.email}`}
          onMouseEnter={sound.tick}
          onClick={haptic}
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
