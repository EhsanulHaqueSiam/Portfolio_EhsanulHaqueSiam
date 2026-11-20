import type { ReactNode } from 'react';
import { education, profile } from '../../data/content';
import { haptic } from '../../lib/haptics';
import { sound } from '../../lib/sound';
import { ArrowUpRightIcon } from '../ui/Icons';
import { ext, links, moreLinks, Section } from './chrome';

const U = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} {...ext(href)} className="font-medium text-foreground underline decoration-foreground/30 underline-offset-[3px] transition-colors hover:decoration-foreground">
    {children}
  </a>
);

const cgpa = education[0]?.details.find((d) => d.startsWith('Cumulative CGPA'))?.replace('Cumulative ', '');

export function About() {
  return (
    <Section id="about" title="About">
      <ul className="grid gap-2.5 text-[15px] leading-relaxed text-foreground/85">
        <li className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-muted-foreground">
          {profile.currentRole} at <U href="https://ledgercross.com">{profile.currentCompany}</U>: backend services, React Native and Flutter apps, AI features, and the CI/CD and cloud
          infrastructure that ship them.
        </li>
        <li className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-muted-foreground">
          Lead Researcher (NLP &amp; LLMs) at <U href="https://arche-lab.org">Arché Intelligence Lab</U>. Papers in <U href="/publications/">IEEE Xplore and Taylor &amp; Francis</U>.
        </li>
        <li className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-muted-foreground">
          Contributor to <U href="#open-source">T3 Code and Better Auth</U>. CSE at AIUB{cgpa ? `, ${cgpa}` : ''}.
        </li>
      </ul>
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
