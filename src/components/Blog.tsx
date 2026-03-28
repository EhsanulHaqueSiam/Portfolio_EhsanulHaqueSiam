import { m } from 'framer-motion';
import { blogPosts } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';

const ease = [0.22, 1, 0.36, 1];

const platformColors: Record<string, string> = {
  devto: 'bg-white/10 text-white',
  medium: 'bg-green-500/10 text-green-400',
  hashnode: 'bg-blue-500/10 text-blue-400',
  other: 'bg-gray-500/10 text-gray-400',
};

const platformLabels: Record<string, string> = {
  devto: 'DEV.to',
  medium: 'Medium',
  hashnode: 'Hashnode',
  other: 'Blog',
};

function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

export function Blog() {
  return (
    <section id="blog" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <SectionHeader number="09" title="Writing" />

        <m.p
          className="text-gray-400 text-lg sm:text-xl max-w-2xl mb-10 sm:mb-16 -mt-6 sm:-mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Technical deep-dives on the systems I build — architecture decisions, performance wins, and lessons from production.
        </m.p>

        {/* Blog cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {blogPosts.map((post, i) => {
            const isComingSoon = post.url === '#';
            const Tag = isComingSoon ? 'div' : 'a';

            return (
              <m.div
                key={post.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12, ease }}
              >
                <Tag
                  {...(!isComingSoon ? { href: post.url, target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={`group relative flex flex-col h-full p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-space-800/80 to-space-800/40 backdrop-blur-sm border border-white/5 transition-[border-color] duration-200 overflow-hidden ${
                    isComingSoon ? 'cursor-default' : 'hover:border-white/10 cursor-pointer'
                  }`}
                >
                  {/* Hover glow */}
                  <div className="absolute -top-20 -left-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-250" />

                  {/* Top row: platform + read time */}
                  <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6 relative z-10">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-mono tracking-wide ${platformColors[post.platform]}`}>
                      {platformLabels[post.platform]}
                    </span>
                    <div className="flex items-center gap-3">
                      {post.readTime && (
                        <span className="text-gray-600 text-xs font-mono">{post.readTime}</span>
                      )}
                      {!isComingSoon && (
                        <ArrowIcon className="w-4 h-4 text-gray-600 group-hover:text-violet-400 transition-colors duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transform" />
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="relative z-10 text-lg sm:text-xl font-display font-bold text-white mb-3 group-hover:text-violet-300 transition-colors duration-300 leading-snug">
                    {post.title}
                  </h3>

                  {/* Description */}
                  <p className="relative z-10 text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                    {post.description}
                  </p>

                  {/* Tags */}
                  <div className="relative z-10 flex flex-wrap gap-2 mt-auto">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs text-gray-600 font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Status badge */}
                  {isComingSoon && (
                    <div className="absolute top-6 right-6 sm:top-8 sm:right-8">
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-amber-500/10 text-amber-400/70 tracking-wide">
                        Soon
                      </span>
                    </div>
                  )}

                  {/* Bottom gradient line */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-violet-500 to-amber-500 opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
                </Tag>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
