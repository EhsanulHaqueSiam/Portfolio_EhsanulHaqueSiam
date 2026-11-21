import type { ReactNode } from 'react';
import { education, profile } from '../../data/content';
import { haptic } from '../../lib/haptics';
import { sound } from '../../lib/sound';
import { ArrowUpRightIcon } from '../ui/Icons';
import { ext, links, moreLinks, Section } from './chrome';
import { RollNumber } from './RollNumber';

const U = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} {...ext(href)} className="font-medium text-foreground underline decoration-foreground/30 underline-offset-[3px] transition-colors hover:decoration-foreground">
    {children}
  </a>
);

/** A link underlined by hand: a wavy pen stroke that draws itself in once on load (.scribble in index.css). */
const Scribbled = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} {...ext(href)} className="scribble relative inline-block font-medium text-foreground">
    {children}
    <svg viewBox="0 0 100 9" preserveAspectRatio="none" aria-hidden="true" className="absolute -bottom-[5px] -left-0.5 h-[7px] w-[calc(100%+4px)] overflow-visible">
      <path d="M1 5 C 12 1, 20 8, 32 4 S 55 2, 66 5 S 88 7, 99 3" pathLength={1} />
    </svg>
  </a>
);

const cgpa = education[0]?.details.find((d) => d.startsWith('Cumulative CGPA'))?.replace('Cumulative ', '');

/**
 * hq's headline stats ("1.5x revenue growth", ...) as a quiet row closing About: the
 * numbers a recruiter scans for, one short scroll from the top, without crowding the hero.
 * Each rolls up once like an odometer (sans figures: the odometer needs fixed-width digits).
 */
function Stats() {
  if (!profile.stats.length) return null;
  return (
    <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-dashed border-border pt-4 sm:grid-cols-4">
      {profile.stats.map((s) => {
        // "1.5x" -> 1.5 + "x", "50K+" -> 50 + "K+"; anything without a leading number shows as is.
        const m = s.value.match(/^([\d.]+)(.*)$/);
        return (
          <div key={s.label} className="flex flex-col-reverse">
            <dt className="mt-0.5 text-[12px] text-muted-foreground">{s.label}</dt>
            <dd className="text-[20px] font-medium leading-tight tracking-[-0.01em]">
              {m ? (
                <>
                  <RollNumber value={Number(m[1])} format={{ maximumFractionDigits: 1 }} fromZero />
                  {m[2]}
                </>
              ) : (
                s.value
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

export function About() {
  return (
    <Section id="about" title="About">
      <ul className="grid gap-2.5 text-[15px] leading-relaxed text-foreground/85">
        <li className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-muted-foreground">
          {profile.currentRole} at <Scribbled href="https://ledgercross.com">{profile.currentCompany}</Scribbled>: backend services, React Native and Flutter apps, AI features, and the CI/CD and cloud
          infrastructure that ship them.
        </li>
        <li className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-muted-foreground">
          Lead Researcher (NLP &amp; LLMs) at <U href="https://arche-lab.org">Arché Intelligence Lab</U>. Papers in <U href="/publications/">IEEE Xplore and Taylor &amp; Francis</U>.
        </li>
        <li className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-muted-foreground">
          Contributor to <U href="#open-source">T3 Code and Better Auth</U>. CSE at AIUB{cgpa ? `, ${cgpa}` : ''}.
        </li>
      </ul>
      <Stats />
    </Section>
  );
}

export function Contact() {
  return (
    <Section id="contact" title="Contact">
      <ul className="flex flex-wrap gap-2">
        {[...links, ...moreLinks].map((l, i) => (
          <li key={l.label}>
            <a
              href={l.href}
              {...ext(l.href)}
              onMouseEnter={() => sound.note(i)}
              onClick={() => haptic()}
              className="press group inline-flex items-center gap-2 rounded-lg border border-border bg-card py-1.5 pl-1.5 pr-2.5 text-[13px] transition-colors hover:border-foreground/25"
            >
              <span className="grid h-6 w-6 place-items-center rounded-md bg-secondary text-foreground/80">
                <span className="icon-pop block h-3.5 w-3.5">{l.icon}</span>
              </span>
              {l.label === 'Google Scholar' ? 'Scholar' : l.label}
              <ArrowUpRightIcon className="icon-arrow h-3 w-3 text-muted-foreground" />
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
