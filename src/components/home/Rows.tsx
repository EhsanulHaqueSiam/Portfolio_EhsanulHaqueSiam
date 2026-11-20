import type { ReactNode } from 'react';
import { companyLogo, education, featuredExperience, featuredPublications, paperSlug, workSlug } from '../../data/content';
import type { Experience as Exp, Publication } from '../../data/types';
import { haptic } from '../../lib/haptics';
import { sound } from '../../lib/sound';
import { GlideList } from '../../lib/useGlide';
import { ResumeIcon } from '../ui/Icons';
import { ext, HeaderLink, Section } from './chrome';
import { ChevronIcon } from './icons';

/** "Jun 2026–Present" -> "Jun 2026 – now"; "Apr 2026–May 2026" -> "Apr – May 2026". */
export function shortRange(date: string) {
  const [from, to = ''] = date.split(/\s*[–-]\s*/);
  if (/present/i.test(to)) return `${from} – now`;
  const [fm, fy] = from.split(' ');
  const [tm, ty] = to.split(' ');
  return fy && fy === ty ? `${fm} – ${tm} ${ty}` : `${from} – ${to}`;
}

/** "Apr 2026 | Published (IEEE Xplore, Scopus Indexed)" -> { when, year, status } */
export function pubMeta(p: Publication) {
  const [when, status = ''] = p.date.split('|').map((s) => s.trim());
  return { when, year: when.split(' ').pop() ?? when, status };
}

/** Role without the "(Part-time, ~20 hrs/week)" tail, for dense rows. */
export const shortRole = (e: Exp) => e.role.replace(/\s*\(.*\)$/, '');

/** Logo tile for a company: its real logo when we have one, else the initial. */
export function CompanyMark({ e, size = 28 }: { e: Exp; size?: number }) {
  const logo = companyLogo(e);
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className="grid shrink-0 place-items-center overflow-hidden rounded-[7px] border border-border bg-card text-[12px] font-semibold"
    >
      {logo ? <img src={logo} alt="" width={size} height={size} loading="lazy" className="h-full w-full object-cover" /> : e.company[0]}
    </span>
  );
}

/** A dense list row (mark, title + sub, right meta) that links somewhere, with tick sound and haptic. */
export function LinkRow({ href, mark, title, sub, right }: { href: string; mark: ReactNode; title: string; sub: string; right: string }) {
  return (
    <a
      href={href}
      {...ext(href)}
      onMouseEnter={sound.tick}
      onClick={haptic}
      className="group -mx-2 grid grid-cols-[28px_1fr_auto] items-center gap-3 rounded-lg px-2 py-2.5"
    >
      {mark}
      <span className="min-w-0">
        <span className="block text-[14px] font-medium leading-snug">{title}</span>
        <span className="block text-[13px] text-muted-foreground">{sub}</span>
      </span>
      <span className="flex items-center gap-1.5 whitespace-nowrap font-mono text-[12px] text-muted-foreground">
        {right}
        <ChevronIcon className="icon-nudge h-3.5 w-3.5 -rotate-90 opacity-0 transition-opacity group-hover:opacity-100" />
      </span>
    </a>
  );
}

export function Experience() {
  return (
    <Section id="experience" title="Experience" aside={<HeaderLink href="#resume">CV</HeaderLink>}>
      <GlideList className="divide-y divide-border">
        {featuredExperience.map((e) => (
          <li key={e.company}>
            <LinkRow href={`/work/${workSlug(e)}/`} mark={<CompanyMark e={e} />} title={e.company} sub={shortRole(e)} right={shortRange(e.date)} />
          </li>
        ))}
      </GlideList>
    </Section>
  );
}

export const PaperMark = () => (
  <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-[7px] border border-border bg-card">
    <ResumeIcon className="h-3.5 w-3.5 text-muted-foreground" />
  </span>
);

export function Research() {
  return (
    <Section id="publications" title="Research" aside={<HeaderLink href="/publications/">All publications</HeaderLink>}>
      <GlideList className="divide-y divide-border">
        {featuredPublications.map((p) => {
          const { year, status } = pubMeta(p);
          return (
            <li key={p.title}>
              <LinkRow href={`/publications/${paperSlug(p)}/`} mark={<PaperMark />} title={p.title} sub={[p.conference, status].filter(Boolean).join(' · ')} right={year} />
            </li>
          );
        })}
      </GlideList>
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
