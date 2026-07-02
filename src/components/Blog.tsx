import { blogPosts } from '../data/content';
import type { BlogPost } from '../data/types';
import { SectionHeading, headingIconClass } from './ui/SectionHeading';
import { BlurFade } from './ui/BlurFade';
import { SpotlightGlow } from './ui/SpotlightGlow';
import { PencilIcon, ArrowUpRightIcon } from './ui/Icons';

const platformLabels: Record<BlogPost['platform'], string> = {
  devto: 'DEV.to',
  medium: 'Medium',
  hashnode: 'Hashnode',
  other: 'Blog',
};

function WritingCard({ post }: { post: BlogPost }) {
  const isComingSoon = post.url === '#';
  const Wrapper = isComingSoon ? 'div' : 'a';

  return (
    <Wrapper
      {...(!isComingSoon
        ? {
            href: post.url,
            target: '_blank',
            rel: 'noopener noreferrer',
            'aria-label': `Read ${post.title} (opens in new tab)`,
          }
        : {})}
      className="group block h-full"
    >
      <div className="group/glow relative flex h-full flex-col overflow-hidden rounded-xl border bg-card/60 p-4 backdrop-blur-sm transition-colors duration-300 hover:border-ring/60">
        <SpotlightGlow />
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold leading-snug tracking-tight text-foreground sm:text-base">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
              {post.title}
            </span>
            {!isComingSoon && (
              <ArrowUpRightIcon className="ml-1 inline-block h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            )}
          </h3>
          {isComingSoon && (
            <span className="mt-0.5 shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              In press
            </span>
          )}
        </div>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {post.description}
        </p>
        <p className="mt-auto pt-3 text-xs tabular-nums text-muted-foreground">
          {platformLabels[post.platform]}
          <span className="mx-1" aria-hidden="true">
            •
          </span>
          {post.readTime}
          {post.tags.length > 0 && (
            <>
              <span className="mx-1" aria-hidden="true">
                •
              </span>
              {post.tags.join(', ')}
            </>
          )}
        </p>
      </div>
    </Wrapper>
  );
}

/** Writing: field notes on the systems behind the projects. */
export function Blog() {
  return (
    <section id="blog" className="scroll-mt-28">
      <SectionHeading icon={<PencilIcon className={headingIconClass} />}>Writing</SectionHeading>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post, idx) => (
          <li key={post.title} className="h-full list-none">
            <BlurFade delay={0.05 + idx * 0.05} inView className="h-full">
              <WritingCard post={post} />
            </BlurFade>
          </li>
        ))}
      </ul>
    </section>
  );
}
