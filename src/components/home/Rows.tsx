import { education, featuredExperience, featuredPublications } from '../../data/content';
import type { Publication } from '../../data/types';
import { sound } from '../../lib/sound';
import { ResumeIcon } from '../ui/Icons';
import { HeaderLink, Section } from './chrome';

/** "Jun 2026–Present" -> "Jun 2026 – now"; "Apr 2026–May 2026" -> "Apr – May 2026". */
export function shortRange(date: string) {
  const [from, to = ''] = date.split(/\s*[–-]\s*/);
  if (/present/i.test(to)) return `${from} – now`;
  const [fm, fy] = from.split(' ');
  const [tm, ty] = to.split(' ');
  return fy && fy === ty ? `${fm} – ${tm} ${ty}` : `${from} – ${to}`;
}

/** "Apr 2026 | Published (IEEE Xplore, Scopus Indexed)" -> { when, status } */
export function pubMeta(p: Publication) {
  const [when, status = ''] = p.date.split('|').map((s) => s.trim());
  return { when, year: when.split(' ').pop() ?? when, status };
}

function Row({ mark, title, sub, right, href }: { mark: React.ReactNode; title: string; sub: string; right: string; href?: string | null }) {
  const body = (
    <>
      <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-[7px] border border-border bg-card text-[12px] font-semibold">
        {mark}
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-medium leading-snug">{title}</span>
        <span className="block text-[13px] text-muted-foreground">{sub}</span>
      </span>
      <span className="whitespace-nowrap text-right font-mono text-[12px] text-muted-foreground">{right}</span>
    </>
  );
  const cls = 'grid grid-cols-[28px_1fr_auto] items-center gap-3 py-2.5';
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" onMouseEnter={sound.tick} className={`${cls} -mx-2 rounded-lg px-2 transition-colors hover:bg-secondary/60`}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export function Experience() {
  return (
    <Section id="experience" title="Experience" aside={<HeaderLink href="#resume">CV</HeaderLink>}>
      <ul className="divide-y divide-border">
        {featuredExperience.map((e) => (
          <li key={e.company}>
            <Row
              mark={e.logo ? <img src={`/images/experience/${e.logo}.webp`} alt="" width={28} height={28} loading="lazy" className="h-full w-full object-cover" /> : e.company[0]}
              title={e.company}
              sub={e.role.replace(/\s*\(.*\)$/, '')}
              right={shortRange(e.date)}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Research() {
  return (
    <Section id="publications" title="Research" aside={<HeaderLink href="/publications">All publications</HeaderLink>}>
      <ul className="divide-y divide-border">
        {featuredPublications.map((p) => {
          const { year, status } = pubMeta(p);
          return (
            <li key={p.title}>
              <Row mark={<ResumeIcon className="h-3.5 w-3.5 text-muted-foreground" />} title={p.title} sub={[p.conference, status].filter(Boolean).join(' · ')} right={year} href={p.paperLink} />
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export function Education() {
  return (
    <Section id="education" title="Education">
      <ul className="divide-y divide-border">
        {education.map((ed) => (
          <li key={ed.institution} className="py-2.5">
            <div className="grid grid-cols-[1fr_auto] items-baseline gap-3">
              <span className="text-[14px] font-medium">{ed.institution}</span>
              <span className="whitespace-nowrap font-mono text-[12px] text-muted-foreground">
                {ed.start} – {ed.end}
              </span>
            </div>
            <p className="text-[13px] text-muted-foreground">{ed.degree}</p>
            <ul className="mt-2 grid gap-1 text-[13px] text-foreground/80">
              {ed.details.map((d) => (
                <li key={d} className="relative pl-3.5 before:absolute before:left-0 before:top-[0.65em] before:h-1 before:w-1 before:rounded-full before:bg-muted-foreground">
                  {d}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}
