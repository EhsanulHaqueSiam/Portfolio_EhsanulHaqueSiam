import { useEffect, useRef, useState } from 'react';
import { profile, skills } from '../../data/content';
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
        <div role="group" aria-label="Filter skills" className="flex flex-wrap justify-end gap-0.5">
          {['All', ...Object.values(TABS)].map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tab === t}
              onClick={() => {
                setTab(t);
                sound.click();
                haptic();
              }}
              className="rounded-md px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground aria-pressed:bg-secondary aria-pressed:text-foreground"
            >
              {t}
            </button>
          ))}
        </div>
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
