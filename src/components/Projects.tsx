import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { featuredProjects, profile, getProjectImage } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';
import { TiltCard } from './ui/TiltCard';
import { MagneticHover } from './ui/ImageDistortion';
import { OptimizedImage } from './ui/OptimizedImage';
import { GitHubIcon, ExternalLinkIcon } from './ui/Icons';

const categories = ['All', 'machine_learning', 'nlp', 'web', 'frontend', 'desktop_app', 'mobile', 'database', 'gamedev', 'graphics', 'web_scraping', 'automation'];
const categoryLabels: Record<string, string> = {
  'All': 'All Projects',
  'machine_learning': 'AI/ML',
  'nlp': 'NLP',
  'web': 'Web',
  'frontend': 'Frontend',
  'desktop_app': 'Desktop',
  'mobile': 'Mobile',
  'database': 'Database',
  'gamedev': 'Game Dev',
  'graphics': 'Graphics',
  'web_scraping': 'Scraping',
  'automation': 'Automation',
};

const hasLiveDemo = (view?: string): view is string =>
  typeof view === 'string' && view.trim() !== '' && view !== '#';

export function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects =
    activeCategory === 'All'
      ? featuredProjects
      : featuredProjects.filter((p) => p.categories.includes(activeCategory));

  const featuredProject = filteredProjects[0];
  const gridProjects = filteredProjects.slice(1);

  return (
    <section id="projects" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-32 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader number="05" title="Featured Projects" />

        {/* Featured project spotlight */}
        {featuredProject && (
          <m.div
            className="mb-12 sm:mb-16 md:mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <TiltCard className="group" maxTilt={3}>
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6 md:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-space-800/80 to-space-800/40 border border-white/5 backdrop-blur-sm">
                {/* Project image */}
                <div className="relative overflow-hidden rounded-2xl group/image">
                  <div className="aspect-video bg-gradient-to-br from-violet-500/20 to-amber-500/10 overflow-hidden">
                    {featuredProject.images[0] && (
                      <OptimizedImage
                        src={getProjectImage(featuredProject.images[0])}
                        alt={featuredProject.name}
                        priority
                        aspectRatio="16/9"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="w-full h-full transition-transform duration-300 group-hover/image:scale-105"
                      />
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-space-900/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-200" />
                  </div>
                  {/* Featured badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full border border-amber-500/30 backdrop-blur-sm">
                    Featured
                  </div>
                </div>

                {/* Project details */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-3 sm:mb-4">
                    {featuredProject.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-4 sm:mb-6">
                    {featuredProject.desc}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                    {featuredProject.metrics.map((metric) => (
                      <div
                        key={metric}
                        className="px-3 sm:px-4 py-2 bg-space-700/30 rounded-lg sm:rounded-xl text-xs sm:text-sm text-gray-300 border border-white/5"
                      >
                        {metric}
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                    {featuredProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-violet-500/10 text-violet-400 rounded-md sm:rounded-lg border border-violet-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {featuredProject.links.code && (
                      <MagneticHover strength={20}>
                        <a
                          href={featuredProject.links.code}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="press-feedback inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-space-900 rounded-full font-medium hover:bg-gray-100 active:bg-gray-200 text-sm sm:text-base min-h-[44px]"
                        >
                          <GitHubIcon />
                          View Code
                        </a>
                      </MagneticHover>
                    )}
                    {hasLiveDemo(featuredProject.links.view) && (
                      <MagneticHover strength={20}>
                        <a
                          href={featuredProject.links.view}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="press-feedback inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border border-white/20 text-white rounded-full font-medium hover:bg-white/5 active:bg-white/10 text-sm sm:text-base min-h-[44px]"
                        >
                          <ExternalLinkIcon />
                          Live Demo
                        </a>
                      </MagneticHover>
                    )}
                  </div>
                </div>
              </div>
            </TiltCard>
          </m.div>
        )}

        {/* Category filter - horizontally scrollable on mobile */}
        <div className="relative mb-12">
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-space-900 to-transparent z-10 pointer-events-none sm:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-space-900 to-transparent z-10 pointer-events-none sm:hidden" />

          <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center sm:overflow-visible">
            {categories.map((category) => (
              <m.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`press-feedback relative px-4 sm:px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 min-h-[44px] ${
                  activeCategory === category
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
              >
                {activeCategory === category && (
                  <m.div
                    layoutId="activeProjectCategory"
                    className="absolute inset-0 bg-violet-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{categoryLabels[category]}</span>
              </m.button>
            ))}
          </div>
        </div>

        {/* Projects grid */}
        <m.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {gridProjects.map((project, index) => {
              const hasDemo = hasLiveDemo(project.links.view);
              const mobilePrimaryLink = hasDemo ? project.links.view : project.links.code;

              return (
                <m.div
                  key={project.name}
                  layout
                  initial={{ opacity: 0, transform: 'scale(0.9) translateY(30px)' }}
                  animate={{
                    opacity: 1,
                    transform: 'scale(1) translateY(0px)',
                    transition: { duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] },
                  }}
                  exit={{
                    opacity: 0,
                    transform: 'scale(0.9) translateY(-30px)',
                    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
                  }}
                >
                <TiltCard className="group h-full" maxTilt={5}>
                  <div className="h-full flex flex-col rounded-2xl bg-space-800/50 border border-white/5 overflow-hidden hover:border-violet-500/30 transition-colors duration-200">
                    {/* Project thumbnail */}
                    <div className="relative aspect-video bg-gradient-to-br from-violet-500/10 to-amber-500/5 overflow-hidden">
                      {project.images[0] ? (
                        <OptimizedImage
                          src={getProjectImage(project.images[0])}
                          alt={project.name}
                          aspectRatio="16/9"
                          className="w-full h-full transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-6xl">
                          {project.categories.includes('machine_learning') && '🧠'}
                          {project.categories.includes('desktop_app') && '🖥️'}
                          {project.categories.includes('mobile') && '📱'}
                          {project.categories.includes('gamedev') && '🎮'}
                          {project.categories.includes('web_scraping') && '🕷️'}
                          {project.categories.includes('graphics') && '🎨'}
                        </div>
                      )}

                      {/* Overlay links */}
                      <m.div
                        className="absolute inset-0 hidden lg:flex items-center justify-center gap-4 bg-space-900/80 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300"
                      >
                        {project.links.code && (
                          <m.a
                            href={project.links.code}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${project.name} source code on GitHub`}
                            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-violet-500 transition-[transform,color,background-color,border-color] duration-150"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <GitHubIcon />
                          </m.a>
                        )}
                        {hasLiveDemo(project.links.view) && (
                          <m.a
                            href={project.links.view}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${project.name} live demo`}
                            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-amber-500 transition-[transform,color,background-color,border-color] duration-150"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <ExternalLinkIcon />
                          </m.a>
                        )}
                      </m.div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-display font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
                        {project.desc}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-violet-400/70 font-mono"
                          >
                            #{tag.toLowerCase().replace(/\s+/g, '-')}
                          </span>
                        ))}
                      </div>

                      {/* Touch-device actions (mobile/tablet): avoid hover-only links */}
                      {mobilePrimaryLink && (
                        <div className="mt-4 flex flex-wrap gap-2 lg:hidden">
                          <a
                            href={mobilePrimaryLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-project-action="mobile-primary"
                            className="press-feedback inline-flex items-center justify-center px-3 py-2 min-h-[44px] rounded-lg border border-white/10 text-sm text-white hover:bg-white/5 active:bg-white/10"
                          >
                            {hasDemo ? 'Open Demo' : 'View Code'}
                          </a>
                          {hasDemo && project.links.code && (
                            <a
                              href={project.links.code}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-project-action="mobile-code"
                              className="press-feedback inline-flex items-center justify-center px-3 py-2 min-h-[44px] rounded-lg border border-white/10 text-sm text-gray-300 hover:bg-white/5 active:bg-white/10"
                            >
                              Code
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </TiltCard>
              </m.div>
              );
            })}
          </AnimatePresence>
        </m.div>

        {/* View more */}
        <m.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <MagneticHover strength={20}>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="press-feedback inline-flex items-center gap-3 px-8 py-4 border border-violet-500/30 text-violet-400 rounded-full font-medium hover:bg-violet-500/10"
            >
              View All on GitHub
              <span className="inline-block arrow-bounce">
                →
              </span>
            </a>
          </MagneticHover>
        </m.div>
      </div>
    </section>
  );
}
