import { useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { caseStudies, getProjectImage } from '../data/content';
import type { Project } from '../data/types';
import { SectionHeading, headingIconClass } from './ui/SectionHeading';
import { BlurFade } from './ui/BlurFade';
import { GlowCard } from './ui/GlowCard';
import { BorderBeam } from './ui/BorderBeam';
import { OptimizedImage } from './ui/OptimizedImage';
import { SearchIcon, ExternalLinkIcon, GitHubIcon } from './ui/Icons';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function StudyArticle({ project }: { project: Project }) {
  const cs = project.caseStudy!;
  const image = project.images?.[0] ? getProjectImage(project.images[0]) : null;

  return (
    <article aria-label={`${project.name} case study`}>
      <GlowCard contentClassName="p-5 sm:p-7" cursorEmoji="🔬">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              {project.name}
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.tags.slice(0, 6).map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {project.links?.view && (
              <a
                href={project.links.view}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                <ExternalLinkIcon className="h-3.5 w-3.5" />
                Live
              </a>
            )}
            {project.links?.code && (
              <a
                href={project.links.code}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
              >
                <GitHubIcon className="h-3.5 w-3.5" />
                Code
              </a>
            )}
          </div>
        </div>

        {/* Problem → Approach, cover alongside on wide screens */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-signal-problem">
                Problem
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{cs.problem}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-signal-success">
                Approach
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{cs.solution}</p>
            </div>
          </div>
          {image && (
            <a
              href={project.links?.view || project.links?.code || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group/cover hidden overflow-hidden rounded-lg border border-border lg:block"
              aria-label={`Open ${project.name}`}
            >
              <OptimizedImage
                src={image}
                alt={project.name}
                aspectRatio="16/9"
                sizes="260px"
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover/cover:scale-105"
              />
            </a>
          )}
        </div>

        {/* Process steps */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {cs.process.map((step, i) => (
            <div
              key={step.title}
              className="group/step rounded-lg border border-border/60 bg-background/40 p-4 transition-colors duration-300 hover:border-ring/60 hover:bg-secondary/30"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-semibold tabular-nums text-muted-foreground transition-colors group-hover/step:text-foreground">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h4 className="text-sm font-semibold tracking-tight text-foreground">{step.title}</h4>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Measured results */}
        <div className="relative mt-6 overflow-hidden rounded-lg border">
          <BorderBeam size={80} duration={8} colorFrom="#5ee7f5" colorTo="rgba(94,231,245,0)" />
          <dl className="grid grid-cols-2 sm:grid-cols-4">
            {cs.results.map((r, i) => (
              <div
                key={r.label}
                className={`flex flex-col items-center px-3 py-4 text-center transition-colors duration-300 hover:bg-secondary/40 sm:py-5 ${
                  i > 0 ? 'sm:border-l sm:border-border/60' : ''
                } ${i % 2 === 1 ? 'max-sm:border-l max-sm:border-border/60' : ''} ${
                  i >= 2 ? 'max-sm:border-t max-sm:border-border/60' : ''
                }`}
              >
                <dd className="text-xl font-semibold tracking-tighter text-accent-emphasis sm:text-2xl">
                  {r.value}
                </dd>
                <dt className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                  {r.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </GlowCard>
    </article>
  );
}

/**
 * Deep-dive case studies: problem → approach → measured result, switchable
 * between the technical story (ScholarHub) and the business one (Claypit).
 */
export function CaseStudies() {
  const [active, setActive] = useState(0);
  if (caseStudies.length === 0) return null;

  return (
    <section id="case-studies" className="scroll-mt-28">
      <SectionHeading icon={<SearchIcon className={headingIconClass} />}>
        Case Studies
      </SectionHeading>

      <p className="mx-auto mb-8 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
        How I take a problem apart: what was broken, what I built, and what measurably changed.
      </p>

      {/* Study switcher */}
      {caseStudies.length > 1 && (
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-full border border-border bg-card/60 p-1">
            {caseStudies.map((p, i) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={`relative rounded-full px-4 py-1.5 text-xs font-semibold transition-colors duration-300 sm:text-sm ${
                  active === i ? 'text-background' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {active === i && (
                  <m.span
                    layoutId="case-study-pill"
                    className="absolute inset-0 rounded-full bg-foreground"
                    transition={{ duration: 0.35, ease: EASE }}
                  />
                )}
                <span className="relative">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <BlurFade delay={0.08} inView>
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={caseStudies[active].name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <StudyArticle project={caseStudies[active]} />
          </m.div>
        </AnimatePresence>
      </BlurFade>
    </section>
  );
}
