import { featuredProjects, getProjectImage } from '../data/content';
import type { Project } from '../data/types';
import { SectionHeading, headingIconClass } from './ui/SectionHeading';
import { BlurFade } from './ui/BlurFade';
import { TiltCard } from './ui/TiltCard';
import { GlowCard } from './ui/GlowCard';
import { OptimizedImage } from './ui/OptimizedImage';
import { BrushIcon, GitHubIcon, ExternalLinkIcon, ArrowUpRightIcon } from './ui/Icons';

function ProjectCard({ project }: { project: Project }) {
  const href = project.links?.view || project.links?.code || '#';
  const image = project.images?.[0] ? getProjectImage(project.images[0]) : null;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group block h-full">
      <GlowCard
        className="transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/5"
        cursorEmoji="🚀"
      >
        {/* Cover */}
        <div className="relative h-44 overflow-hidden bg-muted sm:h-52">
          {image && (
            <OptimizedImage
              src={image}
              alt={project.name}
              aspectRatio="16/9"
              sizes="(max-width: 640px) 100vw, 50vw"
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
            />
          )}
          <div className="absolute right-2 top-2 z-20 rounded-full bg-black/25 p-1.5 text-white opacity-100 backdrop-blur-sm transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
            <ArrowUpRightIcon className="h-4 w-4" />
          </div>
          {/* Headline impact metric, always visible (mobile included) */}
          {project.metrics?.[0] && (
            <span className="absolute bottom-2 left-2 z-20 max-w-[85%] truncate rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
              {project.metrics[0]}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-base font-semibold tracking-tight text-foreground">{project.name}</h3>
          <p className="mt-2 line-clamp-4 text-pretty text-sm text-muted-foreground">{project.desc}</p>

          {project.tags && project.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tags.slice(0, 7).map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Links */}
          <div className="mt-auto flex items-center gap-2 pt-4">
            {project.links?.view && (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground">
                <ExternalLinkIcon className="h-3 w-3" />
                Live
              </span>
            )}
            {project.links?.code && (
              // biome-ignore lint/a11y/useSemanticElements: a real <a> cannot nest inside the card's <a>; span[role=link] keeps it keyboard-operable
              <span
                role="link"
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(project.links!.code!, '_blank', 'noopener');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(project.links!.code!, '_blank', 'noopener');
                  }
                }}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
              >
                <GitHubIcon className="h-3 w-3" />
                Code
              </span>
            )}
            {project.metrics?.[1] && (
              <span className="ml-auto hidden truncate text-[11px] text-muted-foreground sm:block">
                {project.metrics[1]}
              </span>
            )}
          </div>
        </div>
      </GlowCard>
    </a>
  );
}

/** Projects: two-column card grid (reference style, my data). */
export function Projects() {
  return (
    <section id="projects" className="scroll-mt-28">
      <SectionHeading icon={<BrushIcon className={headingIconClass} />}>Projects</SectionHeading>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {featuredProjects.map((project, index) => (
          <BlurFade key={project.name} delay={0.08 + index * 0.05} inView className="h-full">
            <TiltCard>
              <ProjectCard project={project} />
            </TiltCard>
          </BlurFade>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <a
          href="https://github.com/EhsanulHaqueSiam?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          See more on GitHub
          <ArrowUpRightIcon className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
