import { useEffect, useRef, useState } from 'react';
import { m, useInView, useReducedMotion } from 'framer-motion';
import { profile, featuredExperience, achievements } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';
import { GitHubIcon, ArrowUpRightIcon } from './ui/Icons';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ————————————————————————————————————————————————————————————————
   Derived data — computed once at module scope from content.ts.
   Pure + deterministic, so SSR and hydration render identically.
   ———————————————————————————————————————————————————————————————— */

/** Current engagements — anything whose date range runs to the present. */
const currentRoles = featuredExperience
  .filter((e) => /present/i.test(e.date))
  .map((e) => {
    const parens = e.role.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
    return {
      role: parens ? parens[1] : e.role,
      meta: parens ? parens[2] : null,
      company: e.company,
      since: e.date.split(/\s*[-–]\s*/)[0] || e.date,
    };
  });

/** Open-source proof — parsed from the GitHub achievement, with hard fallbacks. */
const githubAchievement = achievements.find((a) => /github open source/i.test(a.name));
const ossStars = githubAchievement?.name.match(/(\d+\+?)\s*stars/i)?.[1] ?? '60+';
const ossRepos = githubAchievement?.desc.match(/(\d+)\s+repositor/i)?.[1] ?? '26';

/** Paper count — read from the same stat the Hero ticker uses. */
const paperCount = profile.stats.find((s) => /papers/i.test(s.label))?.value ?? '3';

const VENUES = ['Taylor & Francis', 'IEEE QPAIN 2026', 'SACC 2024'];

/* ————————————————————————————————————————————————————————————————
   SSR-safe count-up (local reimplementation of the Hero pattern):
   server + first client render show the FINAL value (crawler parity,
   no hydration mismatch); the count-up only runs after hydration.
   ———————————————————————————————————————————————————————————————— */

function parseStat(raw: string): { value: number; decimals: number; suffix: string } {
  const match = raw.match(/^([\d.]+)(.*)$/);
  if (!match) return { value: 0, decimals: 0, suffix: raw };
  const num = parseFloat(match[1]);
  const decimals = match[1].includes('.') ? match[1].split('.')[1].length : 0;
  return { value: num, decimals, suffix: match[2] };
}

