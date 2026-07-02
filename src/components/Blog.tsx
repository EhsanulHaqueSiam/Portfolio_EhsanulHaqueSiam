import { m } from 'framer-motion';
import { blogPosts } from '../data/content';
import type { BlogPost } from '../data/types';
import { SectionHeader } from './ui/SectionHeader';
import { ArrowUpRightIcon } from './ui/Icons';

const EASE = [0.16, 1, 0.3, 1] as const;

const platformLabels: Record<BlogPost['platform'], string> = {
  devto: 'DEV.TO',
  medium: 'MEDIUM',
  hashnode: 'HASHNODE',
  other: 'BLOG',
};

/**
 * 12 / Field Notes — writing rendered as a table-of-contents ledger.
 * Entries with url === '#' are unlinked rows carrying a mono IN PRESS
 * chip; live entries are external links with an arrow.
 * (Currently unmounted in App.tsx — exports kept identical for later use.)
 */
export function Blog() {
  const inPressCount = blogPosts.filter((post) => post.url === '#').length;
  const annotation =
    inPressCount > 0
      ? `${blogPosts.length} ENTRIES · ${inPressCount} IN PRESS`
      : `${blogPosts.length} ENTRIES`;

  return (
    <section id="blog" className="py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeader
          number="12"
          name="FIELD NOTES"
          title={
            <>
              Field <em>notes</em>
            </>
          }
          annotation={annotation}
        />

        <m.p
          className="-mt-4 mb-12 max-w-2xl font-body text-base leading-relaxed text-ink-600 sm:-mt-8 sm:mb-16 sm:text-lg"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          Technical deep-dives on the systems I build — architecture decisions,
          performance wins, and lessons from production.
        </m.p>

        {/* Ledger — table of contents */}
        <ol className="m-0 list-none border-t rule-strong p-0">
          {blogPosts.map((post, i) => {
            const isComingSoon = post.url === '#';
            const Tag = isComingSoon ? 'div' : 'a';

            return (
              <li key={post.title} className="border-b rule">
                <m.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
                >
                  <Tag
                    {...(!isComingSoon
                      ? {
                          href: post.url,
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          'aria-label': `Read ${post.title} (opens in new tab)`,
                        }
                      : {})}
                    className={`group block -mx-2 px-2 py-6 transition-colors duration-300 sm:-mx-4 sm:px-4 sm:py-8 ${
                      isComingSoon ? '' : 'cursor-pointer hover:bg-paper-50'
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:grid sm:grid-cols-[4rem_1fr_auto] sm:items-baseline sm:gap-x-6">
                      {/* Entry index */}
                      <span className="folio text-[10px] sm:text-[11px]" aria-hidden="true">
                        12.{String(i + 1).padStart(2, '0')}
                      </span>

                      {/* Title + dotted leader */}
                      <div className="flex min-w-0 items-baseline">
                        <h3
                          className={`font-display font-light text-xl leading-snug text-ink-900 transition-colors duration-300 sm:text-2xl lg:text-3xl ${
                            isComingSoon ? '' : 'group-hover:text-vermilion'
                          }`}
                        >
                          {post.title}
                        </h3>
                        <span className="leader hidden sm:block" aria-hidden="true" />
                      </div>

                      {/* Right column: read time + status */}
                      <div className="flex items-center gap-3 sm:justify-end sm:gap-4">
                        {post.readTime && (
                          <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500 sm:text-[11px]">
                            {post.readTime}
                          </span>
                        )}
                        {isComingSoon ? (
                          <span className="whitespace-nowrap border border-vermilion px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-vermilion sm:text-[11px]">
                            IN PRESS
                          </span>
                        ) : (
                          <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-ink-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-vermilion" />
                        )}
                      </div>

                      {/* Abstract + citation line */}
                      <div className="sm:col-span-2 sm:col-start-2 sm:mt-2">
                        <p className="max-w-prose font-body text-sm leading-relaxed text-ink-500 sm:text-base">
                          {post.description}
                        </p>
                        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400 sm:text-[11px]">
                          {platformLabels[post.platform]}
                          <span aria-hidden="true"> · </span>
                          {post.date}
                          {post.tags.length > 0 && (
                            <>
                              <span aria-hidden="true"> · </span>
                              {post.tags.join(' · ')}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </Tag>
                </m.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
