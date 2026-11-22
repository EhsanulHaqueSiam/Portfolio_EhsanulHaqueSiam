import { Fragment } from 'react';
import { journey, type JourneyItem, workSlug } from '../../data/content';
import type { OpenSourceRepo } from '../../data/opensource';
import { haptic } from '../../lib/haptics';
import { sound } from '../../lib/sound';
import { ArrowUpRightIcon, ResumeIcon } from '../ui/Icons';
import { ext, HeaderLink, Section } from './chrome';
import { Brand, T3Mark } from './icons';
import { shortRole } from './Rows';

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

/** Square mark for a card or chip: the project icon, the repo's logo, a paper glyph, or initials. */
function Mark({ item, size }: { item: JourneyItem; size: number }) {
  const inner =
    item.repo === 't3' ? (
      <T3Mark className="h-full w-full" />
    ) : item.repo === 'betterAuth' ? (
      <Brand name="betterAuth" className="h-1/2 w-1/2" />
    ) : item.icon ? (
      <img src={item.icon} alt="" width={size} height={size} loading="lazy" className="h-full w-full object-cover" />
    ) : item.kind === 'paper' ? (
      <ResumeIcon className="h-1/2 w-1/2 text-muted-foreground" />
    ) : (
      // Capitals make the initials: "InvoicePilot" -> "IP", "CS Fest" -> "CS".
      (item.title.match(/[A-Z]/g) ?? [item.title[0]]).slice(0, 2).join('')
    );
  return (
    <span aria-hidden="true" style={{ width: size, height: size }} className="grid shrink-0 place-items-center overflow-hidden rounded-[7px] border border-border bg-card text-[11px] font-semibold">
      {inner}
    </span>
  );
}

/** Fills a repo item's line and star count from the build-time GitHub data. */
function withRepo(item: JourneyItem, repos: OpenSourceRepo[]) {
  const r = item.repo && repos.find((x) => x.logo === item.repo);
  if (!r) return { ...item, stars: null };
  const merged = r.prs.filter((p) => p.state === 'merged');
  const note = merged.find((p) => p.note)?.note;
  return {
    ...item,
    title: r.name,
    desc: item.desc ?? `${merged.length} merged pull request${merged.length === 1 ? '' : 's'}${note ? `, ${note}` : ''}`,
    stars: r.stars,
  };
}

// Links get the row tick and a tap haptic; items without a link render as plain boxes.
const linkProps = (href: string) => ({ href, ...ext(href), onMouseEnter: sound.tick, onClick: () => haptic() });

function Stars({ n }: { n: number }) {
  return (
    <span className="font-mono text-[11px] font-normal tabular-nums text-muted-foreground">
      {compact.format(n)} <span className="text-signal-star">★</span>
    </span>
  );
}

function Card({ item }: { item: ReturnType<typeof withRepo> }) {
  const body = (
    <>
      <Mark item={item} size={30} />
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-x-2 text-[14px] font-medium leading-snug">
          {item.title}
          {item.stars !== null && <Stars n={item.stars} />}
        </span>
        {item.desc && <span className="mt-0.5 block text-[12.5px] leading-snug text-muted-foreground">{item.desc}</span>}
      </span>
      {item.href && <ArrowUpRightIcon className="icon-arrow absolute right-3 top-3 h-3 w-3 text-muted-foreground/60 transition-colors group-hover:text-foreground" />}
    </>
  );
  const cls = 'relative flex gap-3 rounded-[10px] border border-border bg-card p-3.5 pr-7';
  return item.href ? (
    <a {...linkProps(item.href)} className={`press group ${cls} hover:border-foreground/20 hover:bg-secondary/60`}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

function Chip({ item }: { item: JourneyItem }) {
  const body = (
    <>
      <Mark item={item} size={20} />
      {item.title}
      {item.meta && <span className="font-mono text-[11px] text-muted-foreground">{item.meta}</span>}
    </>
  );
  const cls = 'inline-flex h-[34px] items-center gap-2 rounded-lg border border-border bg-card pl-[7px] pr-3 text-[13px]';
  return item.href ? (
    <a {...linkProps(item.href)} className={`press ${cls} hover:border-foreground/20 hover:bg-secondary/60`}>
      {body}
    </a>
  ) : (
    <span className={cls}>{body}</span>
  );
}

/**
 * Journey: the home timeline that replaces the Experience rows. Each era (site.json `journey`,
 * newest first) has a dot on a dashed rail, a title, its roles linking to their /work pages, a
 * short paragraph, and the work from that time as cards (big eras) or chips (small ones).
 * The first era is the current one and gets the live dot.
 */
export function Journey({ repos }: { repos: OpenSourceRepo[] }) {
  return (
    <Section id="experience" title="Journey" aside={<HeaderLink href="#resume">CV</HeaderLink>}>
      <ol className="mt-1">
        {journey.map((era, n) => {
          const now = n === 0;
          return (
            <li key={era.title} className="relative pb-10 pl-8 last:pb-1">
              {/* Rail: from under this dot to the next one; the last era has none. */}
              {n < journey.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-[5px] top-5 border-l border-dashed border-border" />}
              <span
                aria-hidden="true"
                className={`absolute left-0 top-[5px] h-[11px] w-[11px] rounded-full border ${now ? 'border-signal-success bg-signal-success' : 'border-muted-foreground/60 bg-background'}`}
              />
              <p className={`text-[12.5px] ${now ? 'text-signal-success' : 'text-muted-foreground'}`}>{era.when}</p>
              <h3 className="mt-1 flex items-center gap-2.5 text-[19px] font-medium leading-tight tracking-[-0.01em]">
                <img src={era.icon} alt="" width={22} height={22} loading="lazy" className="h-[22px] w-[22px] shrink-0 rounded-md border border-border object-cover" />
                {era.title}
              </h3>
              <p className="mt-1.5 text-[13px] text-muted-foreground">
                {era.roles.length
                  ? era.roles.map((e, i) => (
                      <Fragment key={e.company}>
                        {i > 0 && ' · '}
                        <a
                          href={`/work/${workSlug(e)}/`}
                          onMouseEnter={sound.tick}
                          className="text-foreground underline decoration-muted-foreground/50 underline-offset-[3px] transition-colors hover:decoration-foreground"
                        >
                          {e.company}
                        </a>{' '}
                        {shortRole(e)}
                      </Fragment>
                    ))
                  : era.sub}
              </p>
              {era.text && <p className="mt-3.5 max-w-[56ch] text-pretty text-[14px] leading-relaxed text-foreground/70">{era.text}</p>}
              {era.cards.length > 0 && (
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {era.cards.map((c) => (
                    <li key={c.title || c.repo} className="grid">
                      <Card item={withRepo(c, repos)} />
                    </li>
                  ))}
                </ul>
              )}
              {era.chips.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {era.chips.map((c) => (
                    <li key={c.title}>
                      <Chip item={c} />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
