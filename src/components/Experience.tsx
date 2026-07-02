import { experience } from '../data/content';
import type { Experience as ExperienceEntry } from '../data/types';
import { SectionHeading, headingIconClass } from './ui/SectionHeading';
import { TracingBeam } from './ui/TracingBeam';
import { BlurFade } from './ui/BlurFade';
import { SpotlightGlow } from './ui/SpotlightGlow';
import { BriefcaseIcon } from './ui/Icons';

// Skill chips per company (experience.json carries prose, not tags).
const COMPANY_SKILLS: Record<string, string[]> = {
  'Deepchain Labs': ['Blockchain', 'Cybersecurity', 'Quantum Cryptography', 'Research'],
  'BetaScript LLC': ['React 19', 'TypeScript', 'TanStack Start', 'Netlify'],
  BDTracks: ['Python', 'Web Scraping', 'Gemini', 'Vertex AI'],
  Unies: ['RAG', 'LangChain', 'Pinecone', 'FastAPI'],
  AIUB: ['C++', 'OpenGL', 'SFML', 'SQLite', 'Team Lead'],
};

function initials(company: string): string {
  return company
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function ExperienceCard({ item }: { item: ExperienceEntry }) {
  const skills = COMPANY_SKILLS[item.company] ?? [];
  return (
    <div className="group/glow relative overflow-hidden rounded-xl border bg-card/60 p-4 backdrop-blur-sm transition-colors duration-300 hover:border-ring/60">
      <SpotlightGlow />
      <div className="flex flex-row space-x-3">
        <span
          aria-hidden="true"
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-secondary text-xs font-bold text-secondary-foreground sm:h-10 sm:w-10"
        >
          {initials(item.company)}
        </span>
        <div className="mb-2 flex flex-col">
          <p className="text-balance text-sm font-bold leading-normal tracking-tight text-foreground sm:text-base">
            {item.role}
            <span className="mx-1" aria-hidden="true">
              •
            </span>
            {item.company}
          </p>
          <p className="mt-1 text-balance text-xs font-normal leading-none tracking-tight text-muted-foreground md:text-sm">
            {item.date}
          </p>
        </div>
      </div>
      <p className="mt-2 text-left text-sm text-muted-foreground sm:text-base">{item.desc}</p>
      {skills.length > 0 && (
        <div className="mt-4 flex flex-row flex-wrap gap-2">
          {skills.map((skill, index) => (
            <BlurFade key={skill} delay={0.05 + index * 0.05} direction="up" inView>
              <span className="flex items-center justify-center rounded-sm bg-secondary px-2 py-1 text-xs font-semibold leading-none tracking-tight text-secondary-foreground transition-colors md:text-sm">
                {skill}
              </span>
            </BlurFade>
          ))}
        </div>
      )}
    </div>
  );
}

/** Experience: tracing-beam timeline of roles (reference style, my data). */
export function Experience() {
  return (
    <section id="experience" className="scroll-mt-28">
      <SectionHeading icon={<BriefcaseIcon className={headingIconClass} />}>
        Experience
      </SectionHeading>
      <TracingBeam>
        <div className="space-y-4">
          {experience.map((item, index) => (
            <BlurFade key={`${item.company}-${item.role}`} delay={0.1 + index * 0.05} direction="right" inView>
              <ExperienceCard item={item} />
            </BlurFade>
          ))}
        </div>
      </TracingBeam>
    </section>
  );
}