function StatTicker({ raw }: { raw: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(raw);

  useEffect(() => {
    if (!inView || reduced) return;
    const { value, decimals, suffix } = parseStat(raw);
    if (!value) return;
    const duration = 1100;
    let start: number | null = null;
    let raf: number;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(`${(value * eased).toFixed(decimals)}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDisplay(raw);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, raw, reduced]);

  return <span ref={ref}>{display}</span>;
}

/**
 * Cosmetic live clock — SSR renders the static "UTC+6"; after mount it ticks
 * Dhaka wall time. Purely decorative: no content is gated behind it.
 */
function DhakaClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Dhaka',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="tabular-nums">{time ? `${time} UTC+6` : 'UTC+6'}</span>;
}

/* ————————————————————————————————————————————————————————————————
   Bento plumbing
   ———————————————————————————————————————————————————————————————— */

/**
 * Cell surface. The framer wrapper (reveal) and this element are separate:
 * framer leaves an inline `transform` on the node it animates, which would
 * override the Tailwind hover translate — so hover physics live one level in.
 */
const CELL =
  'glass-card relative flex h-full flex-col p-5 sm:p-7 ' +
  'hover:z-10 hover:-translate-y-0.5';

/** Staggered rise-in for each cell (0.05 stagger, y:16, once). */
const reveal = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10%' },
  transition: { duration: 0.55, delay: i * 0.05, ease: EASE },
});

/** lg placement for the four stat cells (2×2 block, left of the NOW cell). */
const STAT_SPANS = [
  'lg:col-span-4 lg:col-start-1 lg:row-start-1',
  'lg:col-span-4 lg:col-start-5 lg:row-start-1',
  'lg:col-span-4 lg:col-start-1 lg:row-start-2',
  'lg:col-span-4 lg:col-start-5 lg:row-start-2',
];

/**
 * 02 / PROOF — a bento proof grid in paper/ink/hairline material.
 * Every claim is a measurement: stats from profile.json, live roles from
 * experience.json, stars from achievements.json. Proof, not promises.
 */
export function WhyMe() {
  return (
    <section id="why-me" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeader
          number="02"
          name="PROOF"
          title={
            <>
              Proof over <em>promises</em>
            </>
          }
          annotation="MEASURED RESULTS · LIVE"
        />

        {/* Glass bento — frosted cells over the void, violet ring on hover */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12">
          {/* ——— 1–4 · Stat cells (Google-XYZ proof points) ——— */}
          {profile.stats.slice(0, 4).map((stat, i) => (
            <m.div
              key={stat.label}
              className={`col-span-1 ${STAT_SPANS[i] ?? 'lg:col-span-4'}`}
              {...reveal(i)}
            >
              <div className={`${CELL} group min-h-[9rem] sm:min-h-[11rem]`}>
                <span className="folio transition-colors duration-[180ms] ease-out group-hover:text-vermilion-400">
                  P.{String(i + 1).padStart(2, '0')}
                </span>
                <span className="mt-auto block pt-6 font-display text-[clamp(2.75rem,4.5vw,4.75rem)] font-light leading-none text-ink-900">
                  <StatTicker raw={stat.value} />
                </span>
                <span className="folio mt-2 !text-ink-600">{stat.label}</span>
              </div>
            </m.div>
          ))}

          {/* ——— 5 · NOW — current engagements (tall, right rail) ——— */}
          <m.div
            className="col-span-2 lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1"
            {...reveal(4)}
          >
            <div className={CELL}>
              <span className="folio">Currently</span>
              <ul
                className="mt-5 flex-1 divide-y divide-[color:var(--hairline)] border-t rule"
                aria-label="Current roles"
              >
                {currentRoles.map((r) => (
                  <li key={r.company} className="flex items-start gap-3 py-3.5">
                    <span
                      className="mt-1 h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-vermilion shadow-glow-sm motion-reduce:animate-none"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <span className="block font-mono text-xs uppercase tracking-[0.14em] text-ink-900">
                        {r.role} <span className="text-vermilion-400">@</span> {r.company}
                      </span>
                      <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500">
                        {r.meta ? `${r.meta} · ` : ''}since {r.since}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="folio mt-4 border-t rule pt-4 !text-ink-600">
                {currentRoles.length} concurrent roles, all live
              </p>
            </div>
          </m.div>

          {/* ——— 6 · RESEARCH → #publications ——— */}
          <m.div className="col-span-2 lg:col-span-5 lg:col-start-1 lg:row-start-3" {...reveal(5)}>
            <a
              href="#publications"
              className={`${CELL} group`}
              aria-label={`${paperCount} peer-reviewed papers, view publications`}
            >
              <span className="flex items-baseline justify-between gap-4">
                <span className="folio">Research</span>
                <ArrowUpRightIcon
                  className="h-3.5 w-3.5 shrink-0 self-center text-ink-400 transition-colors duration-[180ms] ease-out group-hover:text-vermilion-400"
                  aria-hidden="true"
                />
              </span>
              <p className="mt-6 font-display text-2xl font-light leading-tight text-ink-900 sm:text-3xl">
                <span className="text-vermilion-400">{paperCount}</span> peer-reviewed{' '}
                <em className="italic">papers</em>
              </p>
              <ul className="mt-auto flex flex-wrap gap-1.5 pt-6" aria-label="Venues">
                {VENUES.map((venue) => (
                  <li
                    key={venue}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-700"
                  >
                    {venue}
                  </li>
                ))}
              </ul>
            </a>
          </m.div>

          {/* ——— 7 · CERTIFIED → #awards ——— */}
          <m.div className="col-span-1 lg:col-span-3 lg:col-start-6 lg:row-start-3" {...reveal(6)}>
            <a
              href="#awards"
              className={`${CELL} group`}
              aria-label="Certified Ethical Hacker, view awards and certifications"
            >
              <span className="flex items-baseline justify-between gap-4">
                <span className="folio">Certified</span>
                <ArrowUpRightIcon
                  className="h-3.5 w-3.5 shrink-0 self-center text-ink-400 transition-colors duration-[180ms] ease-out group-hover:text-vermilion-400"
                  aria-hidden="true"
                />
              </span>
              <span
                className="stamp mt-6 inline-block self-start px-3.5 py-1.5 text-sm font-semibold transition-transform duration-[180ms] ease-out group-hover:scale-105"
                aria-hidden="true"
              >
                CEH
              </span>
              <span className="mt-auto block pt-6 font-mono text-xs uppercase tracking-[0.14em] text-ink-900">
                Certified Ethical Hacker
              </span>
            </a>
          </m.div>

          {/* ——— 8 · OPEN SOURCE → GitHub ——— */}
          <m.div className="col-span-1 lg:col-span-4 lg:col-start-9 lg:row-start-3" {...reveal(7)}>
            <a
              href={profile.github}
              target="_blank"
              rel="me noopener noreferrer"
              className={`${CELL} group`}
              aria-label={`GitHub profile, ${ossStars} stars across ${ossRepos} repositories (opens in new tab)`}
            >
              <span className="flex items-baseline justify-between gap-4">
                <span className="folio">Open source</span>
                <GitHubIcon
                  className="h-4 w-4 shrink-0 self-center text-ink-400 transition-colors duration-[180ms] ease-out group-hover:text-vermilion-400"
                  aria-hidden="true"
                />
              </span>
              <p className="mt-6 font-display text-2xl font-light leading-tight text-ink-900 sm:text-3xl">
                <span className="text-vermilion-400">{ossStars}</span>{' '}
                <em className="italic">stars</em>
              </p>
              <span className="mt-auto block pt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-600 sm:text-xs sm:tracking-[0.14em]">
                {ossRepos} repos · GitHub{' '}
                <span aria-hidden="true">↗</span>
              </span>
            </a>
          </m.div>

          {/* ——— 9 · LOCATION / TZ ——— */}
          <m.div className="col-span-2 lg:col-span-4 lg:col-start-1 lg:row-start-4" {...reveal(8)}>
            <div className={CELL}>
              <span className="folio">Location / TZ</span>
              <p className="mt-auto pt-6 font-mono text-xs uppercase tracking-[0.16em] text-ink-900 sm:text-sm">
                Dhaka, BD · <DhakaClock />
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-ink-600 sm:text-sm">
                Remote · Worldwide
              </p>
            </div>
          </m.div>

          {/* ——— 10 · REVIEWER #2 (wide) — the smile moment ——— */}
          <m.div className="col-span-2 lg:col-span-8 lg:col-start-5 lg:row-start-4" {...reveal(9)}>
            <aside aria-label="Peer review verdict" className={CELL}>
              <div className="folio flex items-baseline justify-between gap-4 border-b rule pb-3 pr-16 sm:pr-24">
                <span>Peer review · Reviewer #2</span>
                <span className="hidden sm:block">Confidence 5/5</span>
              </div>
              <blockquote className="mt-6 max-w-[40ch] font-mono text-sm leading-relaxed text-ink-800 sm:text-base">
                &ldquo;Strong accept. No revisions required.&rdquo;
              </blockquote>
              <p className="mt-auto pt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500 sm:text-[11px]">
                Reviewer #2 requested no changes. Believed to be a first in the literature.
              </p>
              <m.span
                className="stamp absolute right-4 top-4 px-3 py-1.5 text-xs font-semibold sm:right-8 sm:px-4 sm:py-2 sm:text-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.45, delay: 0.55, ease: EASE }}
              >
                Accept
              </m.span>
            </aside>
          </m.div>
        </div>
      </div>
    </section>
  );
}
